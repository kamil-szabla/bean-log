import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';

export function SkeletonList() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={styles.item} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  item: { height: 90, borderRadius: 12, marginBottom: 10, backgroundColor: colors.border },
});
