/**
 * KAEVY STUDIO - Production Environment Startup Validator
 * Phase 10.2 Runtime Hardening
 */

import { logger } from './logger.js';

export interface EnvValidationResult {
  valid: boolean;
  missingVars: string[];
  warnings: string[];
}

export const REQUIRED_PRODUCTION_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NODE_ENV',
  'PORT',
  'REDIS_URL',
  'STORAGE_PROVIDER',
  'STORAGE_BUCKET_NAME',
];

export function validateEnvironment(): EnvValidationResult {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProd = nodeEnv === 'production';
  const missingVars: string[] = [];
  const warnings: string[] = [];

  for (const varName of REQUIRED_PRODUCTION_VARS) {
    if (!process.env[varName] || process.env[varName]?.trim() === '') {
      missingVars.push(varName);
    }
  }

  // Check specific security defaults in production
  if (isProd) {
    if (process.env.JWT_SECRET?.includes('super-secret') || process.env.JWT_SECRET?.includes('change-me')) {
      warnings.push('JWT_SECRET appears to use a default or placeholder value in production!');
    }
  }

  if (missingVars.length > 0) {
    if (isProd) {
      logger.error('CRITICAL: Missing required environment variables for production startup!', {
        missingVars,
        requiredCount: REQUIRED_PRODUCTION_VARS.length,
      });
      // Fast-fail in strict production mode if missing essential credentials
      if (missingVars.includes('DATABASE_URL') || missingVars.includes('JWT_SECRET')) {
        throw new Error(`Production Startup Aborted: Missing required environment variables [${missingVars.join(', ')}]`);
      }
    } else {
      logger.warn('Environment variables incomplete for development mode (using fallback defaults)', {
        missingVars,
      });
    }
  } else {
    logger.info('Environment variables validated successfully', {
      nodeEnv,
      validatedCount: REQUIRED_PRODUCTION_VARS.length,
    });
  }

  if (warnings.length > 0) {
    warnings.forEach((w) => logger.warn(w));
  }

  return {
    valid: missingVars.length === 0,
    missingVars,
    warnings,
  };
}
