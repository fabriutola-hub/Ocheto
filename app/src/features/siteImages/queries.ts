import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type CategoryKey = 'cafe' | 'matcha' | 'specialty' | 'frio' | 'beans';

export const FALLBACK_CATEGORY_IMAGES: Record<CategoryKey, string> = {
  cafe: '/assets/vaso-cafe.webp',
  matcha: '/assets/vaso-verde.webp',
  specialty: '/assets/drink-complete-v2.webp',
  frio: '/assets/vaso-rojo.webp',
  beans: '/assets/grain.webp',
};

export const FALLBACK_GALLERY = [
  '/assets/wallaper_1.webp',
  '/assets/wallaper_2.webp',
  '/assets/drink-complete-v2.webp',
  '/assets/vaso-cafe.webp',
  '/assets/vaso-verde.webp',
  '/assets/vaso-rojo.webp',
  '/assets/cup-with-shadow.webp',
  '/assets/grain.webp',
] as const;

export const FALLBACK_LOCATION_IMAGES: Record<string, string> = {
  loc1: '/assets/wallaper_1.webp',
  loc2: '/assets/wallaper_2.webp',
  loc3: '/assets/wallaper_1.webp',
};

export function resolveSiteImageUrl(raw: string): string {
  if (!raw) return raw;
  if (raw.startsWith('http') || raw.startsWith('/assets') || raw.startsWith('/')) return raw;
  const path = raw.startsWith('site-images/') ? raw.replace('site-images/', '') : raw;
  const { data } = supabase.storage.from('site-images').getPublicUrl(path);
  return data.publicUrl || raw;
}

export function useCategoryImages() {
  return useQuery({
    queryKey: ['category-images'],
    queryFn: async () => {
      const { data, error } = await supabase.from('category_images').select('*');
      if (error) throw error;
      const map: Record<string, string> = { ...FALLBACK_CATEGORY_IMAGES };
      for (const row of (data as { category: string; image_url: string }[]) ?? []) {
        map[row.category] = resolveSiteImageUrl(row.image_url);
      }
      return map as Record<CategoryKey, string>;
    },
  });
}

export function useGalleryImages() {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('active', true)
        .order('position');
      if (error) throw error;
      if (!data || data.length === 0) return FALLBACK_GALLERY.map((src) => resolveSiteImageUrl(src));
      return (data as { image_url: string }[]).map((r) => resolveSiteImageUrl(r.image_url));
    },
  });
}

export function useGalleryRows() {
  return useQuery({
    queryKey: ['gallery-rows'],
    queryFn: async () => {
      const { data, error } = await supabase.from('gallery_images').select('*').order('position');
      if (error) throw error;
      return data as { id: string; position: number; image_url: string; active: boolean }[];
    },
  });
}

export function useLocationImages() {
  return useQuery({
    queryKey: ['location-images'],
    queryFn: async () => {
      const { data, error } = await supabase.from('location_images').select('*');
      if (error) throw error;
      const map: Record<string, string> = { ...FALLBACK_LOCATION_IMAGES };
      for (const row of (data as { branch_id: string; image_url: string }[]) ?? []) {
        map[row.branch_id] = resolveSiteImageUrl(row.image_url);
      }
      return map;
    },
  });
}

export function useCategoryRows() {
  return useQuery({
    queryKey: ['category-rows'],
    queryFn: async () => {
      const { data, error } = await supabase.from('category_images').select('*').order('category');
      if (error) throw error;
      return data as { category: string; image_url: string }[];
    },
  });
}

export function useLocationRows() {
  return useQuery({
    queryKey: ['location-rows'],
    queryFn: async () => {
      const { data, error } = await supabase.from('location_images').select('*').order('branch_id');
      if (error) throw error;
      return data as { branch_id: string; image_url: string }[];
    },
  });
}
