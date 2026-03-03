import { Button, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { Screen } from '@/components/Screen';
import { useAuthSession } from '@/features/auth/useAuth';
import { useProfileStats } from '@/features/profile/api';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { session } = useAuthSession();
  const stats = useProfileStats(session?.user.id);

  if (!session) return <Redirect href="/auth" />;

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>{session.user.email}</Text>
      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, marginVertical: 12 }}>
        <Text>Total logs: {stats.data?.totalLogs ?? 0}</Text>
        <Text>Average rating: {stats.data?.avgRating?.toFixed(1) ?? '0.0'}</Text>
        <Text>Favourite origin: {stats.data?.favouriteOrigin ?? 'N/A'}</Text>
      </View>
      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </Screen>
  );
}
