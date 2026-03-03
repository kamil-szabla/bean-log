import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { colors } from '@/theme/colors';

type Props = TextInputProps & { label: string; error?: string };

export function Input({ label, error, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.muted} {...props} />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { color: colors.text, marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#fff', borderColor: colors.border, borderWidth: 1, borderRadius: 10, padding: 12, color: colors.text },
  error: { marginTop: 4, color: colors.danger },
});
