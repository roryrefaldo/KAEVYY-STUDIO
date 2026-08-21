import { ValidationError } from '../errors/index.js';
import { validatePasswordStrength } from '../utils/auth.utils.js';
import {
  RegisterClientDTO,
  RegisterDeveloperDTO,
  LoginDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
} from '../dtos/auth.dto.js';

export function validateRegisterClientDTO(data: any): RegisterClientDTO {
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    throw new ValidationError('Email valid wajib diisi.');
  }
  if (!data.displayName || typeof data.displayName !== 'string' || data.displayName.trim().length === 0) {
    throw new ValidationError('Nama tampilan wajib diisi.');
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length === 0) {
    throw new ValidationError('Password wajib diisi.');
  }
  const strength = validatePasswordStrength(data.password);
  if (!strength.isValid) {
    throw new ValidationError(strength.message || 'Password tidak memenuhi kriteria keamanan.');
  }
  return {
    email: data.email.trim().toLowerCase(),
    password: data.password,
    displayName: data.displayName.trim(),
    companyName: data.companyName ? String(data.companyName).trim() : undefined,
    discordUsername: data.discordUsername ? String(data.discordUsername).trim() : undefined,
  };
}

export function validateRegisterDeveloperDTO(data: any): RegisterDeveloperDTO {
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    throw new ValidationError('Email valid wajib diisi.');
  }
  if (!data.displayName || typeof data.displayName !== 'string' || data.displayName.trim().length === 0) {
    throw new ValidationError('Nama tampilan wajib diisi.');
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length === 0) {
    throw new ValidationError('Password wajib diisi.');
  }
  const strength = validatePasswordStrength(data.password);
  if (!strength.isValid) {
    throw new ValidationError(strength.message || 'Password tidak memenuhi kriteria keamanan.');
  }
  return {
    email: data.email.trim().toLowerCase(),
    password: data.password,
    displayName: data.displayName.trim(),
    bio: data.bio ? String(data.bio).trim() : undefined,
    specialization: data.specialization ? String(data.specialization).trim() : undefined,
    skills: Array.isArray(data.skills) ? data.skills.map(String) : [],
  };
}

export function validateLoginDTO(data: any): LoginDTO {
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    throw new ValidationError('Email valid wajib diisi.');
  }
  return {
    email: data.email.trim().toLowerCase(),
    password: data.password ? String(data.password) : undefined,
    rememberMe: Boolean(data.rememberMe),
  };
}

export function validateResetPasswordDTO(data: any): ResetPasswordDTO {
  if (!data.token || typeof data.token !== 'string') {
    throw new ValidationError('Token reset password wajib diisi.');
  }
  if (!data.newPassword || typeof data.newPassword !== 'string') {
    throw new ValidationError('Password baru wajib diisi.');
  }
  const strength = validatePasswordStrength(data.newPassword);
  if (!strength.isValid) {
    throw new ValidationError(strength.message || 'Password baru tidak memenuhi kriteria keamanan.');
  }
  return {
    token: data.token.trim(),
    newPassword: data.newPassword,
  };
}

export function validateChangePasswordDTO(data: any): ChangePasswordDTO {
  if (!data.newPassword || typeof data.newPassword !== 'string') {
    throw new ValidationError('Password baru wajib diisi.');
  }
  const strength = validatePasswordStrength(data.newPassword);
  if (!strength.isValid) {
    throw new ValidationError(strength.message || 'Password baru tidak memenuhi kriteria keamanan.');
  }
  return {
    currentPassword: data.currentPassword ? String(data.currentPassword) : undefined,
    newPassword: data.newPassword,
  };
}
