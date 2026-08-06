import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as authService from '../services/auth.service.js';
import {
  validateRegisterClientDTO,
  validateRegisterDeveloperDTO,
  validateLoginDTO,
  validateResetPasswordDTO,
  validateChangePasswordDTO,
} from '../validators/auth.validators.js';
import { setAuthCookies, clearAuthCookies } from '../utils/auth.utils.js';
import { serializeUser } from '../serializers/index.js';
import { ValidationError } from '../errors/index.js';

export async function registerClient(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validated = validateRegisterClientDTO(req.body);
    const result = await authService.registerClient(validated);

    setAuthCookies(res, result.accessToken, result.refreshToken, false);

    res.status(201).json({
      success: true,
      data: {
        user: serializeUser(result.user),
        clientProfile: result.clientProfile,
        token: result.accessToken,
        refreshToken: result.refreshToken,
        verificationToken: result.verificationToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function registerDeveloper(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validated = validateRegisterDeveloperDTO(req.body);
    const result = await authService.registerDeveloper(validated);

    setAuthCookies(res, result.accessToken, result.refreshToken, false);

    res.status(201).json({
      success: true,
      data: {
        user: serializeUser(result.user),
        developerProfile: result.developerProfile,
        token: result.accessToken,
        refreshToken: result.refreshToken,
        verificationToken: result.verificationToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validated = validateLoginDTO(req.body);
    const reqContext = {
      userAgent: req.headers['user-agent'],
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1',
    };

    const result = await authService.login(validated, reqContext);

    setAuthCookies(res, result.accessToken, result.refreshToken, validated.rememberMe);

    res.json({
      success: true,
      data: {
        user: serializeUser(result.user),
        token: result.accessToken,
        refreshToken: result.refreshToken,
        session: result.session,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new ValidationError('Refresh token wajib disertakan.');
    }

    const result = await authService.refresh(refreshToken);

    setAuthCookies(res, result.accessToken, result.refreshToken, false);

    res.json({
      success: true,
      data: {
        token: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refresh_token;
    if (req.user?.id) {
      await authService.logout(req.user.id, refreshToken);
    }
    clearAuthCookies(res);

    res.json({
      success: true,
      data: { message: 'Berhasil keluar.' },
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (req.user?.id) {
      await authService.logoutAll(req.user.id);
    }
    clearAuthCookies(res);

    res.json({
      success: true,
      data: { message: 'Berhasil keluar dari semua perangkat.' },
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new ValidationError('Email valid wajib diisi.');
    }

    const result = await authService.forgotPassword(email.trim().toLowerCase());
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const validated = validateResetPasswordDTO(req.body);
    const result = await authService.resetPassword(validated);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) {
      throw new ValidationError('Pengguna tidak terautentikasi.');
    }
    const validated = validateChangePasswordDTO(req.body);
    const result = await authService.changePassword(req.user.id, validated);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
      throw new ValidationError('Token verifikasi email wajib diisi.');
    }
    const result = await authService.verifyEmail(token.trim());
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  res.json({
    success: true,
    data: req.user || null,
  });
}

export async function getSessions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) {
      throw new ValidationError('Pengguna tidak terautentikasi.');
    }
    const sessions = await authService.getUserSessions(req.user.id);
    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
}

export async function revokeSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) {
      throw new ValidationError('Pengguna tidak terautentikasi.');
    }
    const { id } = req.params;
    const result = await authService.revokeSession(req.user.id, id);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function oauthLogin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { provider, providerAccountId, email, displayName, avatarUrl } = req.body;
    if (!provider || !providerAccountId || !email) {
      throw new ValidationError('Provider, providerAccountId, dan email wajib diisi.');
    }

    const reqContext = {
      userAgent: req.headers['user-agent'],
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1',
    };

    const result = await authService.handleOAuthLogin(
      { provider, providerAccountId, email, displayName, avatarUrl },
      reqContext
    );

    setAuthCookies(res, result.accessToken, result.refreshToken, true);

    res.json({
      success: true,
      data: {
        user: serializeUser(result.user),
        token: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function linkOAuthAccount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) {
      throw new ValidationError('Pengguna tidak terautentikasi.');
    }
    const { provider, providerAccountId, providerEmail } = req.body;
    if (!provider || !providerAccountId) {
      throw new ValidationError('Provider dan providerAccountId wajib diisi.');
    }

    const result = await authService.linkOAuthAccount(req.user.id, {
      provider,
      providerAccountId,
      providerEmail,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
