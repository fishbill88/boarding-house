import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { User } from '@bhaus/types';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  setSession: (params: { user: User; accessToken: string; refreshToken: string }) => Promise<void>;
  setUser: (user: User | null) => void;
  restoreSession: () => Promise<void>;
  clearSession: () => Promise<void>;
};

const ACCESS_TOKEN_KEY = 'bhaus_access_token';
const REFRESH_TOKEN_KEY = 'bhaus_refresh_token';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  hydrated: false,
  setSession: async ({ user, accessToken, refreshToken }) => {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);

    set({ user, accessToken, refreshToken, hydrated: true });
  },
  setUser: (user) => set({ user }),
  restoreSession: async () => {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    ]);

    set({ accessToken, refreshToken, hydrated: true });
  },
  clearSession: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);

    set({ user: null, accessToken: null, refreshToken: null, hydrated: true });
  },
}));
