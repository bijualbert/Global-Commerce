import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === Regions (International Rollout) ===
export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // e.g., 'US', 'DE', 'CN'
  name: text("name").notNull(),
  status: text("status").notNull().default('planned'), // 'planned', 'beta', 'live'
  launchDate: timestamp("launch_date"),
});

// === Products (Synced/Extended from Shopify) ===
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  shopifyId: text("shopify_id").notNull(),
  title: text("title").notNull(),
  handle: text("handle").notNull(),
  status: text("status").notNull().default('active'),
  inventoryCount: integer("inventory_count").default(0),
  price: text("price").notNull(), // Stored as string for precision or simplified for MVP
  currency: text("currency").default('USD'),
  regionId: integer("region_id").references(() => regions.id), // Region-specific product availability
  metadata: jsonb("metadata"), // Extra GM-specific data
});

// === Automation Rules ===
export const automationRules = pgTable("automation_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  triggerEvent: text("trigger_event").notNull(), // e.g., 'order.created', 'inventory.low'
  actionType: text("action_type").notNull(), // e.g., 'notify_team', 'auto_restock'
  isActive: boolean("is_active").default(true),
  config: jsonb("config"), // detailed configuration
  lastRunAt: timestamp("last_run_at"),
});

// === Schemas ===
export const insertRegionSchema = createInsertSchema(regions).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertAutomationRuleSchema = createInsertSchema(automationRules).omit({ id: true, lastRunAt: true });

// === Types ===
export type Region = typeof regions.$inferSelect;
export type Product = typeof products.$inferSelect;
export type AutomationRule = typeof automationRules.$inferSelect;

export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertAutomationRule = z.infer<typeof insertAutomationRuleSchema>;
