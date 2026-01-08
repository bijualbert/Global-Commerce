import { z } from 'zod';
import { insertRegionSchema, insertProductSchema, insertAutomationRuleSchema, regions, products, automationRules } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  regions: {
    list: {
      method: 'GET' as const,
      path: '/api/regions',
      responses: {
        200: z.array(z.custom<typeof regions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/regions',
      input: insertRegionSchema,
      responses: {
        201: z.custom<typeof regions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      input: z.object({
        regionId: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/products',
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  automation: {
    list: {
      method: 'GET' as const,
      path: '/api/automation-rules',
      responses: {
        200: z.array(z.custom<typeof automationRules.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/automation-rules',
      input: insertAutomationRuleSchema,
      responses: {
        201: z.custom<typeof automationRules.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    toggle: {
      method: 'PATCH' as const,
      path: '/api/automation-rules/:id/toggle',
      input: z.object({ isActive: z.boolean() }),
      responses: {
        200: z.custom<typeof automationRules.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export type Region = z.infer<typeof api.regions.list.responses[200]>[number];
export type InsertRegion = z.infer<typeof api.regions.create.input>;
export type Product = z.infer<typeof api.products.list.responses[200]>[number];
export type InsertProduct = z.infer<typeof api.products.create.input>;
export type AutomationRule = z.infer<typeof api.automation.list.responses[200]>[number];
export type InsertAutomationRule = z.infer<typeof api.automation.create.input>;

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
