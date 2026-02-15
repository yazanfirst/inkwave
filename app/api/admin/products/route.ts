import { isAdminAuthenticated } from '@/lib/auth/admin';
import { productRepo } from '@/lib/data/repos';
import { productSchema } from '@/lib/schemas';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = productSchema.parse(await req.json());
  const products = await productRepo.list();
  const idx = products.findIndex((p) => p.id === payload.id);
  if (idx >= 0) products[idx] = payload;
  else products.push(payload);
  await productRepo.saveAll(products);
  return NextResponse.json({ ok: true, product: payload });
}
