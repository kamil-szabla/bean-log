import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { supabase } from '@/lib/supabase';

function distance(aLat: number, aLng: number, bLat: number, bLng: number) {
  return Math.hypot(aLat - bLat, aLng - bLng);
}

export function useRoasters(queryText: string, nearMe: boolean) {
  return useQuery({
    queryKey: ['roasters', queryText, nearMe],
    queryFn: async () => {
      const { data, error } = await supabase.from('roasters').select('*').order('name');
      if (error) throw error;
      let list = (data ?? []).filter((r) => r.name.toLowerCase().includes(queryText.toLowerCase()));

      if (nearMe) {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (perm.status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          list = list.sort((a, b) => {
            if (!a.lat || !a.lng) return 1;
            if (!b.lat || !b.lng) return -1;
            return distance(location.coords.latitude, location.coords.longitude, a.lat, a.lng) - distance(location.coords.latitude, location.coords.longitude, b.lat, b.lng);
          });
        }
      }

      return list;
    },
  });
}
