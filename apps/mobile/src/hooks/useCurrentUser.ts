import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';

export const useCurrentUser = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await authApi.me();
      setUser(response.data.data);
      return response.data.data;
    },
    enabled: Boolean(accessToken),
  });
};
