import {
  User,
  LoginCredentials,
  ClientRegisterData,
  DeveloperRegisterData,
} from '../../types/auth';
import { authApi } from '../../lib/api/authApi';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// ⚠️ DEMO_USERS hanya untuk preview UI via switchDemoUser.
// User demo TIDAK memiliki sesi backend — panggilan API akan dianggap anonim.
export const DEMO_USERS: Record<string, User> = {
  client: {
    id: 'usr-client-001',
    email: 'client@kaevy.studio',
    displayName: 'NovaStudios_CEO',
    role: 'CLIENT',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    language: 'id',
    currency: 'IDR',
    createdAt: '2026-01-15',
    clientProfile: {
      discord: 'novastudios_ceo#1234',
      whatsapp: '+6281234567890',
      companyName: 'Nova Studios Indonesia',
    },
  },
  developer: {
    id: 'usr-dev-001',
    email: 'dev@aeroscript.com',
    displayName: 'AeroScript_Dev',
    role: 'DEVELOPER',
    status: 'VERIFIED',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    language: 'id',
    currency: 'IDR',
    createdAt: '2025-11-20',
    developerProfile: {
      specialization: 'Luau / Lua Scripting',
      skills: ['Luau', 'Framework Architecture', 'Datastore v2', 'Roblox Studio API'],
      portfolioUrl: 'https://github.com/aeroscript-roblox',
      bio: 'Senior Luau System Architect with 5+ years crafting high-performance Roblox game backends.',
      activeQueueCount: 2,
      maxQueueCapacity: 3,
      verificationStatus: 'VERIFIED',
      completedOrdersCount: 42,
      rating: 4.98,
    },
  },
  pending_developer: {
    id: 'usr-dev-002',
    email: 'pending.dev@kaevy.studio',
    displayName: 'LuauNewbie_Dev',
    role: 'DEVELOPER',
    status: 'PENDING_VERIFICATION',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    language: 'id',
    currency: 'IDR',
    createdAt: '2026-07-29',
    developerProfile: {
      specialization: 'Building & Map Design',
      skills: ['Blender 3D', 'PBR Materials', 'Roblox Terrain', 'Lighting'],
      portfolioUrl: 'https://artstation.com/luaunewbie',
      bio: '3D Environmental Artist specializing in high-detail Roblox RPG landscapes.',
      activeQueueCount: 0,
      maxQueueCapacity: 3,
      verificationStatus: 'PENDING',
      submittedAt: '2026-07-29 14:30 WIB',
    },
  },
  admin: {
    id: 'usr-admin-001',
    email: 'admin@kaevy.studio',
    displayName: 'KaevyAdmin_Root',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    language: 'id',
    currency: 'IDR',
    createdAt: '2025-09-01',
    adminProfile: {
      adminRole: 'SUPER_ADMIN',
      permissions: ['ALL'],
    },
  },
  suspended: {
    id: 'usr-suspended-001',
    email: 'suspended@kaevy.studio',
    displayName: 'Suspended_Account',
    role: 'CLIENT',
    status: 'SUSPENDED',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    language: 'id',
    currency: 'IDR',
    createdAt: '2026-02-10',
  },
};

/**
 * Konversi user dari API (snake shape server) ke tipe User frontend.
 * Data role & profil diambil dari /auth/me (req.user di server).
 */
function mapApiUserToFrontend(apiUser: any, me?: any): User {
  const roleList: string[] = Array.isArray(me?.roles) ? me.roles : [];
  const role: User['role'] = roleList.includes('ADMIN')
    ? 'ADMIN'
    : roleList.includes('DEVELOPER')
    ? 'DEVELOPER'
    : 'CLIENT';

  const developerTier = me?.developerTier as 'VERIFIED' | 'ELITE' | null | undefined;
  const baseStatus = (apiUser?.status as User['status']) || 'ACTIVE';
  const status: User['status'] = role === 'DEVELOPER' && developerTier ? developerTier : baseStatus;
  const email = apiUser?.email || me?.email || '';

  return {
    id: apiUser?.id || me?.id || '',
    email,
    displayName: apiUser?.displayName || me?.displayName || 'Pengguna',
    role,
    status,
    avatar:
      apiUser?.avatarUrl ||
      `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email || 'user')}`,
    language: 'id',
    currency: 'IDR',
    createdAt: apiUser?.createdAt ? String(apiUser.createdAt) : new Date().toISOString(),
  };
}

/**
 * Core Authentication Service — terhubung ke REST API backend.
 * Token JWT disimpan di localStorage dan juga dikirim server via httpOnly cookie.
 */
export class AuthService {
  private static STORAGE_KEY = 'kaevy_auth_user_v1';
  private static TOKEN_KEY = 'kaevy_auth_token_v1';
  private static REFRESH_KEY = 'kaevy_auth_refresh_v1';

  // --- Session Storage ---

  public static getStoredUser(): User | null {
    try {
      if (typeof window === 'undefined') return null;
      const json = localStorage.getItem(this.STORAGE_KEY);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  }

  public static setStoredUser(user: User | null) {
    if (typeof window === 'undefined') return;
    if (!user) {
      this.clearSession();
    } else {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  public static getStoredToken(): string | null {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  public static getStoredRefreshToken(): string | null {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(this.REFRESH_KEY);
    } catch {
      return null;
    }
  }

  public static setStoredTokens(accessToken: string, refreshToken?: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_KEY, refreshToken);
    }
  }

  public static clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  // --- Identity Builder ---

  private static async buildFrontendUser(
    apiUser: any,
    extras?: { clientProfile?: any; developerProfile?: any }
  ): Promise<User> {
    let me: any = null;
    try {
      const meRes = await authApi.getMe();
      if (meRes?.success) me = meRes.data;
    } catch {
      // Biarkan null — user tetap dibangun dari data minimal login response
    }

    const user = mapApiUserToFrontend(apiUser, me);

    if (extras?.clientProfile || me?.clientProfileId) {
      user.clientProfile = {
        companyName: extras?.clientProfile?.companyName ?? undefined,
        discord: extras?.clientProfile?.discordUsername ?? undefined,
      };
    }

    if (extras?.developerProfile || me?.developerProfileId) {
      const dp = extras?.developerProfile;
      user.developerProfile = {
        specialization: dp?.specialization || '',
        skills: Array.isArray(dp?.skills) ? dp.skills : [],
        bio: dp?.bio ?? undefined,
        activeQueueCount: 0,
        maxQueueCapacity: dp?.activeProjectCapacity ?? 3,
        verificationStatus: dp?.verificationStatus ?? ((me?.developerTier as any) || 'PENDING'),
      };
      // Developer baru yang masih PENDING jangan ditandai terverifikasi
      if (dp?.verificationStatus === 'PENDING') {
        user.status = 'PENDING_VERIFICATION';
      }
    }

    return user;
  }

  // --- Login Operations (API asli) ---

  public static async loginWithPassword(credentials: LoginCredentials): Promise<User> {
    const res = await authApi.login({
      email: credentials.email,
      password: credentials.password,
      rememberMe: (credentials as any).rememberMe,
    });
    if (!res?.success || !res.data?.token) {
      throw new Error((res as any)?.error?.message || 'Login gagal. Periksa email dan password Anda.');
    }
    this.setStoredTokens(res.data.token, res.data.refreshToken);
    const user = await this.buildFrontendUser(res.data.user);
    this.setStoredUser(user);
    return user;
  }

  public static async loginWithGoogle(): Promise<User> {
    throw new Error('Login via Google belum tersedia. Silakan masuk dengan email & password.');
  }

  public static async loginWithDiscord(): Promise<User> {
    throw new Error('Login via Discord belum tersedia. Silakan masuk dengan email & password.');
  }

  // --- Registration Operations (API asli) ---

  public static async registerClient(data: ClientRegisterData): Promise<User> {
    const res = await authApi.registerClient({
      email: data.email,
      displayName: data.displayName,
      password: data.password,
      companyName: (data as any).companyName,
      discordUsername: (data as any).discordUsername,
    });
    if (!res?.success || !res.data?.token) {
      throw new Error((res as any)?.error?.message || 'Registrasi gagal. Silakan coba lagi.');
    }
    this.setStoredTokens(res.data.token, res.data.refreshToken);
    const user = await this.buildFrontendUser(res.data.user, {
      clientProfile: res.data.clientProfile,
    });
    this.setStoredUser(user);
    return user;
  }

  public static async registerDeveloper(data: DeveloperRegisterData): Promise<User> {
    const res = await authApi.registerDeveloper({
      email: data.email,
      displayName: data.displayName,
      password: data.password,
      specialization: data.specialization,
      bio: data.bio,
      skills: data.skills,
    });
    if (!res?.success || !res.data?.token) {
      throw new Error((res as any)?.error?.message || 'Registrasi developer gagal. Silakan coba lagi.');
    }
    this.setStoredTokens(res.data.token, res.data.refreshToken);
    const user = await this.buildFrontendUser(res.data.user, {
      developerProfile: res.data.developerProfile,
    });
    this.setStoredUser(user);
    return user;
  }

  // --- Logout ---

  public static logout(): void {
    try {
      void authApi.logout().catch(() => undefined);
    } finally {
      this.clearSession();
    }
  }
}
