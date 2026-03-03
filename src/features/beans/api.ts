import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useBeans(filters: { q?: string; process?: string; origin?: string; method?: string }) {
  return useQuery({
    queryKey: ['beans', filters],
    queryFn: async () => {
      let query = supabase.from('beans_with_rating').select('*, roasters(name)').order('created_at', { ascending: false });
      if (filters.process) query = query.eq('process', filters.process);
      if (filters.origin) query = query.eq('origin_country', filters.origin);
      const { data, error } = await query;
      if (error) throw error;
      if (!filters.q) return data ?? [];
      return (data ?? []).filter((b) => b.name.toLowerCase().includes(filters.q!.toLowerCase()));
    },
  });
}

export function useBeanDetail(beanId: string) {
  return useQuery({
    enabled: !!beanId,
    queryKey: ['bean', beanId],
    queryFn: async () => {
      const [{ data: bean, error: beanError }, { data: reviews, error: reviewError }] = await Promise.all([
        supabase.from('beans_with_rating').select('*, roasters(*)').eq('id', beanId).single(),
        supabase.from('reviews').select('*, profiles(display_name,username)').eq('bean_id', beanId).order('created_at', { ascending: false }).limit(20),
      ]);
      if (beanError) throw beanError;
      if (reviewError) throw reviewError;
      return { bean, reviews: reviews ?? [] };
    },
  });
}
