import { Coupon } from '@/lib/types';
import { money } from '@/lib/utils';

export function evaluateCoupon(coupon: Coupon | undefined, subtotal: number, nowIso = new Date().toISOString()) {
  if (!coupon || !coupon.active) return { valid: false, discount: 0, reason: 'Coupon not found' };
  if (coupon.startsAt && nowIso < coupon.startsAt) return { valid: false, discount: 0, reason: 'Coupon not started' };
  if (coupon.endsAt && nowIso > coupon.endsAt) return { valid: false, discount: 0, reason: 'Coupon expired' };
  if (coupon.usedCount >= coupon.usageLimit) return { valid: false, discount: 0, reason: 'Usage limit reached' };
  if (subtotal < coupon.minCart) return { valid: false, discount: 0, reason: `Minimum cart is ${coupon.minCart}` };
  const discount = coupon.type === 'percent' ? money((subtotal * coupon.value) / 100) : Math.min(subtotal, coupon.value);
  return { valid: true, discount, reason: '' };
}
