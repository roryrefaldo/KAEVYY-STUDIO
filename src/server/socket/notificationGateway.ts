import { Server } from 'socket.io';
import { getOrderRoomName } from './roomManager.js';
import { AttachmentItem, NotificationPayload } from './socketEvents.js';

let ioServer: Server | null = null;

export function setNotificationGatewayIO(io: Server): void {
  ioServer = io;
}

export function emitNotificationToUser(userId: string, notification: NotificationPayload): void {
  if (!ioServer) return;
  const userRoom = `user:${userId}`;
  ioServer.to(userRoom).emit('notificationCreated', { notification });
}

export function emitMilestoneSubmitted(orderNumber: string, data: { milestoneId: string; title: string; submittedAt?: string }): void {
  if (!ioServer) return;
  const roomName = getOrderRoomName(orderNumber);
  ioServer.to(roomName).emit('milestoneSubmitted', {
    orderNumber,
    milestoneId: data.milestoneId,
    title: data.title,
    submittedAt: data.submittedAt || new Date().toISOString(),
  });
}

export function emitMilestoneApproved(orderNumber: string, data: { milestoneId: string; title: string; approvedAt?: string }): void {
  if (!ioServer) return;
  const roomName = getOrderRoomName(orderNumber);
  ioServer.to(roomName).emit('milestoneApproved', {
    orderNumber,
    milestoneId: data.milestoneId,
    title: data.title,
    approvedAt: data.approvedAt || new Date().toISOString(),
  });
}

export function emitRevisionRequested(orderNumber: string, data: { milestoneId: string; title: string; notes: string }): void {
  if (!ioServer) return;
  const roomName = getOrderRoomName(orderNumber);
  ioServer.to(roomName).emit('revisionRequested', {
    orderNumber,
    milestoneId: data.milestoneId,
    title: data.title,
    notes: data.notes,
  });
}

export function emitEscrowReleased(orderNumber: string, data: { amount: string; currency: string }): void {
  if (!ioServer) return;
  const roomName = getOrderRoomName(orderNumber);
  ioServer.to(roomName).emit('escrowReleased', {
    orderNumber,
    amount: data.amount,
    currency: data.currency,
  });
}

export function emitProjectCompleted(orderNumber: string, data?: { completedAt?: string }): void {
  if (!ioServer) return;
  const roomName = getOrderRoomName(orderNumber);
  ioServer.to(roomName).emit('projectCompleted', {
    orderNumber,
    completedAt: data?.completedAt || new Date().toISOString(),
  });
}

export function emitFileUploaded(orderNumber: string, file: AttachmentItem): void {
  if (!ioServer) return;
  const roomName = getOrderRoomName(orderNumber);
  ioServer.to(roomName).emit('fileUploaded', {
    orderNumber,
    file,
  });
}
