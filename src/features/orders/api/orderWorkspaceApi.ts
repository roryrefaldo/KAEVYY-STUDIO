import { orderApi } from '../../../lib/api/orderApi';
import { paymentApi } from '../../../lib/api/paymentApi';
import { notificationApi } from '../../../lib/api/notificationApi';
import { ApiResponse } from '../../../types/api';
import {
  OrderMilestoneItem,
  EscrowVaultRecord,
  WarrantyClaimRecord,
  OrderWorkspaceNotification,
} from '../types/orderWorkspace.types';

export const orderWorkspaceApi = {
  // Orders
  getOrders: () => orderApi.getOrders(),
  getOrderByNumber: (orderNumber: string) => orderApi.getOrderByNumber(orderNumber),
  acceptOrder: (orderNumber: string) => orderApi.acceptOrder(orderNumber),
  rejectOrder: (orderNumber: string, reason?: string) => orderApi.rejectOrder(orderNumber, reason),
  cancelOrder: (orderNumber: string) => orderApi.cancelOrder(orderNumber),

  // Milestones
  submitMilestone: (
    projectId: string,
    percentage: number,
    notes?: string,
    deliverableUrl?: string
  ) => orderApi.submitMilestone(projectId, percentage, notes, deliverableUrl),

  approveMilestone: (projectId: string, percentage: number) =>
    orderApi.approveMilestone(projectId, percentage),

  requestMilestoneRevision: (
    projectId: string,
    percentage: number,
    revisionNotes: string
  ) => orderApi.requestMilestoneRevision(projectId, percentage, revisionNotes),

  // Escrow
  getEscrowForOrder: (orderNumber: string) => paymentApi.getEscrowForOrder(orderNumber),

  // Notifications
  getNotifications: () => notificationApi.getNotifications(),
  markNotificationRead: (id: string) => notificationApi.markNotificationRead(id),
  markAllNotificationsRead: () => notificationApi.markAllNotificationsRead(),
};
