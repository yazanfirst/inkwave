import { isAdminAuthenticated } from '@/lib/auth/admin';
import { couponRepo } from '@/lib/data/repos';
import { NextResponse } from 'next/server';

export async function DELETE(_: Request, { params }: { params: { code: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const coupons = await couponRepo.list();
  await couponRepo.saveAll(coupons.filter((c) => c.code !== params.code));
  return NextResponse.json({ ok: true });
}
