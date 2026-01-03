const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, error.message || 'An error occurred');
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    fetchApi<T>(endpoint, { method: 'GET', token }),

  post: <T>(endpoint: string, data: unknown, token?: string) =>
    fetchApi<T>(endpoint, { method: 'POST', body: JSON.stringify(data), token }),

  patch: <T>(endpoint: string, data: unknown, token?: string) =>
    fetchApi<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data), token }),

  delete: <T>(endpoint: string, token?: string) =>
    fetchApi<T>(endpoint, { method: 'DELETE', token }),
};

export { ApiError };
