import type { Coupon, Product, Settings } from '@/lib/types';
import { evaluateCoupon } from '@/lib/coupons';
import { money } from '@/lib/utils';
import { createHash } from 'node:crypto';

export type CheckoutInputItem = { productId: string; variantId: string; qty: number; design?: unknown };
type ShippingMethod = 'Standard' | 'Express';

type CheckoutDetails = {
  items: Array<{
    productId: string;
    productTitle: string;
    variantId: string;
    variantLabel: string;
    qty: number;
    unitPrice: number;
    design?: unknown;
  }>;
  shipping: ShippingMethod;
  shippingCost: number;
  subtotal: number;
  coupon?: Coupon;
  discount: number;
  total: number;
};

type BuildCheckoutArgs = {
  items: CheckoutInputItem[];
  shippingMethod?: string;
  couponCode?: string;
  products: Product[];
  settings: Settings;
  coupons: Coupon[];
};

export function buildCheckoutDetails({ items: rawItems, shippingMethod, couponCode, products, settings, coupons }: BuildCheckoutArgs): CheckoutDetails | null {
  const items = rawItems
    .map((item) => {
      const qty = Number(item.qty);
      if (!Number.isInteger(qty) || qty <= 0) return null;
      const product = products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant) return null;
      return {
        productId: product.id,
        productTitle: product.title,
        variantId: variant.id,
        variantLabel: `${variant.size} / ${variant.color}`,
        qty,
        unitPrice: variant.price,
        design: item.design
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (!items.length) return null;

  const subtotal = money(items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0));
  const shipping: ShippingMethod = shippingMethod === 'Express' ? 'Express' : 'Standard';
  const shippingCost = shipping === 'Express' ? settings.shipping.express : settings.shipping.standard;

  const coupon = coupons.find((c) => c.code === String(couponCode || '').toUpperCase());
  const evaluated = evaluateCoupon(coupon, subtotal);
  const discount = evaluated.valid ? evaluated.discount : 0;
  const total = money(subtotal - discount + shippingCost);

  return {
    items,
    shipping,
    shippingCost,
    subtotal,
    coupon,
    discount,
    total
  };
}

export function createCheckoutDigest(input: { items: Array<{ productId: string; variantId: string; qty: number; unitPrice: number }>; shipping: 'Standard' | 'Express'; couponCode?: string; total: number }) {
  const normalized = JSON.stringify({
    items: input.items
      .map((item) => ({ ...item }))
      .sort((a, b) => `${a.productId}:${a.variantId}`.localeCompare(`${b.productId}:${b.variantId}`)),
    shipping: input.shipping,
    couponCode: String(input.couponCode || '').toUpperCase(),
    total: input.total
  });
  return createHash('sha256').update(normalized).digest('hex');
}
