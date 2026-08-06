import { fetchJson, buildQueryString } from './client';
import { ApiResponse } from '../../types/api';

export const orderApi = {
  /**
   * Create a new order for a service
   */
  async createOrder(data: {
    serviceId: string;
    customScopeDescription?: string;
    customAgreedPrice?: number;
    customAgreedCurrency?: string;
  }): Promise<ApiResponse<any>> {
    return fetchJson('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * List client or developer orders
   */
  async getOrders(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<any[]>> {
    const query = buildQueryString(params);
    return fetchJson<any[]>(`/orders${query}`);
  },

  /**
   * Get order details by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<ApiResponse<any>> {
    return fetchJson(`/orders/${encodeURIComponent(orderNumber)}`);
  },

  /**
   * Developer accepts an order
   */
  async acceptOrder(orderNumber: string): Promise<ApiResponse<any>> {
    return fetchJson(`/orders/${encodeURIComponent(orderNumber)}/accept`, {
      method: 'PATCH',
    });
  },

  /**
   * Developer rejects an order
   */
  async rejectOrder(orderNumber: string, reason?: string): Promise<ApiResponse<any>> {
    return fetchJson(`/orders/${encodeURIComponent(orderNumber)}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  /**
   * Cancel an active or pending order
   */
  async cancelOrder(orderNumber: string): Promise<ApiResponse<any>> {
    return fetchJson(`/orders/${encodeURIComponent(orderNumber)}/cancel`, {
      method: 'PATCH',
    });
  },

  /**
   * Fetch audit trail / activity events for an order
   */
  async getOrderEvents(orderNumber: string): Promise<ApiResponse<any[]>> {
    return fetchJson<any[]>(`/orders/${encodeURIComponent(orderNumber)}/events`);
  },

  /**
   * Fetch milestone project details
   */
  async getProject(id: string): Promise<ApiResponse<any>> {
    return fetchJson(`/projects/${encodeURIComponent(id)}`);
  },

  /**
   * Developer submits a milestone for approval
   */
  async submitMilestone(
    projectId: string,
    percentage: number,
    notes?: string,
    deliverableUrl?: string
  ): Promise<ApiResponse<any>> {
    return fetchJson(`/projects/${encodeURIComponent(projectId)}/milestones/${percentage}/submit`, {
      method: 'POST',
      body: JSON.stringify({ notes, deliverableUrl }),
    });
  },

  /**
   * Client approves milestone release of escrow funds
   */
  async approveMilestone(projectId: string, percentage: number): Promise<ApiResponse<any>> {
    return fetchJson(`/projects/${encodeURIComponent(projectId)}/milestones/${percentage}/approve`, {
      method: 'POST',
    });
  },

  /**
   * Client requests milestone revision
   */
  async requestMilestoneRevision(
    projectId: string,
    percentage: number,
    revisionNotes: string
  ): Promise<ApiResponse<any>> {
    return fetchJson(`/projects/${encodeURIComponent(projectId)}/milestones/${percentage}/request-revision`, {
      method: 'POST',
      body: JSON.stringify({ revisionNotes }),
    });
  },
};

// Standalone function exports for backward compatibility
export const createOrder = orderApi.createOrder;
export const getOrders = orderApi.getOrders;
export const getOrderByNumber = orderApi.getOrderByNumber;
export const acceptOrder = orderApi.acceptOrder;
export const rejectOrder = orderApi.rejectOrder;
export const cancelOrder = orderApi.cancelOrder;
export const getOrderEvents = orderApi.getOrderEvents;
export const getProject = orderApi.getProject;
export const submitMilestone = orderApi.submitMilestone;
export const approveMilestone = orderApi.approveMilestone;
export const requestMilestoneRevision = orderApi.requestMilestoneRevision;
