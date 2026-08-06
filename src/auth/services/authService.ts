import {
  User,
  LoginCredentials,
  ClientRegisterData,
  DeveloperRegisterData,
} from '../../types/auth';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Pre-configured Demo Users for Development / Prototype Adapter
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
 * Core Authentication Service handling Login, Register, Session & JWT operations.
 */
export class AuthService {
  private static STORAGE_KEY = 'kaevy_auth_user_v1';
  private static TOKEN_KEY = 'kaevy_auth_token_v1';

  // --- Session Management ---

  public static getStoredUser(): User | null {
    try {
      if (typeof window === 'undefined') return null;
      const json = localStorage.getItem(this.STORAGE_KEY);
      if (!json) return null;
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  public static setStoredUser(user: User | null) {
    if (typeof window === 'undefined') return;
    if (!user) {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
    } else {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      const token = this.generateToken(user);
      localStorage.setItem(this.TOKEN_KEY, token);
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

  // --- JWT / Token Helpers ---

  public static generateToken(user: User): string {
    return `kaevy_token_${user.id}`;
  }

  public static parseToken(token: string): JwtPayload | null {
    if (!token) return null;
    const rawId = token.startsWith('kaevy_token_') ? token.replace('kaevy_token_', '') : token;
    return {
      sub: rawId,
      email: '',
      role: 'CLIENT',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
    };
  }

  // --- Login Operations ---

  public static async loginWithPassword(credentials: LoginCredentials): Promise<User> {
    await new Promise((res) => setTimeout(res, 400));
    const emailLower = credentials.email.trim().toLowerCase();

    const foundDemo = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === emailLower);
    if (foundDemo) {
      this.setStoredUser(foundDemo);
      return foundDemo;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: credentials.email,
      displayName: credentials.email.split('@')[0],
      role: 'CLIENT',
      status: 'ACTIVE',
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${credentials.email}`,
      language: 'id',
      currency: 'IDR',
      createdAt: new Date().toISOString(),
    };

    this.setStoredUser(newUser);
    return newUser;
  }

  public static async loginWithGoogle(): Promise<User> {
    await new Promise((res) => setTimeout(res, 500));
    const googleUser: User = {
      id: `usr-google-${Date.now()}`,
      email: 'user.google@gmail.com',
      displayName: 'Google User',
      role: 'CLIENT',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      language: 'id',
      currency: 'IDR',
      createdAt: new Date().toISOString(),
    };
    this.setStoredUser(googleUser);
    return googleUser;
  }

  public static async loginWithDiscord(): Promise<User> {
    await new Promise((res) => setTimeout(res, 500));
    const discordUser: User = {
      id: `usr-discord-${Date.now()}`,
      email: 'discord.creator@kaevy.studio',
      displayName: 'RobloxCreator_Discord',
      role: 'CLIENT',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      language: 'id',
      currency: 'IDR',
      createdAt: new Date().toISOString(),
      clientProfile: {
        discord: 'robloxcreator#9999',
      },
    };
    this.setStoredUser(discordUser);
    return discordUser;
  }

  // --- Registration Operations ---

  public static async registerClient(data: ClientRegisterData): Promise<User> {
    await new Promise((res) => setTimeout(res, 400));
    const newClient: User = {
      id: `usr-client-${Date.now()}`,
      email: data.email,
      displayName: data.displayName || data.email.split('@')[0],
      role: 'CLIENT',
      status: 'ACTIVE',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${data.email}`,
      language: 'id',
      currency: 'IDR',
      createdAt: new Date().toISOString(),
      clientProfile: {
        discord: data.discord,
        whatsapp: data.whatsapp,
      },
    };
    this.setStoredUser(newClient);
    return newClient;
  }

  public static async registerDeveloper(data: DeveloperRegisterData): Promise<User> {
    await new Promise((res) => setTimeout(res, 400));
    const newDev: User = {
      id: `usr-dev-${Date.now()}`,
      email: data.email,
      displayName: data.displayName || data.email.split('@')[0],
      role: 'DEVELOPER',
      status: 'PENDING_VERIFICATION',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${data.email}`,
      language: 'id',
      currency: 'IDR',
      createdAt: new Date().toISOString(),
      developerProfile: {
        specialization: data.specialization || 'Luau / Lua Scripting',
        skills: data.skills || ['Luau'],
        portfolioUrl: data.portfolioUrl,
        bio: data.bio || 'Roblox Studio Developer',
        activeQueueCount: 0,
        maxQueueCapacity: 3,
        verificationStatus: 'PENDING',
        submittedAt: new Date().toLocaleString('id-ID'),
      },
    };
    this.setStoredUser(newDev);
    return newDev;
  }

  // --- Session Logout ---

  public static logout(): void {
    this.setStoredUser(null);
  }
}
