import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Alert, Button, Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { authSchema, AuthInput } from '@/lib/validators/auth';
import { supabase } from '@/lib/supabase';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthInput>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    const authCall = isSignUp
      ? supabase.auth.signUp({ email: values.email, password: values.password })
      : supabase.auth.signInWithPassword({ email: values.email, password: values.password });

    const { data, error } = await authCall;
    if (error) return Alert.alert('Auth error', error.message);

    if (isSignUp && data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, display_name: data.user.email?.split('@')[0] });
      Alert.alert('Success', 'Account created. Please sign in.');
      setIsSignUp(false);
      return;
    }

    router.replace('/(tabs)');
  });

  return (
    <Screen>
      <Text style={{ fontSize: 28, fontWeight: '700', marginVertical: 16 }}>BeanLog</Text>
      <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
        <Input label="Email" value={value} onChangeText={onChange} autoCapitalize="none" error={errors.email?.message} />
      )} />
      <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
        <Input label="Password" value={value} onChangeText={onChange} secureTextEntry error={errors.password?.message} />
      )} />
      <Button title={isSubmitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'} onPress={onSubmit} disabled={isSubmitting} />
      <Text onPress={() => setIsSignUp((v) => !v)} style={{ marginTop: 14 }}>
        {isSignUp ? 'Already have an account? Sign in' : 'New here? Create account'}
      </Text>
    </Screen>
  );
}
