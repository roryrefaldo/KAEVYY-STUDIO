import { Socket } from 'socket.io';
import { SocketUser, UserPresence } from './socketEvents.js';
import { db } from '../../db/index.js';
import { orders, clientProfiles, developerProfiles } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

// In-memory active presence tracking for order rooms: orderNumber -> Map<userId, { socketId, user, connectedAt }>
const roomPresenceMap = new Map<
  string,
  Map<string, { socketId: string; user: SocketUser; connectedAt: Date }>
>();

export function getOrderRoomName(orderNumber: string): string {
  const cleanOrderNumber = orderNumber.trim().toUpperCase();
  return `order:${cleanOrderNumber}`;
}

export async function canUserAccessOrderRoom(user: SocketUser, orderNumber: string): Promise<boolean> {
  // Admin role bypasses order restrictions
  if (user.role === 'ADMIN' || user.roles?.includes('ADMIN')) {
    return true;
  }

  return safeDbExecute(
    async () => {
      const orderRows = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, orderNumber))
        .limit(1);

      if (orderRows.length === 0) return false;
      const order = orderRows[0];

      // Check client profile ownership
      if (order.clientProfileId) {
        const clientRows = await db
          .select()
          .from(clientProfiles)
          .where(eq(clientProfiles.id, order.clientProfileId))
          .limit(1);
        if (clientRows.length > 0 && clientRows[0].userId === user.id) {
          return true;
        }
      }

      // Check developer profile assignment
      if (order.developerProfileId) {
        const devRows = await db
          .select()
          .from(developerProfiles)
          .where(eq(developerProfiles.id, order.developerProfileId))
          .limit(1);
        if (devRows.length > 0 && devRows[0].userId === user.id) {
          return true;
        }
      }

      return false;
    },
    async () => {
      const order = mockData.orders.find(
        (o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()
      );
      if (!order) return false;

      if (order.clientProfileId) {
        const client = mockData.clientProfiles.find((c) => c.id === order.clientProfileId);
        if (client && client.userId === user.id) return true;
      }

      if (order.developerProfileId) {
        const dev = mockData.developerProfiles.find((d) => d.id === order.developerProfileId);
        if (dev && dev.userId === user.id) return true;
      }

      return false;
    }
  );
}

export async function joinOrderRoom(
  socket: Socket,
  orderNumber: string
): Promise<{ success: boolean; room: string; onlineUsers: UserPresence[]; error?: string }> {
  const user: SocketUser = socket.data.user;
  if (!user) {
    return { success: false, room: '', onlineUsers: [], error: 'Pengguna tidak terautentikasi.' };
  }

  const hasAccess = await canUserAccessOrderRoom(user, orderNumber);
  if (!hasAccess) {
    return {
      success: false,
      room: '',
      onlineUsers: [],
      error: 'UNAUTHORIZED_ROOM_ACCESS: Anda tidak memiliki wewenang untuk bergabung ke ruang kerja pesanan ini.',
    };
  }

  const roomName = getOrderRoomName(orderNumber);
  socket.join(roomName);

  if (!socket.data.joinedRooms) {
    socket.data.joinedRooms = new Set<string>();
  }
  socket.data.joinedRooms.add(roomName);

  // Update room presence
  if (!roomPresenceMap.has(roomName)) {
    roomPresenceMap.set(roomName, new Map());
  }
  const presenceMap = roomPresenceMap.get(roomName)!;
  presenceMap.set(user.id, {
    socketId: socket.id,
    user,
    connectedAt: new Date(),
  });

  // Notify other occupants in room that user came online
  socket.to(roomName).emit('userOnline', {
    orderNumber,
    userId: user.id,
    userDisplayName: user.displayName,
  });

  const onlineUsers = getRoomOnlineUsers(orderNumber);

  return {
    success: true,
    room: roomName,
    onlineUsers,
  };
}

export function leaveOrderRoom(
  socket: Socket,
  orderNumber: string
): { success: boolean; room: string } {
  const user: SocketUser = socket.data.user;
  const roomName = getOrderRoomName(orderNumber);

  socket.leave(roomName);
  if (socket.data.joinedRooms) {
    socket.data.joinedRooms.delete(roomName);
  }

  if (roomPresenceMap.has(roomName)) {
    const presenceMap = roomPresenceMap.get(roomName)!;
    presenceMap.delete(user?.id);
    if (presenceMap.size === 0) {
      roomPresenceMap.delete(roomName);
    }
  }

  if (user?.id) {
    socket.to(roomName).emit('userOffline', {
      orderNumber,
      userId: user.id,
    });
  }

  return { success: true, room: roomName };
}

export function getRoomOnlineUsers(orderNumber: string): UserPresence[] {
  const roomName = getOrderRoomName(orderNumber);
  const presenceMap = roomPresenceMap.get(roomName);
  if (!presenceMap) return [];

  const users: UserPresence[] = [];
  presenceMap.forEach(({ user, connectedAt }) => {
    users.push({
      userId: user.id,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      isOnline: true,
      lastActive: connectedAt.toISOString(),
    });
  });

  return users;
}

export function handleSocketDisconnect(socket: Socket): void {
  const user: SocketUser = socket.data.user;
  const joinedRooms: Set<string> = socket.data.joinedRooms;

  if (!joinedRooms || !user) return;

  joinedRooms.forEach((roomName) => {
    socket.leave(roomName);
    if (roomPresenceMap.has(roomName)) {
      const presenceMap = roomPresenceMap.get(roomName)!;
      presenceMap.delete(user.id);

      const orderNumber = roomName.replace('order:', '');
      socket.to(roomName).emit('userOffline', {
        orderNumber,
        userId: user.id,
      });

      if (presenceMap.size === 0) {
        roomPresenceMap.delete(roomName);
      }
    }
  });

  joinedRooms.clear();
}
