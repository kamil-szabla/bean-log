import { useLocalSearchParams, router } from 'expo-router';
import { Alert, Button, FlatList, Text, View } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { useBeanDetail } from '@/features/beans/api';
import { supabase } from '@/lib/supabase';

export default function BeanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useBeanDetail(id);

  const favouriteQuery = useQuery({
    queryKey: ['favourite', id],
    enabled: !!id,
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;
      const { data } = await supabase.from('favourites').select('*').eq('bean_id', id).eq('user_id', user.user.id).maybeSingle();
      return data;
    },
  });

  const toggleFavourite = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not signed in');
      if (favouriteQuery.data) {
        const { error } = await supabase.from('favourites').delete().eq('bean_id', id).eq('user_id', user.user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('favourites').insert({ bean_id: id, user_id: user.user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => favouriteQuery.refetch(),
    onError: (error: Error) => Alert.alert('Favourite error', error.message),
  });

  if (isLoading) return <Screen><Text>Loading...</Text></Screen>;
  if (!data) return <Screen><Text>Bean not found.</Text></Screen>;

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>{data.bean.name}</Text>
      <Text>{data.bean.roasters?.name} · {data.bean.origin_country}</Text>
      <Text>{data.bean.process} · {data.bean.varietal}</Text>
      <Text style={{ marginVertical: 8 }}>⭐ {Number(data.bean.avg_rating).toFixed(1)} ({data.bean.reviews_count} reviews)</Text>
      <Button title={favouriteQuery.data ? 'Unsave favourite' : 'Save to favourites'} onPress={() => toggleFavourite.mutate()} />
      <View style={{ height: 8 }} />
      <Button title="Log this brew" onPress={() => router.push({ pathname: '/log-brew', params: { beanId: id } })} />

      <Text style={{ marginTop: 16, marginBottom: 8, fontWeight: '700' }}>Recent reviews</Text>
      <FlatList
        data={data.reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff', padding: 10, marginBottom: 8, borderRadius: 10 }}>
            <Text>{item.profiles?.display_name ?? 'Coffee fan'} · ⭐ {item.rating}</Text>
            <Text>{item.notes || 'No notes'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No reviews yet. Be the first to log one.</Text>}
      />
    </Screen>
  );
}
