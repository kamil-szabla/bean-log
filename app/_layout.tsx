import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="bean/[id]" options={{ headerShown: true, title: 'Bean' }} />
        <Stack.Screen name="log-brew" options={{ headerShown: true, title: 'Log Brew' }} />
        <Stack.Screen name="roaster/[id]" options={{ headerShown: true, title: 'Roaster' }} />
      </Stack>
    </QueryClientProvider>
  );
}
