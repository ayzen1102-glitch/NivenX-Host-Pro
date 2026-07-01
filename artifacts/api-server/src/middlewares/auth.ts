import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db, sessionsTable, usersTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";

// Hybrid auth: Clerk session cookie (web) OR Bearer token (legacy/API)
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  // 1) Try Clerk session cookie first
  const clerkAuth = getAuth(req);
  if (clerkAuth?.userId) {
    // JIT: find or provision local user record
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkAuth.userId));

    if (existingUser) {
      (req as any).user = existingUser;
      return next();
    }

    // User not yet in DB — provision from Clerk metadata
    const meta = clerkAuth.sessionClaims ?? {};
    const email = (meta as any)?.email as string | undefined;
    const name = ((meta as any)?.name as string | undefined) ?? "User";
    if (email) {
      // Check if email already exists (linking legacy account)
      const [byEmail] = await db.select().from(usersTable).where(eq(usersTable.email, email));
      if (byEmail) {
        // Link the Clerk ID to existing account
        const [updated] = await db
          .update(usersTable)
          .set({ clerkId: clerkAuth.userId })
          .where(eq(usersTable.id, byEmail.id))
          .returning();
        (req as any).user = updated;
        return next();
      }
      // Create new user
      const [newUser] = await db
        .insert(usersTable)
        .values({
          clerkId: clerkAuth.userId,
          email,
          name,
          passwordHash: "clerk-managed",
          role: email === "admin@nivenx.com" ? "admin" : "user",
        })
        .returning();
      (req as any).user = newUser;
      return next();
    }
  }

  // 2) Fall back to Bearer token (legacy sessions)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(and(eq(sessionsTable.token, token), gt(sessionsTable.expiresAt, new Date())));
    if (session) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, session.userId));
      if (user) {
        (req as any).user = user;
        return next();
      }
    }
  }

  res.status(401).json({ error: "Unauthorized" });
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  await requireAuth(req, res, async () => {
    const user = (req as any).user;
    if (user?.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
}
