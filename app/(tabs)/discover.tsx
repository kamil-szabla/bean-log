import { useState } from 'react';
import { FlatList, RefreshControl, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { useBeans } from '@/features/beans/api';
import { BeanCard } from '@/components/BeanCard';
import { SkeletonList } from '@/components/Skeleton';

export default function DiscoverScreen() {
  const [q, setQ] = useState('');
  const [process, setProcess] = useState('');
  const [origin, setOrigin] = useState('');
  const { data, isLoading, refetch, isRefetching } = useBeans({ q, process, origin });

  return (
    <Screen>
      <TextInput value={q} onChangeText={setQ} placeholder="Search beans" style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, marginVertical: 10 }} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput value={process} onChangeText={setProcess} placeholder="Process" style={{ flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 10 }} />
        <TextInput value={origin} onChangeText={setOrigin} placeholder="Origin" style={{ flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 10 }} />
      </View>
      {isLoading ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 40 }}
          renderItem={({ item }) => <BeanCard bean={item} onPress={() => router.push(`/bean/${item.id}`)} />}
          ListEmptyComponent={<Text style={{ marginTop: 30 }}>No beans found. Try different filters.</Text>}
        />
      )}
    </Screen>
  );
}
