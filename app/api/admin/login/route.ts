import { setAdminSession, validateAdminLogin } from '@/lib/auth/admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  const result = validateAdminLogin(body.username ?? '', body.password ?? '', ip);
  if (!result.ok) return NextResponse.json(result, { status: 401 });
  setAdminSession();
  return NextResponse.json({ ok: true });
}
