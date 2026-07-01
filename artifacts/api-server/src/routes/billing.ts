import { Router, type IRouter } from "express";
import { db, invoicesTable, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateCheckoutBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/invoices", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const invoices = await db.select().from(invoicesTable).where(eq(invoicesTable.userId, user.id));
  res.json(invoices);
});

router.get("/stripe/products-with-prices", async (_req, res): Promise<void> => {
  try {
    const result = await db.execute(sql`
      WITH paginated_products AS (
        SELECT id, name, description, metadata, active
        FROM stripe.products
        WHERE active = true
        ORDER BY id
        LIMIT 20 OFFSET 0
      )
      SELECT
        p.id as product_id,
        p.name as product_name,
        p.description as product_description,
        p.active as product_active,
        p.metadata as product_metadata,
        pr.id as price_id,
        pr.unit_amount,
        pr.currency,
        pr.recurring,
        pr.active as price_active
      FROM paginated_products p
      LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
      ORDER BY p.id, pr.unit_amount
    `);
    const productsMap = new Map<string, any>();
    for (const row of result.rows as any[]) {
      if (!productsMap.has(row.product_id)) {
        productsMap.set(row.product_id, {
          id: row.product_id,
          name: row.product_name,
          description: row.product_description,
          active: row.product_active,
          prices: [],
        });
      }
      if (row.price_id) {
        productsMap.get(row.product_id).prices.push({
          id: row.price_id,
          unit_amount: row.unit_amount,
          currency: row.currency,
          recurring: row.recurring,
          active: row.price_active,
        });
      }
    }
    res.json({ data: Array.from(productsMap.values()) });
  } catch {
    res.json({ data: [] });
  }
});

router.post("/stripe/checkout", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const parsed = CreateCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const { getUncachableStripeClient } = await import("../lib/stripeClient");
    const { stripeService } = await import("../lib/stripeService");
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const stripe = await getUncachableStripeClient();
      const customer = await stripe.customers.create({ email: user.email, metadata: { userId: String(user.id) } });
      await db.update(usersTable).set({ stripeCustomerId: customer.id }).where(eq(usersTable.id, user.id));
      customerId = customer.id;
    }
    const host = req.get("host");
    const protocol = req.protocol;
    const session = await stripeService.createCheckoutSession(
      customerId,
      parsed.data.priceId,
      `${protocol}://${host}/dashboard/billing?success=true`,
      `${protocol}://${host}/dashboard/billing?canceled=true`
    );
    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/stripe/portal", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  if (!user.stripeCustomerId) {
    res.status(400).json({ error: "No billing account found" });
    return;
  }
  try {
    const { stripeService } = await import("../lib/stripeService");
    const host = req.get("host");
    const protocol = req.protocol;
    const session = await stripeService.createCustomerPortalSession(
      user.stripeCustomerId,
      `${protocol}://${host}/dashboard/billing`
    );
    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/stripe/subscription", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  if (!user.stripeSubscriptionId) {
    res.json({ subscription: null });
    return;
  }
  try {
    const result = await db.execute(sql`SELECT * FROM stripe.subscriptions WHERE id = ${user.stripeSubscriptionId}`);
    res.json({ subscription: result.rows[0] ?? null });
  } catch {
    res.json({ subscription: null });
  }
});

export default router;
