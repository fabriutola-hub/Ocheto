import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { BranchMenuItemRow } from '@/features/products/types';

/** Mapeo slug de ruta -> branch_id (loc1 = menú compartido Oruro & Illampu). */
export function branchIdFromSlug(slug: string): string | undefined {
  if (slug === 'oruro' || slug === 'illampu') return 'loc1';
  if (slug === 'federico-suazo') return 'loc3';
  return undefined;
}

export function useBranchMenu(slug: string | undefined) {
  return useQuery({
    queryKey: ['branch-menu', slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const branchId = branchIdFromSlug(slug ?? '');
      if (!branchId) return null;
      const { data, error } = await supabase
        .from('branch_menus')
        .select('*')
        .eq('branch_id', branchId)
        .eq('active', true)
        .order('sort_order', { ascending: true })
        .order('item_name', { ascending: true });
      if (error) throw error;
      return data as BranchMenuItemRow[];
    },
  });
}

/** Todos los ítems (incluye inactivos) — solo admin. */
export function useAllBranchMenus() {
  return useQuery({
    queryKey: ['branch-menus', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branch_menus')
        .select('*')
        .order('branch_id')
        .order('sort_order', { ascending: true })
        .order('item_name', { ascending: true });
      if (error) throw error;
      return data as BranchMenuItemRow[];
    },
  });
}
