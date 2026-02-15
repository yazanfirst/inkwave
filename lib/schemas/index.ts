import { z } from 'zod';

export const variantSchema = z.object({
  id: z.string(),
  size: z.string().min(1),
  color: z.string().min(1),
  sku: z.string().min(1),
  baseCost: z.coerce.number().nonnegative(),
  price: z.coerce.number().nonnegative(),
  inStock: z.coerce.boolean()
});

export const productSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  description: z.string().min(5),
  category: z.string().min(1),
  tags: z.array(z.string()),
  images: z.array(z.string()),
  variants: z.array(variantSchema).min(1),
  designer: z.object({
    enabled: z.boolean(),
    printAreas: z.array(z.object({ view: z.enum(['front', 'back']), x: z.number(), y: z.number(), w: z.number(), h: z.number() })),
    export: z.object({ width: z.number().min(500), height: z.number().min(500) })
  }),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const couponSchema = z.object({
  code: z.string().trim().toUpperCase(),
  type: z.enum(['percent', 'fixed']),
  value: z.coerce.number().positive(),
  active: z.coerce.boolean(),
  startsAt: z.string().nullable(),
  endsAt: z.string().nullable(),
  usageLimit: z.coerce.number().int().positive(),
  usedCount: z.coerce.number().int().nonnegative(),
  minCart: z.coerce.number().nonnegative()
});
