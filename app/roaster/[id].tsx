import { useLocalSearchParams, router } from 'expo-router';
import { FlatList, Linking, Text, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { supabase } from '@/lib/supabase';

export default function RoasterDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    enabled: !!id,
    queryKey: ['roaster', id],
    queryFn: async () => {
      const [{ data: roaster, error: roasterError }, { data: beans, error: beanError }] = await Promise.all([
        supabase.from('roasters').select('*').eq('id', id).single(),
        supabase.from('beans_with_rating').select('*').eq('roaster_id', id),
      ]);
      if (roasterError) throw roasterError;
      if (beanError) throw beanError;
      return { roaster, beans: beans ?? [] };
    },
  });

  if (query.isLoading) return <Screen><Text>Loading...</Text></Screen>;
  if (!query.data) return <Screen><Text>Roaster not found.</Text></Screen>;

  return (
    <Screen>
      <Text style={{ fontWeight: '700', fontSize: 22 }}>{query.data.roaster.name}</Text>
      <Text>{query.data.roaster.address}</Text>
      <Text onPress={() => query.data?.roaster.website && Linking.openURL(query.data.roaster.website)} style={{ color: '#8b5e3b', marginBottom: 10 }}>
        {query.data.roaster.website}
      </Text>
      <FlatList
        data={query.data.beans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/bean/${item.id}`)} style={{ backgroundColor: '#fff', padding: 10, marginBottom: 8, borderRadius: 10 }}>
            <Text>{item.name}</Text>
            <Text>{item.origin_country} · ⭐ {Number(item.avg_rating).toFixed(1)}</Text>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
