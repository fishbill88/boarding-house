import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export const appliancesApi = {
  register: (payload: { name: string; description?: string; watts?: number; houseId: string }) =>
    apiClient.post('/appliances', payload),
  listMine: () => apiClient.get('/appliances/me'),
  list: (params?: Record<string, string>) => apiClient.get('/appliances', { params }),
  get: (id: string) => apiClient.get(`/appliances/${id}`),
  approve: (id: string, payload: { billingType: string; registrationFee?: number }) =>
    apiClient.patch(`/appliances/${id}/approve`, payload),
  reject: (id: string) => apiClient.patch(`/appliances/${id}/reject`),
  delete: (id: string) => apiClient.delete(`/appliances/${id}`),
};

export const useMyAppliances = () =>
  useQuery({ queryKey: ['my-appliances'], queryFn: () => appliancesApi.listMine().then(r => r.data.data) });

export const useAppliances = (params?: Record<string, string>) =>
  useQuery({ queryKey: ['appliances', params], queryFn: () => appliancesApi.list(params).then(r => r.data.data) });

export const useApplianceDetail = (id: string) =>
  useQuery({ queryKey: ['appliance', id], queryFn: () => appliancesApi.get(id).then(r => r.data.data), enabled: Boolean(id) });

export const useRegisterAppliance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; description?: string; watts?: number; houseId: string }) =>
      appliancesApi.register(payload).then(r => r.data.data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['my-appliances'] }),
  });
};

export const useApproveAppliance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; billingType: string; registrationFee?: number }) =>
      appliancesApi.approve(id, payload).then(r => r.data.data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['appliances'] }),
  });
};

export const useRejectAppliance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appliancesApi.reject(id).then(r => r.data.data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['appliances'] }),
  });
};
