import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ProductRow } from './types';

function resolveImageUrl(raw: string): string {
  if (!raw) return '/assets/cup-with-shadow.webp';
  if (raw.startsWith('http') || raw.startsWith('/assets') || raw.startsWith('/')) return raw;
  // Soporta relativo "product-images/<file>" o solo "<file>"
  const path = raw.startsWith('product-images/') ? raw.replace('product-images/', '') : raw;
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl || raw;
}

/** Producto fila de Supabase -> Product de dominio (precios en centavos). */
export function toProduct(row: ProductRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    longDescription: row.long_description ?? undefined,
    price: row.price,
    image: resolveImageUrl(row.image_url),
    color: row.color,
    tags: row.tags ?? [],
    origin: row.origin ?? undefined,
    roast: row.roast ?? undefined,
    notes: row.notes ?? undefined,
    caffeine: row.caffeine ?? undefined,
    temperature: row.temperature ?? undefined,
    bestseller: row.bestseller,
    new: row.new,
    vegan: row.vegan,
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name');
      if (error) throw error;
      return (data as ProductRow[]).map(toProduct);
    },
  });
}

/** Todos los productos (incluye inactivos) — solo admin. Devuelve filas crudas. */
export function useAllProducts() {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as ProductRow[];
    },
  });
}
