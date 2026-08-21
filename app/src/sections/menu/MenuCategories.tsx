import { EASE } from '@/shared/motion';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Coffee,
  Leaf,
  Sparkles,
  Snowflake,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';
import ProductCard from '@/shared/ProductCard';
import { CATEGORIES } from '@/data';
import type { Product } from '@/types';
import type { MenuCategoryFilter } from '@/features/menu';

interface MenuCategoriesProps {
  activeCategory: MenuCategoryFilter;
  onCategoryChange: (category: MenuCategoryFilter) => void;
  featuredProduct: Product;
}

interface PillConfig {
  key: MenuCategoryFilter;
  label: string;
  description: string;
  Icon: LucideIcon;
}

const PILLS: PillConfig[] = [
  {
    key: 'all',
    label: 'Todos',
    description: 'Nuestra carta completa',
    Icon: Sparkles,
  },
  {
    key: 'cafe',
    label: 'Café',
    description: CATEGORIES.cafe.description,
    Icon: Coffee,
  },
  {
    key: 'matcha',
    label: 'Matcha',
    description: CATEGORIES.matcha.description,
    Icon: Leaf,
  },
  {
    key: 'specialty',
    label: 'Specialty',
    description: CATEGORIES.specialty.description,
    Icon: Sparkles,
  },
  {
    key: 'frio',
    label: 'Bebidas Frías',
    description: CATEGORIES.frio.description,
    Icon: Snowflake,
  },
  {
    key: 'beans',
    label: 'Granos & Merch',
    description: CATEGORIES.beans.description,
    Icon: ShoppingBag,
  },
];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

const pillContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

const featuredContainer: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export default function MenuCategories({
  activeCategory,
  onCategoryChange,
  featuredProduct,
}: MenuCategoriesProps) {
  const activePill = PILLS.find((p) => p.key === activeCategory) ?? PILLS[0];

  return (
    <section
      className="relative w-full bg-ocheto-cream-50"
      aria-label="Filtros del menú"
    >
      {/* ===== Sticky filter bar ===== */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="sticky top-24 z-30 bg-ocheto-cream-50/85 backdrop-blur-xl border-b border-ocheto-coffee-900/8 shadow-[0_8px_32px_-12px_rgba(42,24,16,0.08)]"
      >
        <div className="container-ocheto py-4 sm:py-5">
          <motion.div
            variants={pillContainer}
            initial="hidden"
            animate="show"
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar -mx-2 px-2 pb-1"
          >
            {PILLS.map((pill) => {
              const Icon = pill.Icon;
              const isActive = pill.key === activeCategory;
              return (
                <motion.button
                  key={pill.key}
                  variants={pillVariants}
                  type="button"
                  onClick={() => onCategoryChange(pill.key)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  aria-pressed={isActive}
                  aria-label={`Filtrar por ${pill.label}`}
                  className={[
                    'group relative shrink-0 inline-flex items-center gap-1.5 sm:gap-2 rounded-full font-semibold transition-all duration-300',
                    'px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap',
                    isActive
                      ? 'text-ocheto-cream-50 shadow-[0_8px_24px_-8px_hsla(var(--ocheto-green-900),0.55)]'
                      : 'text-ocheto-coffee-900 hover:text-ocheto-green-700',
                  ].join(' ')}
                  style={
                    isActive
                      ? {
                          background:
                            'linear-gradient(135deg, hsl(var(--ocheto-green-700)) 0%, hsl(var(--ocheto-green-600)) 100%)',
                        }
                      : {
                          background: 'transparent',
                          boxShadow: 'inset 0 0 0 1.5px hsl(var(--ocheto-coffee-900) / 0.15)',
                        }
                  }
                >
                  {!isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          'hsl(var(--ocheto-green-700) / 0.08)',
                        boxShadow: 'inset 0 0 0 1.5px hsl(var(--ocheto-green-700) / 0.35)',
                      }}
                    />
                  )}
                  <Icon
                    className="relative w-3.5 h-3.5 sm:w-4 sm:h-4"
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                  <span className="relative tracking-tight">{pill.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="pill-glow"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{
                        background:
                          'radial-gradient(circle at 50% 50%, hsl(var(--ocheto-gold-500) / 0.35) 0%, transparent 70%)',
                        filter: 'blur(8px)',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* ===== Section intro + featured product ===== */}
      <div className="relative container-ocheto pt-14 sm:pt-16 lg:pt-20 pb-4 sm:pb-6">
        {/* Section header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-2xl mx-auto text-center mb-10 sm:mb-12 lg:mb-14"
        >
          <span className="inline-flex items-center gap-2 font-inter text-[10px] sm:text-xs font-bold uppercase tracking-[0.32em] text-ocheto-green-700 mb-3 sm:mb-4">
            <span className="block h-px w-6 bg-ocheto-green-700/60" />
            Menú completo
            <span className="block h-px w-6 bg-ocheto-green-700/60" />
          </span>
          <h2
            className="font-fraunces italic font-medium text-ocheto-coffee-900 leading-[1.05] tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
              fontVariationSettings: '"opsz" 96, "SOFT" 40',
            }}
          >
            Elige tu{' '}
            <span className="relative inline-block">
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-2.5 sm:h-3 -z-0 rounded-sm"
                style={{ background: 'hsl(var(--ocheto-caramel-500) / 0.45)' }}
              />
              <span className="relative z-10">universo</span>
            </span>
            .
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mt-3 sm:mt-4 text-ocheto-coffee-900/65 text-sm sm:text-base leading-relaxed"
            >
              {activePill.description}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* ===== Featured product card ===== */}
        <motion.div
          variants={featuredContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Floating decorative label */}
          <div className="absolute -top-3 sm:-top-4 left-4 sm:left-8 z-10 pointer-events-none">
            <motion.span
              animate={{ rotate: [-3, 1, -3], y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ocheto-gold-500 text-ocheto-coffee-900 font-bold text-[10px] sm:text-xs uppercase tracking-[0.18em] shadow-lg"
            >
              <Sparkles className="w-3 h-3" strokeWidth={2.5} />
              Lo más pedido
            </motion.span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={featuredProduct.id}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.97 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <ProductCard product={featuredProduct} variant="featured" />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
