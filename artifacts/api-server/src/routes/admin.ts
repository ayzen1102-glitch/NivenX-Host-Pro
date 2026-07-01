import { Router, type IRouter } from "express";
import { db, usersTable, plansTable, ticketsTable, invoicesTable, servicesTable, announcementsTable, siteSettingsTable } from "@workspace/db";
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

export default router;
