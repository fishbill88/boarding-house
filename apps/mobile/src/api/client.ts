import axios from 'axios';
import { config } from '../constants/config';
import { useAuthStore } from '../store/authStore';

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
});

apiClient.interceptors.request.use((request) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status !== 401 || error.config._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push((token) => {
          if (!token) {
            reject(error);
            return;
          }

          error.config.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(error.config));
        });
      });
    }

    isRefreshing = true;
    error.config._retry = true;

    try {
      const { refreshToken } = useAuthStore.getState();
      const response = await axios.post(`${config.apiBaseUrl}/auth/refresh`, { refreshToken });
      const token = response.data?.data?.accessToken as string;
      useAuthStore.setState({ accessToken: token });
      pendingRequests.forEach((callback) => callback(token));
      pendingRequests = [];
      error.config.headers.Authorization = `Bearer ${token}`;
      return apiClient(error.config);
    } catch (refreshError) {
      pendingRequests.forEach((callback) => callback(null));
      pendingRequests = [];
      await useAuthStore.getState().clearSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
