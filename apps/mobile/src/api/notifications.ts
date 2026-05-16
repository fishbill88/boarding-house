import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export const notificationsApi = {
  list: (params?: { page?: number; limit?: number }) => apiClient.get('/notifications', { params }),
  unreadCount: () => apiClient.get('/notifications/unread-count'),
  markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  markAllRead: () => apiClient.patch('/notifications/read-all'),
};

export const useNotifications = (params?: { page?: number; limit?: number }) =>
  useQuery({ queryKey: ['notifications', params], queryFn: () => notificationsApi.list(params).then(r => r.data.data) });

export const useUnreadCount = () =>
  useQuery({ queryKey: ['unread-count'], queryFn: () => notificationsApi.unreadCount().then(r => r.data.data) });

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id).then(r => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['notifications'] });
      void qc.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
};

export const useMarkAllRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead().then(r => r.data.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['notifications'] });
      void qc.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
};
