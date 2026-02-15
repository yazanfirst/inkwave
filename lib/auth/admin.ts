import { cookies } from 'next/headers';
import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const TOKEN_NAME = 'inkwave_admin';
const attempts = new Map<string, { count: number; ts: number }>();

function hash(input: string) {
  return createHash('sha256').update(input).digest();
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASS ?? 'inkwave-dev-admin-secret';
}

function sign(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('base64url');
}

function safeEqualText(a: string, b: string) {
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
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
  const exp = Date.now() + 24 * 60 * 60_000;
  const payload = `${exp}.${randomUUID()}`;
  const token = `${payload}.${sign(payload)}`;
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60
  });
}

export function clearAdminSession() {
  cookies().delete(TOKEN_NAME);
}

export function isAdminAuthenticated() {
  const raw = cookies().get(TOKEN_NAME)?.value;
  if (!raw) return false;
  const parts = raw.split('.');
  if (parts.length < 3) return false;
  const sig = parts.pop() as string;
  const payload = parts.join('.');
  const expectedSig = sign(payload);
  if (sig.length !== expectedSig.length || !safeEqualText(sig, expectedSig)) return false;

  const [expText] = payload.split('.', 1);
  const exp = Number(expText);
  return Number.isFinite(exp) && Date.now() < exp;
}
