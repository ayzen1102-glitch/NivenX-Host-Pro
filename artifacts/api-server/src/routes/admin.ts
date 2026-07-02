import { Router, type IRouter } from "express";
import { db, usersTable, plansTable, ticketsTable, invoicesTable, servicesTable, announcementsTable, siteSettingsTable, partnersTable, reviewsTable, gamesTable } from "@workspace/db";
import { eq, count, sum, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { UpdateAdminUserParams, UpdateAdminUserBody, CreateAdminPlanBody, UpdateAdminPlanParams, UpdateAdminPlanBody, DeleteAdminPlanParams, CreateAdminAnnouncementBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [totalUsers] = await db.select({ count: count() }).from(usersTable);
  const [totalRevenue] = await db.select({ total: sum(invoicesTable.amount) }).from(invoicesTable).where(eq(invoicesTable.status, "paid"));
  const [activeServices] = await db.select({ count: count() }).from(servicesTable).where(eq(servicesTable.status, "active"));
  const [openTickets] = await db.select({ count: count() }).from(ticketsTable).where(eq(ticketsTable.status, "open"));
  const [totalInvoices] = await db.select({ count: count() }).from(invoicesTable);
  res.json({
    totalUsers: totalUsers.count,
    totalRevenue: Number(totalRevenue.total ?? 0),
    activeServices: activeServices.count,
    openTickets: openTickets.count,
    totalInvoices: totalInvoices.count,
  });
});

router.get("/admin/users", requireAdmin, async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  res.json(users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, avatarUrl: u.avatarUrl, stripeCustomerId: u.stripeCustomerId, createdAt: u.createdAt })));
});

router.patch("/admin/users/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateAdminUserParams.safeParse(req.params);
  const body = UpdateAdminUserBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [user] = await db.update(usersTable).set(body.data).where(eq(usersTable.id, params.data.id)).returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl, stripeCustomerId: user.stripeCustomerId, createdAt: user.createdAt });
});

router.get("/admin/plans", requireAdmin, async (_req, res): Promise<void> => {
  const plans = await db.select().from(plansTable).orderBy(plansTable.id);
  res.json(plans.map(p => ({ ...p, features: (p.features as string[]) ?? [] })));
});

router.post("/admin/plans", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateAdminPlanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [plan] = await db.insert(plansTable).values(parsed.data as any).returning();
  res.status(201).json({ ...plan, features: (plan.features as string[]) ?? [] });
});

router.patch("/admin/plans/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateAdminPlanParams.safeParse(req.params);
  const body = UpdateAdminPlanBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [plan] = await db.update(plansTable).set(body.data as any).where(eq(plansTable.id, params.data.id)).returning();
  if (!plan) {
    res.status(404).json({ error: "Plan not found" });
    return;
  }
  res.json({ ...plan, features: (plan.features as string[]) ?? [] });
});

router.delete("/admin/plans/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteAdminPlanParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(plansTable).where(eq(plansTable.id, params.data.id));
  res.sendStatus(204);
});

router.get("/admin/tickets", requireAdmin, async (_req, res): Promise<void> => {
  const tickets = await db.select().from(ticketsTable).orderBy(desc(ticketsTable.updatedAt));
  res.json(tickets);
});

router.post("/admin/announcements", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateAdminAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [ann] = await db.insert(announcementsTable).values(parsed.data).returning();
  res.status(201).json(ann);
});

router.get("/admin/settings", requireAdmin, async (_req, res): Promise<void> => {
  const [settings] = await db.select().from(siteSettingsTable).limit(1);
  if (!settings) {
    const [created] = await db.insert(siteSettingsTable).values({}).returning();
    res.json(created);
    return;
  }
  res.json(settings);
});

router.patch("/admin/settings", requireAdmin, async (req, res): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  const allowed = ['siteName','tagline','primaryColor','accentColor','maintenanceMode','discordUrl','twitterUrl','youtubeUrl','instagramUrl','tiktokUrl'];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }
  const [existing] = await db.select().from(siteSettingsTable).limit(1);
  let settings;
  if (!existing) {
    [settings] = await db.insert(siteSettingsTable).values(data as any).returning();
  } else {
    [settings] = await db.update(siteSettingsTable).set(data as any).where(eq(siteSettingsTable.id, existing.id)).returning();
  }
  res.json(settings);
});

// ── Partners ─────────────────────────────────────────────────
router.get("/admin/partners", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select().from(partnersTable).orderBy(partnersTable.sortOrder);
  res.json(rows);
});

router.post("/admin/partners", requireAdmin, async (req, res): Promise<void> => {
  const { name, logoUrl, websiteUrl, sortOrder } = req.body as any;
  if (!name) { res.status(400).json({ error: "name required" }); return; }
  const [row] = await db.insert(partnersTable).values({ name, logoUrl, websiteUrl, sortOrder: sortOrder ?? 0 }).returning();
  res.status(201).json(row);
});

router.patch("/admin/partners/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, logoUrl, websiteUrl, sortOrder, isActive } = req.body as any;
  const data: any = {};
  if (name !== undefined) data.name = name;
  if (logoUrl !== undefined) data.logoUrl = logoUrl;
  if (websiteUrl !== undefined) data.websiteUrl = websiteUrl;
  if (sortOrder !== undefined) data.sortOrder = sortOrder;
  if (isActive !== undefined) data.isActive = isActive;
  const [row] = await db.update(partnersTable).set(data).where(eq(partnersTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/admin/partners/:id", requireAdmin, async (req, res): Promise<void> => {
  await db.delete(partnersTable).where(eq(partnersTable.id, parseInt(req.params.id)));
  res.sendStatus(204);
});

// ── Reviews ──────────────────────────────────────────────────
router.get("/admin/reviews", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select().from(reviewsTable).orderBy(reviewsTable.sortOrder);
  res.json(rows);
});

router.post("/admin/reviews", requireAdmin, async (req, res): Promise<void> => {
  const { name, avatarUrl, rating, comment, source, sortOrder } = req.body as any;
  if (!name || !comment) { res.status(400).json({ error: "name and comment required" }); return; }
  const [row] = await db.insert(reviewsTable).values({ name, avatarUrl, rating: rating ?? 5, comment, source: source ?? "trustpilot", sortOrder: sortOrder ?? 0 }).returning();
  res.status(201).json(row);
});

router.patch("/admin/reviews/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, avatarUrl, rating, comment, source, sortOrder, isActive } = req.body as any;
  const data: any = {};
  if (name !== undefined) data.name = name;
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;
  if (rating !== undefined) data.rating = rating;
  if (comment !== undefined) data.comment = comment;
  if (source !== undefined) data.source = source;
  if (sortOrder !== undefined) data.sortOrder = sortOrder;
  if (isActive !== undefined) data.isActive = isActive;
  const [row] = await db.update(reviewsTable).set(data).where(eq(reviewsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/admin/reviews/:id", requireAdmin, async (req, res): Promise<void> => {
  await db.delete(reviewsTable).where(eq(reviewsTable.id, parseInt(req.params.id)));
  res.sendStatus(204);
});

// ── Games ────────────────────────────────────────────────────
router.get("/admin/games", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select().from(gamesTable).orderBy(gamesTable.sortOrder);
  res.json(rows);
});

router.post("/admin/games", requireAdmin, async (req, res): Promise<void> => {
  const { name, slug, imageUrl, description, sortOrder } = req.body as any;
  if (!name || !slug) { res.status(400).json({ error: "name and slug required" }); return; }
  const [row] = await db.insert(gamesTable).values({ name, slug, imageUrl, description, sortOrder: sortOrder ?? 0 }).returning();
  res.status(201).json(row);
});

router.patch("/admin/games/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, slug, imageUrl, description, sortOrder, isActive } = req.body as any;
  const data: any = {};
  if (name !== undefined) data.name = name;
  if (slug !== undefined) data.slug = slug;
  if (imageUrl !== undefined) data.imageUrl = imageUrl;
  if (description !== undefined) data.description = description;
  if (sortOrder !== undefined) data.sortOrder = sortOrder;
  if (isActive !== undefined) data.isActive = isActive;
  const [row] = await db.update(gamesTable).set(data).where(eq(gamesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/admin/games/:id", requireAdmin, async (req, res): Promise<void> => {
  await db.delete(gamesTable).where(eq(gamesTable.id, parseInt(req.params.id)));
  res.sendStatus(204);
});

export default router;
