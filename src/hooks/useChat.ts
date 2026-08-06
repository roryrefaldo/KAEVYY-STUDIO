import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';
import { ChatMessage, AttachmentItem } from '../server/socket/socketEvents';

export function useChat(orderNumber: string | null) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const orderNumberRef = useRef(orderNumber);

  orderNumberRef.current = orderNumber;

  // 1. Fetch initial message history from API
  const fetchMessages = useCallback(async (ordNum: string) => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/v1/messages/orders/${encodeURIComponent(ordNum)}?limit=100`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setMessages(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch message history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // 2. Join order room and listen to socket events
  useEffect(() => {
    if (!orderNumber || !socket || !isConnected) return;

    fetchMessages(orderNumber);

    // Join room
    socket.emit('joinRoom', { orderNumber });

    // Event handlers
    const handleNewMessage = (data: { message: ChatMessage; orderNumber: string }) => {
      if (data.orderNumber === orderNumberRef.current) {
        setMessages((prev) => {
          // Idempotency check to prevent duplicate messages
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
      }
    };

    const handleMessageEdited = (data: { orderNumber: string; messageId: string; content: string; editedAt: string }) => {
      if (data.orderNumber === orderNumberRef.current) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId
              ? { ...msg, content: data.content, isEdited: true, editedAt: data.editedAt }
              : msg
          )
        );
      }
    };

    const handleMessageDeleted = (data: { orderNumber: string; messageId: string }) => {
      if (data.orderNumber === orderNumberRef.current) {
        setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
      }
    };

    const handleMessageRead = (data: { orderNumber: string; userId: string; messageIds: string[]; readAt: string }) => {
      if (data.orderNumber === orderNumberRef.current) {
        setMessages((prev) =>
          prev.map((msg) => {
            if (!data.messageIds.length || data.messageIds.includes(msg.id)) {
              return { ...msg, readAt: data.readAt };
            }
            return msg;
          })
        );
      }
    };

    const handleFileUploaded = (data: { orderNumber: string; file: AttachmentItem; message?: ChatMessage }) => {
      if (data.orderNumber === orderNumberRef.current && data.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message!.id)) return prev;
          return [...prev, data.message!];
        });
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageEdited', handleMessageEdited);
    socket.on('messageDeleted', handleMessageDeleted);
    socket.on('messageRead', handleMessageRead);
    socket.on('fileUploaded', handleFileUploaded);

    return () => {
      socket.emit('leaveRoom', { orderNumber });
      socket.off('newMessage', handleNewMessage);
      socket.off('messageEdited', handleMessageEdited);
      socket.off('messageDeleted', handleMessageDeleted);
      socket.off('messageRead', handleMessageRead);
      socket.off('fileUploaded', handleFileUploaded);
    };
  }, [orderNumber, socket, isConnected, fetchMessages]);

  // Actions
  const sendMessage = useCallback(
    async (content: string, attachments?: AttachmentItem[], replyToId?: string) => {
      if (!orderNumber || !socket) return false;

      return new Promise<boolean>((resolve) => {
        socket.emit('newMessage', { orderNumber, content, attachments, replyToId }, (res) => {
          if (res?.success && res.message) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === res.message!.id)) return prev;
              return [...prev, res.message!];
            });
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    [orderNumber, socket]
  );

  const editMessage = useCallback(
    async (messageId: string, content: string) => {
      if (!orderNumber || !socket) return false;

      return new Promise<boolean>((resolve) => {
        socket.emit('messageEdited', { orderNumber, messageId, content }, (res) => {
          if (res?.success) {
            setMessages((prev) =>
              prev.map((m) => (m.id === messageId ? { ...m, content, isEdited: true } : m))
            );
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    [orderNumber, socket]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!orderNumber || !socket) return false;

      return new Promise<boolean>((resolve) => {
        socket.emit('messageDeleted', { orderNumber, messageId }, (res) => {
          if (res?.success) {
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    [orderNumber, socket]
  );

  const markAsRead = useCallback(
    (messageIds?: string[]) => {
      if (!orderNumber || !socket) return;
      socket.emit('messageRead', { orderNumber, messageIds });
      setUnreadCount(0);
    },
    [orderNumber, socket]
  );

  return {
    messages,
    isLoadingHistory,
    unreadCount,
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
    refreshHistory: () => orderNumber && fetchMessages(orderNumber),
  };
}
