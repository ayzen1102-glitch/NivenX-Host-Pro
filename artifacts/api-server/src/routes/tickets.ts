import { Router, type IRouter } from "express";
import { db, ticketsTable, ticketRepliesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateTicketBody, GetTicketParams, ReplyTicketParams, ReplyTicketBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tickets", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const tickets = await db.select().from(ticketsTable).where(eq(ticketsTable.userId, user.id));
  res.json(tickets);
});

router.post("/tickets", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const parsed = CreateTicketBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { subject, message, priority, department } = parsed.data;
  const [ticket] = await db.insert(ticketsTable).values({
    userId: user.id,
    subject,
    status: "open",
    priority: priority ?? "medium",
    department: department ?? "general",
  }).returning();
  await db.insert(ticketRepliesTable).values({
    ticketId: ticket.id,
    userId: user.id,
    message,
    isStaff: false,
  });
  res.status(201).json(ticket);
});

router.get("/tickets/:id", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const params = GetTicketParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [ticket] = await db.select().from(ticketsTable).where(
    and(eq(ticketsTable.id, params.data.id), eq(ticketsTable.userId, user.id))
  );
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  const replies = await db.select().from(ticketRepliesTable).where(eq(ticketRepliesTable.ticketId, ticket.id));
  res.json({ ...ticket, replies });
});

router.post("/tickets/:id/reply", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const params = ReplyTicketParams.safeParse(req.params);
  const body = ReplyTicketBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [ticket] = await db.select().from(ticketsTable).where(
    and(eq(ticketsTable.id, params.data.id), eq(ticketsTable.userId, user.id))
  );
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  const [reply] = await db.insert(ticketRepliesTable).values({
    ticketId: ticket.id,
    userId: user.id,
    message: body.data.message,
    isStaff: false,
  }).returning();
  await db.update(ticketsTable).set({ status: "pending" }).where(eq(ticketsTable.id, ticket.id));
  res.status(201).json(reply);
});

export default router;
