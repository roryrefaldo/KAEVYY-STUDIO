import { fetchJson } from './client';
import { ApiResponse } from '../../types/api';

export const paymentApi = {
  /**
   * Initialize checkout payment for an order (QRIS, VA, E-Wallet, PayPal)
   */
  async createPayment(
    orderNumber: string,
    data: {
      channel: string;
      currency?: string;
      amount?: number;
    }
  ): Promise<ApiResponse<any>> {
    return fetchJson(`/orders/${encodeURIComponent(orderNumber)}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Mark payment as paid (Webhook / Simulator trigger)
   */
  async markPaymentPaid(paymentId: string): Promise<ApiResponse<any>> {
    return fetchJson(`/payments/${encodeURIComponent(paymentId)}/mark-paid`, {
      method: 'PATCH',
    });
  },

  /**
   * Get escrow status details for an order
   */
  async getEscrowForOrder(orderNumber: string): Promise<ApiResponse<any>> {
    return fetchJson(`/orders/${encodeURIComponent(orderNumber)}/escrow`);
  },

  /**
   * Admin manual release of escrow vault funds
   */
  async releaseEscrow(escrowId: string): Promise<ApiResponse<any>> {
    return fetchJson(`/admin/escrow/${encodeURIComponent(escrowId)}/release`, {
      method: 'POST',
    });
  },

  /**
   * Admin refund escrow vault funds to client
   */
  async refundEscrow(escrowId: string, reason?: string): Promise<ApiResponse<any>> {
    return fetchJson(`/admin/escrow/${encodeURIComponent(escrowId)}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};
