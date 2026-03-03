import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, ScrollView } from 'react-native';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { supabase } from '@/lib/supabase';
import { BrewLogInput, brewLogSchema } from '@/lib/validators/brewLog';

export default function LogBrewScreen() {
  const { beanId } = useLocalSearchParams<{ beanId: string }>();
  const { control, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm<BrewLogInput>({
    resolver: zodResolver(brewLogSchema),
    defaultValues: { method: 'espresso', grinder_setting: '', notes: '' },
  });

  const method = watch('method');

  const onSubmit = handleSubmit(async (values) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return Alert.alert('Please sign in');
    const { error } = await supabase.from('brew_logs').insert({
      ...values,
      bean_id: beanId,
      user_id: user.user.id,
      brewed_at: new Date().toISOString(),
      yield_g: method === 'espresso' ? values.yield_g : null,
    });
    if (error) return Alert.alert('Unable to save log', error.message);

    await supabase.from('reviews').insert({
      user_id: user.user.id,
      bean_id: beanId,
      rating: values.rating,
      notes: values.notes,
    });

    Alert.alert('Saved', 'Brew log added.');
    router.back();
  });

  return (
    <Screen>
      <ScrollView>
        <Controller control={control} name="method" render={({ field: { onChange, value } }) => <Input label="Method" value={value} onChangeText={onChange} error={errors.method?.message} />} />
        <Controller control={control} name="grinder_setting" render={({ field: { onChange, value } }) => <Input label="Grinder setting" value={value} onChangeText={onChange} error={errors.grinder_setting?.message} />} />
        <Controller control={control} name="dose_g" render={({ field: { onChange, value } }) => <Input label="Dose (g)" value={value?.toString()} keyboardType="decimal-pad" onChangeText={onChange} error={errors.dose_g?.message} />} />
        {method === 'espresso' && (
          <Controller control={control} name="yield_g" render={({ field: { onChange, value } }) => <Input label="Yield (g)" value={value?.toString()} keyboardType="decimal-pad" onChangeText={onChange} error={errors.yield_g?.message} />} />
        )}
        <Controller control={control} name="water_temp_c" render={({ field: { onChange, value } }) => <Input label="Water temp (°C)" value={value?.toString()} keyboardType="decimal-pad" onChangeText={onChange} error={errors.water_temp_c?.message} />} />
        <Controller control={control} name="brew_time_s" render={({ field: { onChange, value } }) => <Input label="Brew time (s)" value={value?.toString()} keyboardType="number-pad" onChangeText={onChange} error={errors.brew_time_s?.message} />} />
        <Controller control={control} name="rating" render={({ field: { onChange, value } }) => <Input label="Rating (1-5)" value={value?.toString()} keyboardType="number-pad" onChangeText={onChange} error={errors.rating?.message} />} />
        <Controller control={control} name="notes" render={({ field: { onChange, value } }) => <Input label="Notes" value={value} onChangeText={onChange} error={errors.notes?.message} multiline />} />
        <Button title={isSubmitting ? 'Saving...' : 'Save brew log'} onPress={onSubmit} disabled={isSubmitting} />
      </ScrollView>
    </Screen>
  );
}
