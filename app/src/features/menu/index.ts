import type { Product } from '@/types';

export type MenuCategoryFilter =
  | 'all'
  | 'cafe'
  | 'matcha'
  | 'specialty'
  | 'frio'
  | 'beans';

export function getFilteredProducts(
  products: Product[],
  filter: MenuCategoryFilter,
): Product[] {
  if (filter === 'all') return products;
  if (filter === 'beans') {
    return products.filter((p) => p.category === 'beans' || p.category === 'merch');
  }
  return products.filter((p) => p.category === filter);
}

export function getFeaturedProduct(
  products: Product[],
  filter: MenuCategoryFilter,
): Product | undefined {
  const list = getFilteredProducts(products, filter);
  return list.find((p) => p.bestseller) ?? list[0];
}
