import { isAdminAuthenticated } from '@/lib/auth/admin';
import { productRepo } from '@/lib/data/repos';
import { NextResponse } from 'next/server';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const products = await productRepo.list();
  await productRepo.saveAll(products.filter((p) => p.id !== params.id));
  return NextResponse.json({ ok: true });
}
