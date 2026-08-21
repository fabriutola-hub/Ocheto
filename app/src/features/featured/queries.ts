import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { FeaturedProductRow, ProductRow } from '@/features/products/types';
import { toProduct } from '@/features/products/queries';

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_products')
        .select('*, products(*)')
        .eq('active', true)
        .order('position');
      if (error) throw error;
      return ((data ?? []) as Array<FeaturedProductRow & { products: ProductRow | null }>)
        .filter((row) => row.products !== null)
        .map((row) => toProduct(row.products as ProductRow));
    },
  });
}
