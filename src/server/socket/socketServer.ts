import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { authenticateSocket } from './socketAuth.js';
import {
  joinOrderRoom,
  leaveOrderRoom,
  handleSocketDisconnect,
} from './roomManager.js';
import { registerMessageGateway } from './messageGateway.js';
import { setNotificationGatewayIO } from './notificationGateway.js';
import { metricsTracker } from '../observability/metricsTracker.js';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  SocketUser,
} from './socketEvents.js';

let io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> | null = null;

export function initSocketServer(httpServer: HttpServer): SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
  io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
    cors: {
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingInterval: 25000,
    pingTimeout: 20000,
    transports: ['websocket', 'polling'],
  });

  // Apply JWT Socket Authentication Middleware
  io.use(authenticateSocket);

  // Set IO reference for notification gateway
  setNotificationGatewayIO(io as any);

  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    const user: SocketUser = socket.data.user;

    // Join user's private notification channel: user:<userId>
    const userChannel = `user:${user.id}`;
    socket.join(userChannel);

    // Update Socket Metrics
    const clientCount = io ? io.sockets.sockets.size : 1;
    const roomCount = io ? io.sockets.adapter.rooms.size : 1;
    metricsTracker.updateSocketStats(clientCount, roomCount, 0);

    // Register Join Room Handler
    socket.on('joinRoom', async (data, callback) => {
      metricsTracker.updateSocketStats(io ? io.sockets.sockets.size : 1, io ? io.sockets.adapter.rooms.size : 1, 1);
      const { orderNumber } = data || {};
      if (!orderNumber) {
        if (callback) callback({ success: false, error: 'Order number is required.' });
        return;
      }

      const result = await joinOrderRoom(socket as any, orderNumber);
      if (result.success) {
        socket.emit('roomJoined', {
          orderNumber,
          room: result.room,
          onlineUsers: result.onlineUsers,
        });
        if (callback) callback({ success: true });
      } else {
        socket.emit('error', {
          message: result.error || 'UNAUTHORIZED_ROOM_ACCESS',
          code: 'UNAUTHORIZED_ROOM_ACCESS',
        });
        if (callback) callback({ success: false, error: result.error });
      }
    });

    // Register Leave Room Handler
    socket.on('leaveRoom', (data) => {
      metricsTracker.updateSocketStats(io ? io.sockets.sockets.size : 1, io ? io.sockets.adapter.rooms.size : 1, 1);
      const { orderNumber } = data || {};
      if (orderNumber) {
        const result = leaveOrderRoom(socket as any, orderNumber);
        socket.emit('roomLeft', {
          orderNumber,
          room: result.room,
        });
      }
    });

    // Register Messaging & Chat Event Handlers
    registerMessageGateway(io as any, socket as any);

    // Handle Socket Disconnect
    socket.on('disconnect', (reason) => {
      handleSocketDisconnect(socket as any);
      metricsTracker.updateSocketStats(
        io ? Math.max(0, io.sockets.sockets.size - 1) : 0,
        io ? io.sockets.adapter.rooms.size : 0,
        0,
        reason
      );
    });
  });

  return io;
}

export function getIO(): SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
  if (!io) {
    throw new Error('Socket.IO server has not been initialized. Call initSocketServer first.');
  }
  return io;
}
