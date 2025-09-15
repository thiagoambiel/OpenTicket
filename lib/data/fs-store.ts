import { promises as fs } from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

async function ensureDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch {}
}

export async function readJSON<T>(file: string, fallback: T): Promise<T> {
  await ensureDir()
  const full = path.join(dataDir, file)
  try {
    const raw = await fs.readFile(full, 'utf8')
    return JSON.parse(raw) as T
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      await fs.writeFile(full, JSON.stringify(fallback, null, 2), 'utf8')
      return fallback
    }
    throw e
  }
}

export async function writeJSON<T>(file: string, data: T) {
  await ensureDir()
  const full = path.join(dataDir, file)
  await fs.writeFile(full, JSON.stringify(data, null, 2), 'utf8')
}

