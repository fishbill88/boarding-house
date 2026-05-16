import { apiClient } from './client';

export const tenantsApi = {
  listPending: () => apiClient.get('/tenants/pending'),
  approve: (id: string, roomNumber?: string) => apiClient.patch(`/tenants/${id}/approve`, { roomNumber }),
  reject: (id: string, reason: string) => apiClient.patch(`/tenants/${id}/reject`, { reason }),
};
