import { uid } from '@/lib/utils';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { dataUrl } = await req.json();
  if (!dataUrl?.startsWith('data:image/png;base64,')) return NextResponse.json({ error: 'Bad payload' }, { status: 400 });
  const b64 = dataUrl.replace('data:image/png;base64,', '');
  const outDir = path.join(process.cwd(), 'public', 'uploads', 'designs');
  await mkdir(outDir, { recursive: true });
  const file = `${uid('design')}.png`;
  await writeFile(path.join(outDir, file), Buffer.from(b64, 'base64'));
  return NextResponse.json({ url: `/uploads/designs/${file}` });
}
