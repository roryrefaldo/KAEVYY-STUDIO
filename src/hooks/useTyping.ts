import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';

export interface TypingUser {
  userId: string;
  userDisplayName: string;
}

export function useTyping(orderNumber: string | null) {
  const { socket, isConnected } = useSocket();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const isTypingRef = useRef<boolean>(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!orderNumber || !socket || !isConnected) return;

    const handleTypingStart = (data: { orderNumber: string; userId: string; userDisplayName: string }) => {
      if (data.orderNumber === orderNumber) {
        setTypingUsers((prev) => {
          if (prev.some((u) => u.userId === data.userId)) return prev;
          return [...prev, { userId: data.userId, userDisplayName: data.userDisplayName }];
        });
      }
    };

    const handleTypingStop = (data: { orderNumber: string; userId: string }) => {
      if (data.orderNumber === orderNumber) {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      }
    };

    socket.on('typingStart', handleTypingStart);
    socket.on('typingStop', handleTypingStop);

    return () => {
      socket.off('typingStart', handleTypingStart);
      socket.off('typingStop', handleTypingStop);
      setTypingUsers([]);
    };
  }, [orderNumber, socket, isConnected]);

  const startTyping = useCallback(() => {
    if (!orderNumber || !socket) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typingStart', { orderNumber });
    }

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      stopTyping();
    }, 2500);
  }, [orderNumber, socket]);

  const stopTyping = useCallback(() => {
    if (!orderNumber || !socket) return;

    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket.emit('typingStop', { orderNumber });
    }

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }, [orderNumber, socket]);

  return {
    typingUsers,
    startTyping,
    stopTyping,
  };
}
