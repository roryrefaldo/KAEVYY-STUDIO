import { fetchJson, buildQueryString } from './client';
import { DeveloperDTO, ApiResponse, DeveloperQueryParams } from '../../types/api';

export const developerApi = {
  /**
   * Fetch developer directory with specialization, tier, search and pagination
   */
  async getDevelopers(params?: DeveloperQueryParams): Promise<ApiResponse<DeveloperDTO[]>> {
    const query = buildQueryString(params);
    return fetchJson<DeveloperDTO[]>(`/developers${query}`);
  },

  /**
   * Fetch single developer profile details by ID
   */
  async getDeveloper(id: string): Promise<ApiResponse<DeveloperDTO>> {
    return fetchJson<DeveloperDTO>(`/developers/${encodeURIComponent(id)}`);
  },

  /**
   * Get logged-in developer's own profile
   */
  async getMyProfile(): Promise<ApiResponse<DeveloperDTO>> {
    return fetchJson<DeveloperDTO>('/developers/me');
  },

  /**
   * Update logged-in developer's profile
   */
  async updateMyProfile(data: Partial<DeveloperDTO>): Promise<ApiResponse<DeveloperDTO>> {
    return fetchJson<DeveloperDTO>('/developers/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get logged-in developer's active capacity slot details
   */
  async getMyCapacity(): Promise<ApiResponse<any>> {
    return fetchJson('/developers/me/capacity');
  },

  /**
   * Get logged-in developer's earnings ledger & analytics
   */
  async getMyEarnings(): Promise<ApiResponse<any>> {
    return fetchJson('/developers/me/earnings');
  },

  /**
   * Submit developer identity verification application
   */
  async submitVerification(data: {
    portfolioUrl?: string;
    identityProofUrl?: string;
    notes?: string;
  }): Promise<ApiResponse<any>> {
    return fetchJson('/developers/me/verification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get status of submitted verification application
   */
  async getVerificationStatus(): Promise<ApiResponse<any>> {
    return fetchJson('/developers/me/verification');
  },
};

// Standalone function exports for backward compatibility
export const getDevelopers = developerApi.getDevelopers;
export const getDeveloper = developerApi.getDeveloper;
