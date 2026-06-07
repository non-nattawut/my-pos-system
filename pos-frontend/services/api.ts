import axios from 'axios';
import { AUTH_TOKEN_KEY, AUTH_COOKIE_KEY } from '@/constants';

const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8080`;
  }
  return 'http://localhost:8080';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Attach the JWT token to every outgoing request when available.
 * Supports both client-side (localStorage) and server-side (Next.js cookies).
 */
api.interceptors.request.use(async (config) => {
  let token: string | null = null;

  if (typeof window !== 'undefined') {
    // Client-side
    token = localStorage.getItem(AUTH_TOKEN_KEY);
  } else {
    // Server-side
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const tokenCookie = cookieStore.get(AUTH_TOKEN_KEY);
      if (tokenCookie?.value) {
        token = tokenCookie.value;
      }
    } catch (e: any) {
      // Re-throw Next.js dynamic rendering bailout errors so the build system doesn't hang
      if (e && (e.digest === 'DYNAMIC_SERVER_USAGE' || e.message?.includes('Dynamic server usage'))) {
        throw e;
      }
    }
  }

  if (token) {
    config.headers = config.headers || {};
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * Response interceptor to handle 403 Forbidden.
 * On the client side, it clears the auth cookies/localStorage and redirects to the homepage.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_COOKIE_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        document.cookie = `${AUTH_COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
