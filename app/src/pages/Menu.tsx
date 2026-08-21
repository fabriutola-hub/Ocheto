import { EASE } from '@/shared/motion';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MenuHero from '@/sections/menu/MenuHero';
import MenuCategories from '@/sections/menu/MenuCategories';
import MenuGrid from '@/sections/menu/MenuGrid';
import MenuCTA from '@/sections/menu/MenuCTA';
import { getFeaturedProduct, type MenuCategoryFilter } from '@/features/menu';
import { useProducts } from '@/features/products/queries';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryFilter>('all');
  const { data: products } = useProducts();
  const featuredProduct = useMemo(
    () => getFeaturedProduct(products ?? [], activeCategory),
    [products, activeCategory],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="pt-24 min-h-screen bg-ocheto-cream-50"
    >
      <MenuHero />
      {featuredProduct && (
        <MenuCategories
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          featuredProduct={featuredProduct}
        />
      )}
      <MenuGrid activeCategory={activeCategory} />
      <MenuCTA />
    </motion.div>
  );
}
