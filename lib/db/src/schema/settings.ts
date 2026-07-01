import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("NivenX Hosting"),
  tagline: text("tagline"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  primaryColor: text("primary_color").notNull().default("#7c3aed"),
  accentColor: text("accent_color").notNull().default("#3b82f6"),
  maintenanceMode: boolean("maintenance_mode").notNull().default(false),
  discordUrl: text("discord_url"),
  twitterUrl: text("twitter_url"),
  youtubeUrl: text("youtube_url"),
  instagramUrl: text("instagram_url"),
  tiktokUrl: text("tiktok_url"),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroBgUrl: text("hero_bg_url"),
  reviewsEnabled: boolean("reviews_enabled").notNull().default(true),
  locationsEnabled: boolean("locations_enabled").notNull().default(true),
  partnersEnabled: boolean("partners_enabled").notNull().default(true),
  footerText: text("footer_text"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
