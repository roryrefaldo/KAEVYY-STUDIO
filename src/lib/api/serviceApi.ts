import { fetchJson, buildQueryString } from './client';
import { ServiceDTO, ApiResponse, ServiceQueryParams } from '../../types/api';

export const serviceApi = {
  /**
   * Fetch marketplace services catalog with filtering and pagination
   */
  async getServices(params?: ServiceQueryParams): Promise<ApiResponse<ServiceDTO[]>> {
    const query = buildQueryString(params);
    return fetchJson<ServiceDTO[]>(`/services${query}`);
  },

  /**
   * Fetch single service details by ID or slug
   */
  async getService(id: string): Promise<ApiResponse<ServiceDTO>> {
    return fetchJson<ServiceDTO>(`/services/${encodeURIComponent(id)}`);
  },

  /**
   * Create new developer service listing
   */
  async createService(data: Partial<ServiceDTO>): Promise<ApiResponse<ServiceDTO>> {
    return fetchJson<ServiceDTO>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update existing service listing
   */
  async updateService(id: string, data: Partial<ServiceDTO>): Promise<ApiResponse<ServiceDTO>> {
    return fetchJson<ServiceDTO>(`/services/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete or archive service listing
   */
  async deleteService(id: string): Promise<ApiResponse<any>> {
    return fetchJson(`/services/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};

// Standalone function exports for backward compatibility
export const getServices = serviceApi.getServices;
export const getService = serviceApi.getService;
