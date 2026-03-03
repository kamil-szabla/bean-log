import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuthSession } from '@/features/auth/useAuth';

export default function Index() {
  const { session, loading } = useAuthSession();
  if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator /></View>;
  return <Redirect href={session ? '/(tabs)' : '/auth'} />;
}
