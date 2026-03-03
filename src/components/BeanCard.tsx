import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

type BeanCardProps = {
  bean: any;
  onPress: () => void;
};

export function BeanCard({ bean, onPress }: BeanCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.name}>{bean.name}</Text>
      <Text style={styles.meta}>{bean.roasters?.name ?? 'Unknown roaster'}</Text>
      <Text style={styles.meta}>{bean.origin_country} · {bean.process}</Text>
      <Text style={styles.rating}>⭐ {Number(bean.avg_rating || 0).toFixed(1)} ({bean.reviews_count || 0})</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { color: colors.muted, marginTop: 4 },
  rating: { marginTop: 6, color: colors.accent, fontWeight: '600' },
});
