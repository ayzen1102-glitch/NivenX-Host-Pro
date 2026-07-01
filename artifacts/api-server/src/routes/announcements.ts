import { Router, type IRouter } from "express";
import { db, announcementsTable, kbArticlesTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/announcements", async (_req, res): Promise<void> => {
  const announcements = await db.select().from(announcementsTable).orderBy(desc(announcementsTable.createdAt));
  res.json(announcements);
});

router.get("/kb/articles", async (_req, res): Promise<void> => {
  const articles = await db.select().from(kbArticlesTable).orderBy(desc(kbArticlesTable.createdAt));
  res.json(articles);
});

export default router;
