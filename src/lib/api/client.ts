import { ApiResponse, ApiPaginationMeta } from '../../types/api';
import { AuthService } from '../../services/authService';

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function handleApiError(err: any): ApiError {
  if (err instanceof ApiError) {
    return err;
  }
  const message = err?.message || 'Koneksi jaringan terputus atau terjadi kesalahan server.';
  const code = err?.code || 'NETWORK_ERROR';
  const status = typeof err?.status === 'number' ? err.status : 0;
  return new ApiError(message, status, code, err);
}

export const getBaseUrl = (): string => {
  return typeof window !== 'undefined' ? '/api/v1' : 'http://localhost:3000/api/v1';
};

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${getBaseUrl()}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

// In-flight GET request deduplication cache to prevent duplicate parallel requests
const inFlightRequests = new Map<string, Promise<any>>();

/** Coba perpanjang sesi lewat refresh token. Dipanggil sekali saat dapat 401. */
async function attemptRefreshToken(): Promise<boolean> {
  const refreshToken = AuthService.getStoredRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${getBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const body = await res.json().catch(() => null);
    const newToken = body?.data?.token;
    if (!res.ok || !newToken) return false;
    AuthService.setStoredTokens(newToken, body?.data?.refreshToken);
    return true;
  } catch {
    return false;
  }
}

function buildHeaders(options?: RequestInit): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  };

  // Tempel JWT asli kalau user sudah login. Tidak ada lagi token demo.
  if (!headers['Authorization'] && !headers['authorization']) {
    const token = AuthService.getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const method = (options?.method || 'GET').toUpperCase();
  const isGet = method === 'GET';
  const dedupeKey = isGet ? `${endpoint}:${JSON.stringify(options?.headers || {})}` : null;

  if (isGet && dedupeKey && inFlightRequests.has(dedupeKey)) {
    return inFlightRequests.get(dedupeKey) as Promise<ApiResponse<T>>;
  }

  const doFetch = async (): Promise<Response> => {
    try {
      return await fetch(`${getBaseUrl()}${endpoint}`, {
        ...options,
        headers: buildHeaders(options),
      });
    } catch (networkErr: any) {
      throw new ApiError(
        networkErr?.message || 'Gagal terhubung ke backend server.',
        0,
        'NETWORK_ERROR'
      );
    }
  };

  const requestPromise = (async (): Promise<ApiResponse<T>> => {
    try {
      let res = await doFetch();

      // Access token kedaluwarsa → refresh sekali, lalu ulangi request
      if (res.status === 401 && AuthService.getStoredRefreshToken()) {
        const refreshed = await attemptRefreshToken();
        if (refreshed) {
          res = await doFetch();
        } else {
          AuthService.clearSession();
        }
      }

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMessage = body?.error?.message || body?.message || `Permintaan API gagal (${res.status})`;
        const errorCode = body?.error?.code || 'API_ERROR';
        const errorDetails = body?.error?.details || null;
        throw new ApiError(errorMessage, res.status, errorCode, errorDetails);
      }

      if (body && typeof body === 'object' && 'success' in body) {
        return body as ApiResponse<T>;
      }

      return {
        success: true,
        data: body as T,
      };
    } catch (err: any) {
      throw handleApiError(err);
    } finally {
      if (isGet && dedupeKey) {
        inFlightRequests.delete(dedupeKey);
      }
    }
  })();

  if (isGet && dedupeKey) {
    inFlightRequests.set(dedupeKey, requestPromise);
  }

  return requestPromise;
}

export function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export function buildPaginationMeta(
  page: number = 1,
  limit: number = 20,
  total: number = 0
): ApiPaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / (limit || 1)) || 1,
  };
}
