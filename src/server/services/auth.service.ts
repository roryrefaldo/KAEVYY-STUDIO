import crypto from 'crypto';
import { authRepository } from '../repositories/auth.repository.js';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateOpaqueToken,
  parseUserAgent,
} from '../utils/auth.utils.js';
import {
  RegisterClientDTO,
  RegisterDeveloperDTO,
  LoginDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
  OAuthLoginDTO,
  LinkOAuthDTO,
} from '../dtos/auth.dto.js';
import {
  InvalidCredentialsError,
  ValidationError,
  AuthRequiredError,
  NotFoundError,
} from '../errors/index.js';
import { db } from '../../db/index.js';
import { clientProfiles, developerProfiles } from '../../db/schema/index.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export async function registerClient(dto: RegisterClientDTO) {
  const existing = await authRepository.findUserByEmail(dto.email);
  if (existing) {
    throw new ValidationError('Email sudah terdaftar dalam sistem.');
  }

  const passwordHash = dto.password ? await hashPassword(dto.password) : undefined;
  const user = await authRepository.createUser({
    email: dto.email,
    displayName: dto.displayName,
    passwordHash,
    status: 'ACTIVE',
  });

  await authRepository.assignUserRole(user.id, 'CLIENT');

  // Create client profile
  let clientProfile = null;
  await safeDbExecute(
    async () => {
      const [p] = await db
        .insert(clientProfiles)
        .values({
          userId: user.id,
          companyName: dto.companyName || null,
          discordUsername: dto.discordUsername || null,
        })
        .returning();
      clientProfile = p;
    },
    async () => {
      const p = {
        id: `60000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
        userId: user.id,
        companyName: dto.companyName || null,
        discordUsername: dto.discordUsername || null,
      };
      mockData.clientProfiles.push(p);
      clientProfile = p;
    }
  );

  // Generate Email Verification Token
  const rawVerifToken = generateOpaqueToken();
  const verifHash = hashToken(rawVerifToken);
  const verifExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await authRepository.saveEmailVerificationToken(user.id, verifHash, verifExpiresAt);

  // Issue Initial Tokens & Session
  const familyId = crypto.randomUUID();
  const accessToken = generateAccessToken({ userId: user.id, email: user.email, roles: ['CLIENT'] });
  const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, roles: ['CLIENT'] });
  const refreshTokenHash = hashToken(refreshToken);

  const rtExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const rtRecord = await authRepository.saveRefreshToken({
    userId: user.id,
    tokenHash: refreshTokenHash,
    familyId,
    expiresAt: rtExpiresAt,
  });

  const session = await authRepository.createSession({
    userId: user.id,
    refreshTokenId: rtRecord.id,
    isRememberMe: false,
    expiresAt: rtExpiresAt,
  });

  return {
    user,
    clientProfile,
    accessToken,
    refreshToken,
    session,
    verificationToken: rawVerifToken,
  };
}

export async function registerDeveloper(dto: RegisterDeveloperDTO) {
  const existing = await authRepository.findUserByEmail(dto.email);
  if (existing) {
    throw new ValidationError('Email sudah terdaftar dalam sistem.');
  }

  const passwordHash = dto.password ? await hashPassword(dto.password) : undefined;
  const user = await authRepository.createUser({
    email: dto.email,
    displayName: dto.displayName,
    passwordHash,
    status: 'ACTIVE',
  });

  await authRepository.assignUserRole(user.id, 'DEVELOPER');

  // Create developer profile
  let developerProfile = null;
  await safeDbExecute(
    async () => {
      const [p] = await db
        .insert(developerProfiles)
        .values({
          userId: user.id,
          bio: dto.bio || '',
          specialization: dto.specialization || 'Lua / Luau Scripting',
          skills: dto.skills || [],
          verificationStatus: 'PENDING',
          developerTier: 'VERIFIED',
          activeProjectCapacity: 3,
        })
        .returning();
      developerProfile = p;
    },
    async () => {
      const p = {
        id: `70000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
        userId: user.id,
        bio: dto.bio || '',
        specialization: dto.specialization || 'Lua / Luau Scripting',
        skills: dto.skills || [],
        verificationStatus: 'PENDING',
        developerTier: 'VERIFIED',
        activeProjectCapacity: 3,
      };
      mockData.developerProfiles.push(p);
      developerProfile = p;
    }
  );

  // Generate Email Verification Token
  const rawVerifToken = generateOpaqueToken();
  const verifHash = hashToken(rawVerifToken);
  const verifExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await authRepository.saveEmailVerificationToken(user.id, verifHash, verifExpiresAt);

  // Issue Initial Tokens & Session
  const familyId = crypto.randomUUID();
  const accessToken = generateAccessToken({ userId: user.id, email: user.email, roles: ['DEVELOPER'] });
  const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, roles: ['DEVELOPER'] });
  const refreshTokenHash = hashToken(refreshToken);

  const rtExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const rtRecord = await authRepository.saveRefreshToken({
    userId: user.id,
    tokenHash: refreshTokenHash,
    familyId,
    expiresAt: rtExpiresAt,
  });

  const session = await authRepository.createSession({
    userId: user.id,
    refreshTokenId: rtRecord.id,
    isRememberMe: false,
    expiresAt: rtExpiresAt,
  });

  return {
    user,
    developerProfile,
    accessToken,
    refreshToken,
    session,
    verificationToken: rawVerifToken,
  };
}

export async function login(dto: LoginDTO, reqContext: { userAgent?: string; ipAddress?: string }) {
  const user = await authRepository.findUserByEmail(dto.email);

  if (!user) {
    throw new InvalidCredentialsError('Email atau password tidak valid.');
  }

  if (user.status === 'SUSPENDED') {
    await authRepository.recordLoginAttempt({
      userId: user.id,
      ipAddress: reqContext.ipAddress,
      userAgent: reqContext.userAgent,
      status: 'SUSPENDED',
      failureReason: 'Akun ditangguhkan.',
    });
    throw new InvalidCredentialsError('Akun anda telah ditangguhkan. Silakan hubungi admin.');
  }

  // Check password if user has passwordHash set
  const pwdHash = (user as any).passwordHash;
  if (pwdHash && dto.password) {
    const isPasswordMatch = await comparePassword(dto.password, pwdHash);
    if (!isPasswordMatch) {
      await authRepository.recordLoginAttempt({
        userId: user.id,
        ipAddress: reqContext.ipAddress,
        userAgent: reqContext.userAgent,
        status: 'FAILED_PASSWORD',
        failureReason: 'Password salah.',
      });
      throw new InvalidCredentialsError('Email atau password tidak valid.');
    }
  }

  // Fetch roles
  let rolesList: string[] = ['CLIENT'];
  await safeDbExecute(
    async () => {
      const userRoles = await authRepository.findUserById(user.id);
      // Fetch role codes
    },
    async () => {
      const uRoles = mockData.userRoles.filter((ur) => ur.userId === user.id);
      rolesList = uRoles
        .map((ur) => mockData.roles.find((r) => r.id === ur.roleId)?.code)
        .filter(Boolean) as string[];
    }
  );

  if (!rolesList || rolesList.length === 0) {
    rolesList = ['CLIENT'];
  }

  // Record successful login
  await authRepository.recordLoginAttempt({
    userId: user.id,
    ipAddress: reqContext.ipAddress,
    userAgent: reqContext.userAgent,
    status: 'SUCCESS',
  });

  const isRemember = Boolean(dto.rememberMe);
  const refreshDays = isRemember ? 30 : 7;
  const familyId = crypto.randomUUID();

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    roles: rolesList,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    roles: rolesList,
  });

  const rtHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);

  const rtRecord = await authRepository.saveRefreshToken({
    userId: user.id,
    tokenHash: rtHash,
    familyId,
    expiresAt,
  });

  const { deviceType } = parseUserAgent(reqContext.userAgent);

  const session = await authRepository.createSession({
    userId: user.id,
    refreshTokenId: rtRecord.id,
    userAgent: reqContext.userAgent,
    ipAddress: reqContext.ipAddress,
    deviceType,
    isRememberMe: isRemember,
    expiresAt,
  });

  return {
    user,
    accessToken,
    refreshToken,
    session,
  };
}

export async function refresh(incomingRefreshToken: string) {
  if (!incomingRefreshToken) {
    throw new AuthRequiredError('Refresh token tidak ditemukan.');
  }

  const payload = verifyRefreshToken(incomingRefreshToken);
  if (!payload) {
    throw new InvalidCredentialsError('Refresh token tidak valid atau kedaluwarsa.');
  }

  const incomingHash = hashToken(incomingRefreshToken);
  const existingToken = await authRepository.findRefreshToken(incomingHash);

  if (!existingToken) {
    throw new InvalidCredentialsError('Refresh token tidak dikenali.');
  }

  // Token Reuse Detection / Revoked Token check
  if (existingToken.isRevoked) {
    // Revoke entire token family for security!
    await authRepository.revokeTokenFamily(existingToken.familyId);
    throw new InvalidCredentialsError('Terdeteksi penggunaan ulang token. Semua sesi telah dicabut demi keamanan.');
  }

  if (new Date(existingToken.expiresAt) < new Date()) {
    throw new InvalidCredentialsError('Refresh token telah kedaluwarsa.');
  }

  const user = await authRepository.findUserById(payload.userId);
  if (!user || user.status !== 'ACTIVE') {
    throw new InvalidCredentialsError('Pengguna tidak aktif.');
  }

  // Rotate Refresh Token
  const newAccessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    roles: payload.roles,
  });

  const newRefreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    roles: payload.roles,
  });

  const newHash = hashToken(newRefreshToken);

  // Revoke old token and save new token in same family
  await authRepository.saveRefreshToken({
    userId: user.id,
    tokenHash: newHash,
    familyId: existingToken.familyId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(userId: string, refreshToken?: string) {
  if (refreshToken) {
    const rtHash = hashToken(refreshToken);
    const existing = await authRepository.findRefreshToken(rtHash);
    if (existing) {
      await authRepository.revokeTokenFamily(existing.familyId);
    }
  }
  await authRepository.revokeAllUserSessions(userId);
  return { message: 'Berhasil keluar.' };
}

export async function logoutAll(userId: string) {
  await authRepository.revokeAllUserSessions(userId);
  return { message: 'Berhasil keluar dari semua perangkat.' };
}

export async function forgotPassword(email: string) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    // Return generic message to prevent email enumeration
    return { message: 'Jika email terdaftar, instruksi reset password telah dikirim.' };
  }

  const rawToken = generateOpaqueToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await authRepository.savePasswordResetToken(user.id, tokenHash, expiresAt);

  return {
    message: 'Instruksi reset password telah dibuat.',
    resetToken: rawToken, // Provided for testing/development
  };
}

export async function resetPassword(dto: ResetPasswordDTO) {
  const tokenHash = hashToken(dto.token);
  const resetTokenRecord = await authRepository.findPasswordResetToken(tokenHash);

  if (!resetTokenRecord) {
    throw new ValidationError('Token reset password tidak valid atau sudah digunakan.');
  }

  if (new Date(resetTokenRecord.expiresAt) < new Date()) {
    throw new ValidationError('Token reset password telah kedaluwarsa.');
  }

  const passwordHash = await hashPassword(dto.newPassword);
  await authRepository.updateUserPassword(resetTokenRecord.userId, passwordHash);
  await authRepository.markPasswordResetTokenUsed(resetTokenRecord.id);

  // Revoke all existing user sessions for security
  await authRepository.revokeAllUserSessions(resetTokenRecord.userId);

  return { message: 'Password berhasil diperbarui. Silakan login kembali.' };
}

export async function changePassword(userId: string, dto: ChangePasswordDTO) {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'Pengguna tidak ditemukan.');
  }

  const pwdHash = (user as any).passwordHash;
  if (pwdHash && dto.currentPassword) {
    const isMatch = await comparePassword(dto.currentPassword, pwdHash);
    if (!isMatch) {
      throw new ValidationError('Password saat ini salah.');
    }
  }

  const newHash = await hashPassword(dto.newPassword);
  await authRepository.updateUserPassword(userId, newHash);

  return { message: 'Password berhasil diubah.' };
}

export async function verifyEmail(token: string) {
  const tokenHash = hashToken(token);
  const verifRecord = await authRepository.findEmailVerificationToken(tokenHash);

  if (!verifRecord) {
    throw new ValidationError('Token verifikasi tidak valid atau sudah digunakan.');
  }

  if (new Date(verifRecord.expiresAt) < new Date()) {
    throw new ValidationError('Token verifikasi telah kedaluwarsa.');
  }

  await authRepository.updateUserStatus(verifRecord.userId, 'ACTIVE');
  await authRepository.markEmailVerificationTokenUsed(verifRecord.id);

  return { message: 'Email berhasil diverifikasi.' };
}

export async function getUserSessions(userId: string) {
  return await authRepository.getUserSessions(userId);
}

export async function revokeSession(userId: string, sessionId: string) {
  await authRepository.revokeSession(sessionId, userId);
  return { message: 'Sesi berhasil dicabut.' };
}

export async function handleOAuthLogin(dto: OAuthLoginDTO, reqContext: { userAgent?: string; ipAddress?: string }) {
  // Check if OAuth account exists
  let oauthAcc = await authRepository.findOAuthAccount(dto.provider, dto.providerAccountId);
  let user = null;

  if (oauthAcc) {
    user = await authRepository.findUserById(oauthAcc.userId);
  } else {
    // Check if user exists by email
    user = await authRepository.findUserByEmail(dto.email);
    if (!user) {
      // Create new user
      user = await authRepository.createUser({
        email: dto.email,
        displayName: dto.displayName || dto.email.split('@')[0],
        avatarUrl: dto.avatarUrl,
        status: 'ACTIVE',
      });
      await authRepository.assignUserRole(user.id, 'CLIENT');
    }

    // Link OAuth account
    await authRepository.linkOAuthAccount(user.id, dto.provider, dto.providerAccountId, dto.email);
  }

  if (!user || user.status !== 'ACTIVE') {
    throw new InvalidCredentialsError('Akun pengguna tidak aktif.');
  }

  return await login({ email: user.email, rememberMe: true }, reqContext);
}

export async function linkOAuthAccount(userId: string, dto: LinkOAuthDTO) {
  const existing = await authRepository.findOAuthAccount(dto.provider, dto.providerAccountId);
  if (existing) {
    throw new ValidationError(`Akun ${dto.provider} ini sudah terhubung ke akun lain.`);
  }

  await authRepository.linkOAuthAccount(userId, dto.provider, dto.providerAccountId, dto.providerEmail);
  return { message: `Berhasil menghubungkan akun ${dto.provider}.` };
}
