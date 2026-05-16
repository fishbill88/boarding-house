import { apiClient } from './client';

export const houseApi = {
  getHouse: () => apiClient.get('/house'),
  getSettings: () => apiClient.get('/house/settings'),
  getCode: () => apiClient.get('/house/code'),
};
