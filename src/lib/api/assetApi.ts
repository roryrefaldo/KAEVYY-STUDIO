import { fetchJson, buildQueryString } from './client';
import { ApiResponse } from '../../types/api';

export const assetApi = {
  /**
   * Fetch public SHARE ASSET library catalog with filtering & search
   */
  async getAssets(params?: {
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    const query = buildQueryString(params);
    return fetchJson<any[]>(`/assets${query}`);
  },

  /**
   * Fetch asset detail specification by ID
   */
  async getAsset(id: string): Promise<ApiResponse<any>> {
    return fetchJson(`/assets/${encodeURIComponent(id)}`);
  },

  /**
   * Download asset package or Roblox model
   */
  async downloadAsset(id: string): Promise<ApiResponse<any>> {
    return fetchJson(`/assets/${encodeURIComponent(id)}/download`);
  },

  /**
   * Upload asset package to SHARE ASSET hub
   */
  async createAsset(data: {
    title: string;
    description: string;
    category: string;
    rbxmFileUrl?: string;
    docUrl?: string;
    tags?: string[];
  }): Promise<ApiResponse<any>> {
    return fetchJson('/assets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Submit uploaded asset for admin security & malware review
   */
  async submitAssetForReview(id: string): Promise<ApiResponse<any>> {
    return fetchJson(`/assets/${encodeURIComponent(id)}/submit-for-review`, {
      method: 'POST',
    });
  },

  /**
   * Admin approve or reject asset submission
   */
  async moderateAsset(
    id: string,
    action: 'APPROVE' | 'REJECT',
    reason?: string
  ): Promise<ApiResponse<any>> {
    return fetchJson(`/assets/admin/${encodeURIComponent(id)}/moderate`, {
      method: 'POST',
      body: JSON.stringify({ action, reason }),
    });
  },
};
