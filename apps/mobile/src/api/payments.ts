import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export const paymentsApi = {
  submit: (payload: { billId: string; amount: number; proofImageUrl?: string }) => apiClient.post('/payments', payload),
  list: (params?: Record<string, string>) => apiClient.get('/payments', { params }),
  listMine: () => apiClient.get('/payments/me'),
  get: (id: string) => apiClient.get(`/payments/${id}`),
  approve: (id: string) => apiClient.patch(`/payments/${id}/approve`),
  reject: (id: string, rejectionReason: string) => apiClient.patch(`/payments/${id}/reject`, { rejectionReason }),
  landlordRecord: (payload: { billId: string; tenantId: string; amount: number; notes?: string }) =>
    apiClient.post('/payments/landlord-record', payload),
};

export const usePayments = (params?: Record<string, string>) =>
  useQuery({ queryKey: ['payments', params], queryFn: () => paymentsApi.list(params).then(r => r.data.data) });

export const useMyPayments = () =>
  useQuery({ queryKey: ['my-payments'], queryFn: () => paymentsApi.listMine().then(r => r.data.data) });

export const usePaymentDetail = (id: string) =>
  useQuery({ queryKey: ['payment', id], queryFn: () => paymentsApi.get(id).then(r => r.data.data), enabled: Boolean(id) });

export const useSubmitPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { billId: string; amount: number; proofImageUrl?: string }) =>
      paymentsApi.submit(payload).then(r => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['my-bills'] });
      void qc.invalidateQueries({ queryKey: ['my-payments'] });
    },
  });
};

export const useApprovePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentsApi.approve(id).then(r => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['payments'] });
      void qc.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};

export const useRejectPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
      paymentsApi.reject(id, rejectionReason).then(r => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['payments'] });
      void qc.invalidateQueries({ queryKey: ['bills'] });
    },
  });
};
