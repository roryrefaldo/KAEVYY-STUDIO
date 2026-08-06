export type ErrorCode =
  | 'AUTH_REQUIRED'
  | 'INVALID_CREDENTIALS'
  | 'FORBIDDEN'
  | 'USER_NOT_FOUND'
  | 'DEVELOPER_NOT_VERIFIED'
  | 'SERVICE_NOT_FOUND'
  | 'SERVICE_INACTIVE'
  | 'ORDER_NOT_FOUND'
  | 'MESSAGE_NOT_FOUND'
  | 'ORDER_INVALID_STATE'
  | 'CAPACITY_FULL'
  | 'PAYMENT_NOT_FOUND'
  | 'PAYMENT_FAILED'
  | 'ASSET_NOT_FOUND'
  | 'ASSET_NOT_APPROVED'
  | 'FILE_TOO_LARGE'
  | 'WARRANTY_EXPIRED'
  | 'DISPUTE_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INVALID_DOCUMENTATION_BLOCK_COUNT'
  | 'INTERNAL_SERVER_ERROR';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: any;

  constructor(statusCode: number, code: ErrorCode, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthRequiredError extends AppError {
  constructor(message = 'Autentikasi diperlukan untuk mengakses resource ini.') {
    super(401, 'AUTH_REQUIRED', message);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message = 'Email atau password tidak valid.') {
    super(401, 'INVALID_CREDENTIALS', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Anda tidak memiliki hak akses untuk resource ini.') {
    super(403, 'FORBIDDEN', message);
  }
}

export class NotFoundError extends AppError {
  constructor(code: ErrorCode = 'USER_NOT_FOUND', message = 'Resource tidak ditemukan.') {
    super(404, code, message);
  }
}

export class CapacityFullError extends AppError {
  constructor(message = 'Developer sedang penuh dan belum bisa menerima project baru.') {
    super(409, 'CAPACITY_FULL', message);
  }
}

export class CapacityExceededError extends AppError {
  constructor(message = 'Kapasitas developer telah melampaui batas maksimum.') {
    super(409, 'CAPACITY_FULL', message);
  }
}

export class InvalidStateTransitionError extends AppError {
  constructor(message = 'Transisi status tidak valid.') {
    super(400, 'ORDER_INVALID_STATE', message);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validasi input gagal.', details?: any) {
    super(422, 'VALIDATION_ERROR', message, details);
  }
}

export class FileTooLargeError extends AppError {
  constructor(message = 'Ukuran file melebihi batas maksimum 500MB.') {
    super(413, 'FILE_TOO_LARGE', message);
  }
}
