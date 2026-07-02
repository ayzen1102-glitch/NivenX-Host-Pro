import { Router, type IRouter } from "express";
import { db, partnersTable, reviewsTable, gamesTable, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/public/partners", async (_req, res): Promise<void> => {
  const partners = await db.select().from(partnersTable)
    .where(eq(partnersTable.isActive, true))
    .orderBy(partnersTable.sortOrder);
  res.json(partners);
});

router.get("/public/reviews", async (_req, res): Promise<void> => {
  const reviews = await db.select().from(reviewsTable)
    .where(eq(reviewsTable.isActive, true))
    .orderBy(reviewsTable.sortOrder);
  res.json(reviews);
});

router.get("/public/games", async (_req, res): Promise<void> => {
  const games = await db.select().from(gamesTable)
    .where(eq(gamesTable.isActive, true))
    .orderBy(gamesTable.sortOrder);
  res.json(games);
});

router.get("/public/settings", async (_req, res): Promise<void> => {
  const [settings] = await db.select().from(siteSettingsTable);
  res.json(settings ?? {});
});

export default router;
