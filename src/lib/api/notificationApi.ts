import { fetchJson } from './client';
import { ApiResponse } from '../../types/api';

export const notificationApi = {
  /**
   * Fetch user notifications list
   */
  async getNotifications(): Promise<ApiResponse<any[]>> {
    return fetchJson<any[]>('/notifications');
  },

  /**
   * Mark a notification as read
   */
  async markNotificationRead(id: string): Promise<ApiResponse<any>> {
    return fetchJson(`/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
    });
  },

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<ApiResponse<any>> {
    return fetchJson('/notifications/read-all', {
      method: 'PATCH',
    });
  },
};

// Standalone function exports for backward compatibility
export const getNotifications = notificationApi.getNotifications;
export const markNotificationRead = notificationApi.markNotificationRead;
