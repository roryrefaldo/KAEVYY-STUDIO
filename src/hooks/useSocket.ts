import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { ClientToServerEvents, ServerToClientEvents } from '../server/socket/socketEvents';

let globalSocket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
let currentToken: string | null = null;
let refCount = 0;

export function useSocket() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean>(globalSocket?.connected || false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(globalSocket);

  useEffect(() => {
    if (!user) {
      if (globalSocket) {
        globalSocket.disconnect();
        globalSocket = null;
        currentToken = null;
      }
      socketRef.current = null;
      setIsConnected(false);
      return;
    }

    const token = (user as any).token || `kaevy_token_${user.id}`;

    if (!globalSocket || currentToken !== token) {
      if (globalSocket) {
        globalSocket.disconnect();
      }

      currentToken = token;
      globalSocket = io({
        auth: { token },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });
    }

    refCount++;
    const socket = globalSocket;
    socketRef.current = socket;
    setIsConnected(socket.connected);

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = (err: any) => {
      setIsConnected(false);
      setConnectionError(err.message || 'Koneksi real-time terputus');
    };

    const handleError = (errData: any) => {
      if (errData?.message) {
        setConnectionError(errData.message);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('error' as any, handleError);

    return () => {
      refCount--;
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('error' as any, handleError);

      if (refCount <= 0 && globalSocket) {
        // Safe disconnection when no hooks are actively referencing the socket
        setTimeout(() => {
          if (refCount <= 0 && globalSocket) {
            globalSocket.disconnect();
            globalSocket = null;
            currentToken = null;
          }
        }, 1000);
      }
    };
  }, [user?.id]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
  };
}

