import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';
import { UserPresence } from '../server/socket/socketEvents';

export function usePresence(orderNumber: string | null) {
  const { socket, isConnected } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);

  useEffect(() => {
    if (!orderNumber || !socket || !isConnected) return;

    const handleRoomJoined = (data: { orderNumber: string; onlineUsers: UserPresence[] }) => {
      if (data.orderNumber === orderNumber) {
        setOnlineUsers(data.onlineUsers || []);
      }
    };

    const handleUserOnline = (data: { orderNumber: string; userId: string; userDisplayName: string }) => {
      if (data.orderNumber === orderNumber) {
        setOnlineUsers((prev) => {
          if (prev.some((u) => u.userId === data.userId)) return prev;
          return [
            ...prev,
            {
              userId: data.userId,
              displayName: data.userDisplayName,
              isOnline: true,
              lastActive: new Date().toISOString(),
            },
          ];
        });
      }
    };

    const handleUserOffline = (data: { orderNumber: string; userId: string }) => {
      if (data.orderNumber === orderNumber) {
        setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      }
    };

    socket.on('roomJoined', handleRoomJoined);
    socket.on('userOnline', handleUserOnline);
    socket.on('userOffline', handleUserOffline);

    return () => {
      socket.off('roomJoined', handleRoomJoined);
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
    };
  }, [orderNumber, socket, isConnected]);

  return {
    onlineUsers,
    isUserOnline: (userId: string) => onlineUsers.some((u) => u.userId === userId),
  };
}
