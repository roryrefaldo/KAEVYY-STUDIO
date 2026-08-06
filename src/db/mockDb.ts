import { mockData } from './mockStore.js';

export function isDbConnected(): boolean {
  return process.env.DB_CONNECTED === 'true';
}

export async function safeDbExecute<T>(dbFn: () => Promise<T>, fallbackFn: () => Promise<T> | T): Promise<T> {
  if (!process.env.DATABASE_URL) {
    return await fallbackFn();
  }
  try {
    return await dbFn();
  } catch (err: any) {
    if (err?.code === 'ECONNREFUSED' || err?.cause?.code === 'ECONNREFUSED' || err?.message?.includes('ECONNREFUSED')) {
      return await fallbackFn();
    }
    console.warn('[DB] Live database execution failed, falling back to mock store:', err?.message || err);
    return await fallbackFn();
  }
}
