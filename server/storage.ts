import { db } from "./db";
import {
  regions, products, automationRules,
  type InsertRegion, type InsertProduct, type InsertAutomationRule,
  type Region, type Product, type AutomationRule
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Regions
  getRegions(): Promise<Region[]>;
  createRegion(region: InsertRegion): Promise<Region>;

  // Products
  getProducts(regionId?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Automation
  getAutomationRules(): Promise<AutomationRule[]>;
  createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule>;
  toggleAutomationRule(id: number, isActive: boolean): Promise<AutomationRule | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getRegions(): Promise<Region[]> {
    return await db.select().from(regions);
  }

  async createRegion(region: InsertRegion): Promise<Region> {
    const [newRegion] = await db.insert(regions).values(region).returning();
    return newRegion;
  }

  async getProducts(regionId?: number): Promise<Product[]> {
    if (regionId) {
      return await db.select().from(products).where(eq(products.regionId, regionId));
    }
    return await db.select().from(products);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async getAutomationRules(): Promise<AutomationRule[]> {
    return await db.select().from(automationRules);
  }

  async createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule> {
    const [newRule] = await db.insert(automationRules).values(rule).returning();
    return newRule;
  }

  async toggleAutomationRule(id: number, isActive: boolean): Promise<AutomationRule | undefined> {
    const [updated] = await db.update(automationRules)
      .set({ isActive })
      .where(eq(automationRules.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
