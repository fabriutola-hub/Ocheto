import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MenuHero from '@/sections/menu/MenuHero';
import MenuCategories from '@/sections/menu/MenuCategories';
import MenuGrid from '@/sections/menu/MenuGrid';
import MenuCTA from '@/sections/menu/MenuCTA';
import { PRODUCTS } from '@/data';
import type { Product } from '@/types';

export type MenuCategoryFilter =
  | 'all'
  | 'cafe'
  | 'specialty'
  | 'sin_cafe'
  | 'frio'
  | 'panaderia'
  | 'especialidades'
  | 'beans';

export function getFilteredProducts(filter: MenuCategoryFilter): Product[] {
  if (filter === 'all') return PRODUCTS;
  if (filter === 'beans') {
    return PRODUCTS.filter((p) => p.category === 'beans' || p.category === 'merch');
  }
  return PRODUCTS.filter((p) => p.category === filter);
}

export function getFeaturedProduct(filter: MenuCategoryFilter): Product {
  const list = getFilteredProducts(filter);
  return (
    list.find((p) => p.bestseller) ?? list[0] ?? PRODUCTS[0]
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryFilter>('all');
  const featuredProduct = useMemo(
    () => getFeaturedProduct(activeCategory),
    [activeCategory],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="pt-24 min-h-screen bg-ocheto-cream-50"
    >
      <MenuHero />
      <MenuCategories
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        featuredProduct={featuredProduct}
      />
      <MenuGrid activeCategory={activeCategory} />
      <MenuCTA />
    </motion.div>
  );
}
