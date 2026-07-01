import { Router, type IRouter } from "express";
import { db, servicesTable, ticketsTable, invoicesTable } from "@workspace/db";
import { eq, and, sum, count } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/dashboard/stats", requireAuth, async (req, res): Promise<void> => {
  const user = (req as any).user;
  const [activeServices] = await db.select({ count: count() }).from(servicesTable)
    .where(and(eq(servicesTable.userId, user.id), eq(servicesTable.status, "active")));
  const [openTickets] = await db.select({ count: count() }).from(ticketsTable)
    .where(and(eq(ticketsTable.userId, user.id), eq(ticketsTable.status, "open")));
  const [pendingInvoices] = await db.select({ count: count() }).from(invoicesTable)
    .where(and(eq(invoicesTable.userId, user.id), eq(invoicesTable.status, "pending")));
  const [spent] = await db.select({ total: sum(invoicesTable.amount) }).from(invoicesTable)
    .where(and(eq(invoicesTable.userId, user.id), eq(invoicesTable.status, "paid")));
  res.json({
    activeServices: activeServices.count,
    openTickets: openTickets.count,
    pendingInvoices: pendingInvoices.count,
    totalSpent: Number(spent.total ?? 0),
  });
});

export default router;
