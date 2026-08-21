import { EASE } from '@/shared/motion';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Coffee, Search } from 'lucide-react';
import ProductCard from '@/shared/ProductCard';
import { CATEGORIES } from '@/data';
import { useProducts } from '@/features/products/queries';
import { useMemo } from 'react';
import type { MenuCategoryFilter } from '@/features/menu';

interface MenuGridProps {
  activeCategory: MenuCategoryFilter;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const emptyVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

function getCategoryLabel(filter: MenuCategoryFilter): string {
  if (filter === 'all') return 'toda la carta';
  if (filter === 'beans') return CATEGORIES.beans.name.toLowerCase();
  return CATEGORIES[filter].name.toLowerCase();
}

export default function MenuGrid({ activeCategory }: MenuGridProps) {
  const { data: allProducts } = useProducts();
  const products = useMemo(() => {
    if (!allProducts) return [];
    if (activeCategory === 'all') return allProducts;
    if (activeCategory === 'beans') {
      return allProducts.filter((p) => p.category === 'beans' || p.category === 'merch');
    }
    return allProducts.filter((p) => p.category === activeCategory);
  }, [allProducts, activeCategory]);
  const categoryLabel = getCategoryLabel(activeCategory);
  const hasProducts = products.length > 0;

  return (
    <section
      className="relative w-full bg-ocheto-cream-50 overflow-hidden"
      aria-label="Listado de productos"
    >
      {/* Subtle decorative blobs */}
      <div
        aria-hidden
        className="absolute top-40 -left-32 w-[420px] h-[420px] rounded-full bg-ocheto-caramel-500/8 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute top-[60%] -right-32 w-[460px] h-[460px] rounded-full bg-ocheto-matcha-500/8 blur-3xl pointer-events-none"
      />

      <div className="relative container-ocheto py-14 sm:py-16 lg:py-20">
        {/* ===== Header ===== */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12 pb-5 sm:pb-6 border-b border-ocheto-coffee-900/10"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <span className="block h-px w-6 bg-ocheto-green-700" />
              <span className="font-inter text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-ocheto-green-700">
                Nuestra selección
              </span>
            </div>
            <h3
              className="font-fraunces italic font-medium text-ocheto-coffee-900 leading-[1.05] tracking-tight"
              style={{
                fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
                fontVariationSettings: '"opsz" 96, "SOFT" 40',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={`label-${activeCategory}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="inline-block"
                >
                  {categoryLabel}
                </motion.span>
              </AnimatePresence>
            </h3>
          </div>

          <div className="flex items-baseline gap-2 shrink-0">
            <AnimatePresence mode="wait">
              <motion.span
                key={`count-${activeCategory}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="font-fraunces font-black tabular-nums text-ocheto-green-700 leading-none"
                style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}
              >
                {products.length}
              </motion.span>
            </AnimatePresence>
            <span className="text-ocheto-coffee-700/70 text-sm sm:text-base font-medium">
              {products.length === 1 ? 'producto' : 'productos'}
            </span>
            <span className="text-ocheto-coffee-700/45 text-sm sm:text-base font-light hidden sm:inline">
              · en esta categoría
            </span>
          </div>
        </motion.div>

        {/* ===== Grid / Empty state ===== */}
        <AnimatePresence mode="wait">
          {hasProducts ? (
            <motion.div
              key={`grid-${activeCategory}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7"
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="grid"
                  index={index}
                  showAddToCart
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`empty-${activeCategory}`}
              variants={emptyVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="relative max-w-md mx-auto text-center py-16 sm:py-20 px-6 rounded-3xl border border-dashed border-ocheto-coffee-900/15 bg-white/40"
            >
              <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-5 sm:mb-6 rounded-full bg-ocheto-cream-100">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-ocheto-green-700"
                >
                  <Search className="w-7 h-7 sm:w-9 sm:h-9" strokeWidth={1.8} />
                </motion.div>
                <span
                  aria-hidden
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-ocheto-gold-500 flex items-center justify-center shadow-md"
                >
                  <Coffee className="w-3.5 h-3.5 text-ocheto-coffee-900" strokeWidth={2.5} />
                </span>
              </div>
              <h4 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-2xl sm:text-3xl leading-tight">
                Nada por aquí… todavía.
              </h4>
              <p className="mt-3 text-ocheto-coffee-700/70 text-sm sm:text-base leading-relaxed">
                Estamos preparando nuevas creaciones para esta categoría.
                Vuelve pronto, o explora otras opciones.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
