import { fetchJson } from './client';
import { ApiResponse } from '../../types/api';

export const authApi = {
  async registerClient(data: {
    email: string;
    displayName: string;
    password?: string;
  }): Promise<ApiResponse<any>> {
    return fetchJson('/auth/register/client', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async registerDeveloper(data: {
    email: string;
    displayName: string;
    specialization: string;
    bio?: string;
    password?: string;
  }): Promise<ApiResponse<any>> {
    return fetchJson('/auth/register/developer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(credentials: { email: string; password?: string }): Promise<ApiResponse<any>> {
    return fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async logout(): Promise<ApiResponse<any>> {
    return fetchJson('/auth/logout', {
      method: 'POST',
    });
  },

  async getMe(): Promise<ApiResponse<any>> {
    return fetchJson('/auth/me');
  },
};
