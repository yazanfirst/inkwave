import { uid } from '@/lib/utils';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Invalid upload' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() ?? 'png';
  const name = `${uid('up')}.${ext}`;
  const relativeDir = form.get('dir')?.toString() === 'designs' ? 'uploads/designs' : 'uploads';
  const dir = path.join(process.cwd(), 'public', relativeDir);
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), bytes);
  return NextResponse.json({ url: `/${relativeDir}/${name}` });
}
