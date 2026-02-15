import { isAdminAuthenticated } from '@/lib/auth/admin';
import { couponRepo } from '@/lib/data/repos';
import { couponSchema } from '@/lib/schemas';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = couponSchema.parse(await req.json());
  const coupons = await couponRepo.list();
  const idx = coupons.findIndex((c) => c.code === payload.code);
  if (idx >= 0) coupons[idx] = payload;
  else coupons.push(payload);
  await couponRepo.saveAll(coupons);
  return NextResponse.json({ ok: true, coupon: payload });
}
