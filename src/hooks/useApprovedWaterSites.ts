import { useEffect, useState } from 'react';
import type { WaterSite } from '../components/map/siteData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function useApprovedWaterSites() {
  const [sites, setSites] = useState<WaterSite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      const { data, error } = await supabase
        .from('water_sites')
        .select('id, site_name, site_type, latitude, longitude, story, photo_url')
        .eq('status', 'approved')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (cancelled) return;
      if (!error && data) {
        const mapped: WaterSite[] = data
          .filter((row) => row.latitude != null && row.longitude != null)
          .map((row) => ({
            id: row.id,
            name: row.site_name,
            coords: [row.latitude as number, row.longitude as number] as [number, number],
            type: row.site_type,
            story: row.story ?? undefined,
            photoUrl: row.photo_url ?? undefined,
          }));
        setSites(mapped);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { sites, loading };
}
