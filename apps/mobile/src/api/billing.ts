import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export const billingApi = {
  generateBills: (payload: { billingMonth: number; billingYear: number; electricityAmount?: number; waterAmount?: number }) =>
    apiClient.post('/billing/generate', payload),
  listBills: (params?: Record<string, string | number>) => apiClient.get('/billing/bills', { params }),
  listMyBills: (params?: Record<string, string | number>) => apiClient.get('/billing/bills/me', { params }),
  getBill: (id: string) => apiClient.get(`/billing/bills/${id}`),
  getSummary: (billingMonth: number, billingYear: number) =>
    apiClient.get('/billing/summary', { params: { billingMonth, billingYear } }),
  getMySummary: () => apiClient.get('/billing/summary/me'),
  markOverdue: (id: string) => apiClient.patch(`/billing/bills/${id}/mark-overdue`),
  deleteBill: (id: string) => apiClient.delete(`/billing/bills/${id}`),
};

export const useBills = (params?: Record<string, string | number>) =>
  useQuery({ queryKey: ['bills', params], queryFn: () => billingApi.listBills(params).then(r => r.data.data) });

export const useMyBills = (params?: Record<string, string | number>) =>
  useQuery({ queryKey: ['my-bills', params], queryFn: () => billingApi.listMyBills(params).then(r => r.data.data) });

export const useBillDetail = (id: string) =>
  useQuery({ queryKey: ['bill', id], queryFn: () => billingApi.getBill(id).then(r => r.data.data), enabled: Boolean(id) });

export const useBillingSummary = (billingMonth: number, billingYear: number) =>
  useQuery({
    queryKey: ['billing-summary', billingMonth, billingYear],
    queryFn: () => billingApi.getSummary(billingMonth, billingYear).then(r => r.data.data),
    enabled: Boolean(billingMonth && billingYear),
  });

export const useMyBillingSummary = () =>
  useQuery({ queryKey: ['my-billing-summary'], queryFn: () => billingApi.getMySummary().then(r => r.data.data) });

export const useGenerateBills = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { billingMonth: number; billingYear: number; electricityAmount?: number; waterAmount?: number }) =>
      billingApi.generateBills(payload).then(r => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['bills'] });
      void qc.invalidateQueries({ queryKey: ['billing-summary'] });
    },
  });
};
