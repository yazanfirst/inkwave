import { clearAdminSession } from '@/lib/auth/admin';
import { NextResponse } from 'next/server';

export async function POST() {
  clearAdminSession();
  return NextResponse.json({ ok: true });
}
