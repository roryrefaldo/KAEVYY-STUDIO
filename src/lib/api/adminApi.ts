import { fetchJson, buildQueryString } from './client';
import { ApiResponse } from '../../types/api';

export const adminApi = {
  /**
   * Fetch platform metrics, escrow vault balance, and queue capacity stats
   */
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return fetchJson('/admin/dashboard');
  },

  /**
   * List platform audit logs
   */
  async listAuditLogs(params?: { page?: number; limit?: number }): Promise<ApiResponse<any[]>> {
    const query = buildQueryString(params);
    return fetchJson<any[]>(`/admin/audit-logs${query}`);
  },

  /**
   * Approve developer verification application
   */
  async approveVerification(id: string): Promise<ApiResponse<any>> {
    return fetchJson(`/admin/verifications/${encodeURIComponent(id)}/approve`, {
      method: 'POST',
    });
  },

  /**
   * Reject developer verification application
   */
  async rejectVerification(id: string, reason?: string): Promise<ApiResponse<any>> {
    return fetchJson(`/admin/verifications/${encodeURIComponent(id)}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  /**
   * Suspend user account
   */
  async suspendUser(id: string, reason?: string): Promise<ApiResponse<any>> {
    return fetchJson(`/admin/users/${encodeURIComponent(id)}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  /**
   * Re-activate suspended user account
   */
  async activateUser(id: string): Promise<ApiResponse<any>> {
    return fetchJson(`/admin/users/${encodeURIComponent(id)}/activate`, {
      method: 'POST',
    });
  },
};
