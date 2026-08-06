import { Socket, Server } from 'socket.io';
import {
  sendOrderMessage,
  editOrderMessage,
  deleteOrderMessage,
  markOrderMessagesRead,
} from '../services/message.service.js';
import { canUserAccessOrderRoom, getOrderRoomName } from './roomManager.js';
import { SocketUser, AttachmentItem } from './socketEvents.js';

export function registerMessageGateway(io: Server, socket: Socket): void {
  const user: SocketUser = socket.data.user;

  // 1. New Message
  socket.on('newMessage', async (data, callback) => {
    try {
      const { orderNumber, content, attachments, replyToId } = data;
      if (!orderNumber || (!content && (!attachments || attachments.length === 0))) {
        if (callback) callback({ success: false, error: 'Pesan atau lampiran tidak boleh kosong.' });
        return;
      }

      const hasAccess = await canUserAccessOrderRoom(user, orderNumber);
      if (!hasAccess) {
        if (callback) callback({ success: false, error: 'UNAUTHORIZED_ROOM_ACCESS' });
        return;
      }

      const message = await sendOrderMessage(orderNumber, user.id, {
        content: content || '',
        attachments,
        replyToId,
      });

      const roomName = getOrderRoomName(orderNumber);
      io.to(roomName).emit('newMessage', {
        message,
        orderNumber,
      });

      if (callback) callback({ success: true, message });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message || 'Gagal mengirim pesan.' });
    }
  });

  // 2. Typing Start
  socket.on('typingStart', async (data) => {
    const { orderNumber } = data;
    if (!orderNumber) return;

    const hasAccess = await canUserAccessOrderRoom(user, orderNumber);
    if (!hasAccess) return;

    const roomName = getOrderRoomName(orderNumber);
    socket.to(roomName).emit('typingStart', {
      orderNumber,
      userId: user.id,
      userDisplayName: user.displayName,
    });
  });

  // 3. Typing Stop
  socket.on('typingStop', async (data) => {
    const { orderNumber } = data;
    if (!orderNumber) return;

    const hasAccess = await canUserAccessOrderRoom(user, orderNumber);
    if (!hasAccess) return;

    const roomName = getOrderRoomName(orderNumber);
    socket.to(roomName).emit('typingStop', {
      orderNumber,
      userId: user.id,
    });
  });

  // 4. Message Edited
  socket.on('messageEdited', async (data, callback) => {
    try {
      const { orderNumber, messageId, content } = data;
      if (!orderNumber || !messageId || !content) {
        if (callback) callback({ success: false, error: 'Parameter tidak lengkap.' });
        return;
      }

      const hasAccess = await canUserAccessOrderRoom(user, orderNumber);
      if (!hasAccess) {
        if (callback) callback({ success: false, error: 'UNAUTHORIZED_ROOM_ACCESS' });
        return;
      }

      const result = await editOrderMessage(messageId, user.id, content);
      const roomName = getOrderRoomName(orderNumber);

      io.to(roomName).emit('messageEdited', {
        orderNumber,
        messageId: result.messageId,
        content: result.content,
        editedAt: result.editedAt,
      });

      if (callback) callback({ success: true });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message || 'Gagal mengubah pesan.' });
    }
  });

  // 5. Message Deleted
  socket.on('messageDeleted', async (data, callback) => {
    try {
      const { orderNumber, messageId } = data;
      if (!orderNumber || !messageId) {
        if (callback) callback({ success: false, error: 'Parameter tidak lengkap.' });
        return;
      }

      const hasAccess = await canUserAccessOrderRoom(user, orderNumber);
      if (!hasAccess) {
        if (callback) callback({ success: false, error: 'UNAUTHORIZED_ROOM_ACCESS' });
        return;
      }

      const result = await deleteOrderMessage(messageId, user.id);
      const roomName = getOrderRoomName(orderNumber);

      io.to(roomName).emit('messageDeleted', {
        orderNumber,
        messageId: result.messageId,
      });

      if (callback) callback({ success: true });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message || 'Gagal menghapus pesan.' });
    }
  });

  // 6. Message Read Receipt
  socket.on('messageRead', async (data) => {
    const { orderNumber, messageIds } = data;
    if (!orderNumber) return;

    const hasAccess = await canUserAccessOrderRoom(user, orderNumber);
    if (!hasAccess) return;

    const result = await markOrderMessagesRead(orderNumber, user.id, messageIds);
    const roomName = getOrderRoomName(orderNumber);

    socket.to(roomName).emit('messageRead', {
      orderNumber,
      userId: user.id,
      messageIds: messageIds || [],
      readAt: result.readAt,
    });
  });

  // 7. File Uploaded Event
  socket.on('fileUploaded', async (data) => {
    const { orderNumber, file, messageContent } = data;
    if (!orderNumber || !file) return;

    const hasAccess = await canUserAccessOrderRoom(user, orderNumber);
    if (!hasAccess) return;

    // Send a chat message with the attachment automatically
    const message = await sendOrderMessage(orderNumber, user.id, {
      content: messageContent || `Mengunggah berkas: ${file.fileName}`,
      attachments: [file],
    });

    const roomName = getOrderRoomName(orderNumber);
    io.to(roomName).emit('fileUploaded', {
      orderNumber,
      file,
      message,
    });
  });
}
