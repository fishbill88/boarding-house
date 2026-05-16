import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../src/store/authStore';
import { useCurrentUser } from '../src/hooks/useCurrentUser';

const queryClient = new QueryClient();

function NavigationGate() {
  const router = useRouter();
  const segments = useSegments();
  const { user, accessToken, hydrated, restoreSession } = useAuthStore();

  useCurrentUser();

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (!hydrated) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!accessToken && !inAuthGroup) {
      router.replace('/(auth)/welcome');
      return;
    }

    if (accessToken && user?.role === 'TENANT' && segments[0] !== '(tenant)') {
      router.replace('/(tenant)');
      return;
    }

    if (accessToken && user?.role === 'LANDLORD' && segments[0] !== '(landlord)') {
      router.replace('/(landlord)');
    }
  }, [accessToken, hydrated, router, segments, user?.role]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationGate />
    </QueryClientProvider>
  );
}
