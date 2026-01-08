import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Regions ===
  app.get(api.regions.list.path, async (_req, res) => {
    const regions = await storage.getRegions();
    res.json(regions);
  });

  app.post(api.regions.create.path, async (req, res) => {
    try {
      const input = api.regions.create.input.parse(req.body);
      const region = await storage.createRegion(input);
      res.status(201).json(region);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === Products ===
  app.get(api.products.list.path, async (req, res) => {
    const regionId = req.query.regionId ? Number(req.query.regionId) : undefined;
    const products = await storage.getProducts(regionId);
    res.json(products);
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === Automation ===
  app.get(api.automation.list.path, async (_req, res) => {
    const rules = await storage.getAutomationRules();
    res.json(rules);
  });

  app.post(api.automation.create.path, async (req, res) => {
    try {
      const input = api.automation.create.input.parse(req.body);
      const rule = await storage.createAutomationRule(input);
      res.status(201).json(rule);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.automation.toggle.path, async (req, res) => {
    const id = Number(req.params.id);
    const { isActive } = req.body;
    const updated = await storage.toggleAutomationRule(id, isActive);
    if (!updated) {
      return res.status(404).json({ message: "Rule not found" });
    }
    res.json(updated);
  });

  // === Seed Data ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const regions = await storage.getRegions();
  if (regions.length === 0) {
    const us = await storage.createRegion({ code: 'US', name: 'United States', status: 'live', launchDate: new Date() });
    const de = await storage.createRegion({ code: 'DE', name: 'Germany', status: 'beta', launchDate: new Date() });
    const cn = await storage.createRegion({ code: 'CN', name: 'China', status: 'planned' });
    
    // Seed Products
    await storage.createProduct({
      shopifyId: 'sh_101',
      title: '2025 Escalade IQ Model',
      handle: 'escalade-iq-2025',
      status: 'active',
      inventoryCount: 50,
      price: '130000',
      currency: 'USD',
      regionId: us.id,
      metadata: { vin_series: 'E100' }
    });

    await storage.createProduct({
      shopifyId: 'sh_102',
      title: 'Lyriq Home Charger',
      handle: 'lyriq-charger',
      status: 'active',
      inventoryCount: 200,
      price: '599',
      currency: 'EUR',
      regionId: de.id,
      metadata: { power: '11kW' }
    });

    // Seed Automation Rules
    await storage.createAutomationRule({
      name: 'Restock High Demand Items',
      triggerEvent: 'inventory.low',
      actionType: 'auto_restock',
      isActive: true,
      config: { threshold: 10, amount: 50 }
    });
    
    await storage.createAutomationRule({
      name: 'Notify Region Manager on Launch',
      triggerEvent: 'region.status_change',
      actionType: 'notify_team',
      isActive: true,
      config: { role: 'regional_manager' }
    });
  }
}
