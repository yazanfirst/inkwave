import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'node:crypto';

const TOKEN_NAME = 'inkwave_admin';
const attempts = new Map<string, { count: number; ts: number }>();

function hash(input: string) {
  return createHash('sha256').update(input).digest();
}

export function validateAdminLogin(username: string, password: string, ip: string) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.count >= 5 && now - rec.ts < 10 * 60_000) {
    return { ok: false, reason: 'Too many attempts. Try again in 10 minutes.' };
  }

  const envUser = process.env.ADMIN_USER ?? 'admin';
  const envPass = process.env.ADMIN_PASS ?? 'admin123';
  const ok = timingSafeEqual(hash(username), hash(envUser)) && timingSafeEqual(hash(password), hash(envPass));
  if (!ok) {
    attempts.set(ip, { count: (rec?.count ?? 0) + 1, ts: now });
    return { ok: false, reason: 'Invalid credentials' };
  }

  attempts.delete(ip);
  return { ok: true };
}

export function setAdminSession() {
  cookies().set(TOKEN_NAME, '1', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
}

export function clearAdminSession() {
  cookies().delete(TOKEN_NAME);
}

export function isAdminAuthenticated() {
  return cookies().get(TOKEN_NAME)?.value === '1';
}
