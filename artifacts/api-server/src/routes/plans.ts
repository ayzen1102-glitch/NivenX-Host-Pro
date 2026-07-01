import { Router, type IRouter } from "express";
import { db, plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetPlanParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/plans", async (_req, res): Promise<void> => {
  const plans = await db.select().from(plansTable).where(eq(plansTable.isActive, true));
  res.json(plans.map(p => ({ ...p, features: (p.features as string[]) ?? [] })));
});

router.get("/plans/:id", async (req, res): Promise<void> => {
  const params = GetPlanParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, params.data.id));
  if (!plan) {
    res.status(404).json({ error: "Plan not found" });
    return;
  }
  res.json({ ...plan, features: (plan.features as string[]) ?? [] });
});

export default router;
