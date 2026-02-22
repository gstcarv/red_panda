import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/auth-store';

export const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

export function applyAuthHeader(config: InternalAxiosRequestConfig) {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

export function handleApiError(error: AxiosError) {
  if (error?.response?.status === 401) {
    useAuthStore.getState().logout();

    if (window.location.pathname !== '/login') {
      window.location.assign('/login');
    }
  }

  return Promise.reject(error);
}

api.interceptors.request.use(applyAuthHeader);
api.interceptors.response.use((response) => response, handleApiError);
