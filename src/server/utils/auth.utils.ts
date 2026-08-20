import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Response } from 'express';

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET)) {
  throw new Error('FATAL: JWT_SECRET dan JWT_REFRESH_SECRET wajib di-set di production.');
}
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-do-not-use-in-prod';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-only-refresh-do-not-use-in-prod';
export interface JwtPayload {
  userId: string;
  email: string;
  roles: string[];
  sessionId?: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Password minimal 8 karakter.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password harus mengandung setidaknya satu huruf besar.' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password harus mengandung setidaknya satu huruf kecil.' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password harus mengandung setidaknya satu angka.' };
  }
  return { isValid: true };
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateOpaqueToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  isRememberMe: boolean = false
) {
  const isProduction = process.env.NODE_ENV === 'production';
  const refreshMaxAge = isRememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: refreshMaxAge,
  });
}

export function clearAuthCookies(res: Response) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
  });
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
  });
}

export function parseUserAgent(uaString: string | undefined): { deviceType: string; browser: string } {
  if (!uaString) return { deviceType: 'Unknown Device', browser: 'Unknown Browser' };

  let deviceType = 'Desktop';
  if (/mobile/i.test(uaString)) deviceType = 'Mobile';
  if (/tablet|ipad/i.test(uaString)) deviceType = 'Tablet';

  let browser = 'Browser';
  if (/chrome/i.test(uaString)) browser = 'Chrome';
  else if (/firefox/i.test(uaString)) browser = 'Firefox';
  else if (/safari/i.test(uaString)) browser = 'Safari';
  else if (/edge/i.test(uaString)) browser = 'Edge';

  return { deviceType, browser };
}
