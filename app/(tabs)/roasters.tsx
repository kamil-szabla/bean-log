import { useState } from 'react';
import { Button, FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { useRoasters } from '@/features/roasters/api';

export default function RoastersScreen() {
  const [q, setQ] = useState('');
  const [nearMe, setNearMe] = useState(false);
  const query = useRoasters(q, nearMe);

  return (
    <Screen>
      <TextInput value={q} onChangeText={setQ} placeholder="Search roasters" style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, marginVertical: 10 }} />
      <Button title={nearMe ? 'Near me: on' : 'Near me: off'} onPress={() => setNearMe((v) => !v)} />
      <FlatList
        data={query.data}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={query.refetch} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/roaster/${item.id}`)} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, marginVertical: 6 }}>
            <Text style={{ fontWeight: '700' }}>{item.name}</Text>
            <Text>{item.city}, {item.country}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={{ marginTop: 30 }}><Text>No roasters found.</Text></View>}
      />
    </Screen>
  );
}
