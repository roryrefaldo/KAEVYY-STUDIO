import { Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/auth.utils.js';
import { authRepository } from '../repositories/auth.repository.js';
import { mockData } from '../../db/mockStore.js';
import { SocketUser } from './socketEvents.js';

export async function authenticateSocket(
  socket: Socket,
  next: (err?: Error) => void
): Promise<void> {
  try {
    const authHeader = socket.handshake.headers.authorization;
    let token = socket.handshake.auth?.token || socket.handshake.auth?.accessToken;

    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token && socket.handshake.headers.cookie) {
      const cookies = socket.handshake.headers.cookie.split(';').reduce((acc: any, c) => {
        const [k, v] = c.trim().split('=');
        acc[k] = v;
        return acc;
      }, {});
      token = cookies['access_token'];
    }

    if (!token) {
      return next(new Error('AUTHENTICATION_FAILED: Token tidak ditemukan. Silakan masuk terlebih dahulu.'));
    }

    let user: SocketUser | null = null;

    // Check if token is standard JWT
    const decoded = verifyAccessToken(token);
    if (decoded?.userId) {
      const dbUser = await authRepository.findUserById(decoded.userId);
      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          displayName: dbUser.displayName,
          avatarUrl: dbUser.avatarUrl,
          roles: decoded.roles || [],
          role: decoded.roles?.[0] || 'CLIENT',
        };
      }
    }

    // Fallback for mock token format kaevy_token_<userId> or direct mock match
     const allowLegacyAuth = process.env.ALLOW_LEGACY_AUTH === 'true';
     if (!user && allowLegacyAuth && typeof token === 'string' && token.startsWith('kaevy_token_')) {
      const userId = token.replace('kaevy_token_', '');
      const dbUser = await authRepository.findUserById(userId);
      if (dbUser) {
        const userRoles = mockData.userRoles.filter((ur) => ur.userId === userId);
        const roles = userRoles.map((ur) => {
          const r = mockData.roles.find((role) => role.id === ur.roleId);
          return r ? r.code : 'CLIENT';
        });
        user = {
          id: dbUser.id,
          email: dbUser.email,
          displayName: dbUser.displayName,
          avatarUrl: dbUser.avatarUrl,
          roles,
          role: roles[0] || 'CLIENT',
        };
      }
    }

    // Direct mock match if id equals token
    if (!user && allowLegacyAuth) {
      const mockUser = mockData.users.find((u) => u.id === token || u.email === token);
      if (mockUser) {
        const userRoles = mockData.userRoles.filter((ur) => ur.userId === mockUser.id);
        const roles = userRoles.map((ur) => {
          const r = mockData.roles.find((role) => role.id === ur.roleId);
          return r ? r.code : 'CLIENT';
        });
        user = {
          id: mockUser.id,
          email: mockUser.email,
          displayName: mockUser.displayName,
          avatarUrl: mockUser.avatarUrl,
          roles,
          role: roles[0] || 'CLIENT',
        };
      }
    }

    if (!user) {
      return next(new Error('AUTHENTICATION_FAILED: Token tidak valid atau pengguna tidak ditemukan.'));
    }

    // Attach user and room tracking state to socket data
    socket.data.user = user;
    socket.data.joinedRooms = new Set<string>();

    return next();
  } catch (error: any) {
    return next(new Error(`AUTHENTICATION_FAILED: ${error.message || 'Gagal memverifikasi kredensial socket.'}`));
  }
}
