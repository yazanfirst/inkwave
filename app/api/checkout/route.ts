import { couponRepo, orderRepo, productRepo, settingsRepo } from '@/lib/data/repos';
import { getFulfillmentProvider } from '@/lib/fulfillment/providers';
import { evaluateCoupon } from '@/lib/coupons';
import { money, uid } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const products = await productRepo.list();
  const settings = await settingsRepo.get();
  const coupons = await couponRepo.list();

  const items = body.items
    .map((item: { productId: string; variantId: string; qty: number; design?: any }) => {
      const product = products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant) return null;
      return { productId: product.id, variantId: variant.id, qty: item.qty, unitPrice: variant.price, design: item.design };
    })
    .filter(Boolean);

  if (!items.length) return NextResponse.json({ error: 'No valid items' }, { status: 400 });

  const subtotal = money(items.reduce((s: number, i: any) => s + i.qty * i.unitPrice, 0));
  const shippingCost = body.shippingMethod === 'Express' ? settings.shipping.express : settings.shipping.standard;

  const coupon = coupons.find((c) => c.code === String(body.couponCode || '').toUpperCase());
  const evalCoupon = evaluateCoupon(coupon, subtotal);
  const discount = evalCoupon.valid ? evalCoupon.discount : 0;
  if (coupon && evalCoupon.valid) {
    coupon.usedCount += 1;
    await couponRepo.saveAll(coupons);
  }

  const order = {
    id: uid('ord'),
    createdAt: new Date().toISOString(),
    customer: body.customer,
    items,
    coupon: coupon && evalCoupon.valid ? { code: coupon.code, discount } : undefined,
    shipping: { method: body.shippingMethod === 'Express' ? 'Express' : 'Standard', cost: shippingCost },
    totals: {
      subtotal,
      discount,
      shipping: shippingCost,
      total: money(subtotal - discount + shippingCost)
    },
    payment: {
      mode: settings.checkoutMode,
      stripeSessionId: body.stripeSessionId,
      status: settings.checkoutMode === 'manual' ? 'unpaid' : body.paid ? 'paid' : 'unpaid'
    },
    fulfillment: { provider: settings.podProvider, status: 'pending', notes: '' }
  } as const;

  const provider = getFulfillmentProvider(settings.podProvider);
  if (order.payment.status === 'paid' || settings.checkoutMode === 'manual') {
    const result = await provider.createFulfillmentOrder(order as any);
    (order as any).fulfillment = { ...order.fulfillment, status: result.status, notes: result.notes };
  }

  const orders = await orderRepo.list();
  orders.unshift(order as any);
  await orderRepo.saveAll(orders as any);

  return NextResponse.json({ ok: true, orderId: order.id });
}
