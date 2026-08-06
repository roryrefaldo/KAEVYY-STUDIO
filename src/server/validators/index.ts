import { ValidationError, FileTooLargeError, AppError } from '../errors/index.js';
import { PaginationParams } from '../types/index.js';

export function parsePagination(query: any): PaginationParams {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string, 10) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function validateUUID(id: string, fieldName = 'ID'): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!id || !uuidRegex.test(id)) {
    throw new ValidationError(`Format ${fieldName} tidak valid (harus UUID).`);
  }
  return id;
}

export function validateEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new ValidationError('Format email tidak valid.');
  }
  return email.toLowerCase().trim();
}

export function validateMonetaryInput(amount: number, currency: string) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    throw new ValidationError('Jumlah nominal harus berupa angka positif.');
  }
  const normCurr = currency?.toUpperCase();
  if (normCurr !== 'IDR' && normCurr !== 'USD') {
    throw new ValidationError('Mata uang tidak didukung. Gunakan IDR atau USD.');
  }
  if (normCurr === 'IDR' && !Number.isInteger(amount)) {
    throw new ValidationError('Nominal IDR harus berupa angka bulat (tanpa desimal).');
  }
  return { amount, currency: normCurr };
}

export function validateAssetDocBlocks(blocks: any[]) {
  if (!Array.isArray(blocks) || blocks.length < 1 || blocks.length > 10) {
    throw new AppError(
      422,
      'INVALID_DOCUMENTATION_BLOCK_COUNT',
      'Dokumentasi asset harus berisi 1 sampai 10 bagian.'
    );
  }
}

export const validateDocBlocks = validateAssetDocBlocks;

export function validateFileSize(fileSizeBytes: number) {
  const MAX_BYTES = 524288000; // 500MB
  if (fileSizeBytes > MAX_BYTES) {
    throw new FileTooLargeError();
  }
}
