import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useProfileStats(userId?: string) {
  return useQuery({
    enabled: !!userId,
    queryKey: ['profile-stats', userId],
    queryFn: async () => {
      const [{ count }, { data: avg }, { data: origins }] = await Promise.all([
        supabase.from('brew_logs').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('brew_logs').select('rating').eq('user_id', userId),
        supabase.from('beans').select('origin_country, brew_logs!inner(user_id)').eq('brew_logs.user_id', userId),
      ]);
      const ratings = (avg ?? []).map((r) => r.rating).filter(Boolean) as number[];
      const originCount = new Map<string, number>();
      (origins ?? []).forEach((o) => {
        const key = o.origin_country ?? 'Unknown';
        originCount.set(key, (originCount.get(key) ?? 0) + 1);
      });
      const favouriteOrigin = [...originCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
      return {
        totalLogs: count ?? 0,
        avgRating: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
        favouriteOrigin,
      };
    },
  });
}
