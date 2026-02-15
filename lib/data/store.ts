import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function readJsonFile<T>(file: string, fallback: T): Promise<T> {
  await ensureDir();
  const fp = path.join(DATA_DIR, file);
  try {
    const raw = await readFile(fp, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonAtomic<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  const fp = path.join(DATA_DIR, file);
  const tmp = `${fp}.${Date.now()}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
  await rename(tmp, fp);
}
