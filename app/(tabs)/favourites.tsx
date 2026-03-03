import { FlatList, RefreshControl, Text } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { supabase } from '@/lib/supabase';
import { BeanCard } from '@/components/BeanCard';

export default function FavouritesScreen() {
  const query = useQuery({
    queryKey: ['favourites'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];
      const { data, error } = await supabase
        .from('favourites')
        .select('bean_id, beans_with_rating(*, roasters(name))')
        .eq('user_id', user.user.id);
      if (error) throw error;
      return (data ?? []).map((row: any) => row.beans_with_rating).filter(Boolean);
    },
  });

  return (
    <Screen>
      <FlatList
        data={query.data}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={query.refetch} />}
        renderItem={({ item }) => <BeanCard bean={item} onPress={() => router.push(`/bean/${item.id}`)} />}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>No favourites yet. Save beans from Discover.</Text>}
      />
    </Screen>
  );
}
