import { Router, type IRouter } from "express";
import { db, servicesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateServiceBody, GetServiceParams, ServiceActionParams, ServiceActionBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/services", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const services = await db.select().from(servicesTable).where(eq(servicesTable.userId, user.id));
  res.json(services);
});

router.post("/services", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const parsed = CreateServiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { planId, name, location } = parsed.data;
  const [service] = await db.insert(servicesTable).values({
    userId: user.id,
    planId,
    name,
    location,
    status: "active",
    ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    cpuUsage: Math.random() * 40,
    ramUsage: Math.random() * 60,
    diskUsage: Math.random() * 30,
    bandwidthUsed: Math.random() * 100,
  }).returning();
  res.status(201).json(service);
});

router.get("/services/:id", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const params = GetServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [service] = await db.select().from(servicesTable).where(
    and(eq(servicesTable.id, params.data.id), eq(servicesTable.userId, user.id))
  );
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(service);
});

router.post("/services/:id/action", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const params = ServiceActionParams.safeParse(req.params);
  const body = ServiceActionBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [service] = await db.select().from(servicesTable).where(
    and(eq(servicesTable.id, params.data.id), eq(servicesTable.userId, user.id))
  );
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  const { action } = body.data;
  let newStatus = service.status;
  if (action === "start") newStatus = "active";
  else if (action === "stop") newStatus = "stopped";
  else if (action === "restart") newStatus = "active";
  else if (action === "reinstall") newStatus = "active";

  await db.update(servicesTable).set({ status: newStatus }).where(eq(servicesTable.id, params.data.id));
  res.json({ success: true, message: `Action '${action}' performed successfully` });
});

export default router;
