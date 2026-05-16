import { useMutation } from '@tanstack/react-query';
import { authApi, loginSchema, registerSchema } from '../api';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const loginMutation = useMutation({
    mutationFn: async (values: unknown) => {
      const payload = loginSchema.parse(values);
      const loginResponse = await authApi.login(payload);
      const accessToken = loginResponse.data.data.accessToken;
      const refreshToken = loginResponse.data.data.refreshToken;

      const meResponse = await authApi.me();
      await setSession({
        user: meResponse.data.data,
        accessToken,
        refreshToken,
      });
      return meResponse.data.data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (values: unknown) => {
      const payload = registerSchema.parse(values);
      const registerResponse = await authApi.register(payload);
      const accessToken = registerResponse.data.data.accessToken;
      const refreshToken = registerResponse.data.data.refreshToken;

      const meResponse = await authApi.me();
      await setSession({
        user: meResponse.data.data,
        accessToken,
        refreshToken,
      });
      return meResponse.data.data;
    },
  });

  const logout = async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    await authApi.logout(refreshToken);
    await clearSession();
  };

  return { loginMutation, registerMutation, logout };
};
