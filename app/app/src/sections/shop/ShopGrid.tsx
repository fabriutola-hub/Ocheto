import { useState, useMemo, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Coffee,
  Shirt,
  ShoppingBag,
  ChevronDown,
  ArrowUpDown,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PRODUCTS } from '@/data';
import ProductCard from '@/shared/ProductCard';
import { cn } from '@/lib/utils';

type FilterKey = 'all' | 'beans' | 'merch';
type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

interface FilterDef {
  key: FilterKey;
  label: string;
  icon: LucideIcon;
  match?: string;
}

const FILTERS: FilterDef[] = [
  { key: 'all', label: 'Todos', icon: SlidersHorizontal },
  { key: 'beans', label: 'Granos', icon: Coffee, match: 'beans' },
  { key: 'merch', label: 'Merch', icon: Shirt, match: 'merch' },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Destacados' },
  { key: 'price-asc', label: 'Precio: menor a mayor' },
  { key: 'price-desc', label: 'Precio: mayor a menor' },
  { key: 'name', label: 'Nombre A–Z' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ShopGrid() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort] = useState<SortKey>('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  const handleSortKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') setSortOpen(false);
  };

  // Base collection: shop products (beans + merch)
  const baseProducts = useMemo(
    () => PRODUCTS.filter((p) => p.category === 'beans' || p.category === 'merch'),
    [],
  );

  // Filter
  const filtered = useMemo(() => {
    const f = FILTERS.find((x) => x.key === filter);
    if (!f || !f.match) return baseProducts;
    return baseProducts.filter((p) => p.category === f.match);
  }, [baseProducts, filter]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case 'price-asc':
        arr.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        arr.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        arr.sort((a, b) => a.name.localeCompare(b.name, 'es'));
        break;
      default:
        arr.sort((a, b) => {
          const score = (p: typeof a) =>
            (p.bestseller ? 2 : 0) + (p.new ? 1 : 0);
          return score(b) - score(a);
        });
    }
    return arr;
  }, [filtered, sort]);

  const activeFilter = FILTERS.find((f) => f.key === filter)!;
  const activeSort = SORT_OPTIONS.find((s) => s.key === sort)!;
  const currentSortLabel = activeSort.label;

  return (
    <section
      id="shop-grid"
      className="relative w-full bg-ocheto-cream-50 section-padding overflow-hidden"
    >
      {/* Subtle dots overlay */}
      <div
        aria-hidden
        className="absolute inset-0 dots-bg opacity-50 pointer-events-none"
      />
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute top-20 -left-32 w-[380px] h-[380px] rounded-full bg-ocheto-caramel-500/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-32 -right-32 w-[440px] h-[440px] rounded-full bg-ocheto-matcha-500/10 blur-3xl pointer-events-none"
      />

      <div className="relative container-ocheto">
        {/* ===== Section Header ===== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative max-w-3xl mx-auto text-center mb-12 sm:mb-14 lg:mb-16"
        >
          {/* Floating handwritten note */}
          <motion.span
            variants={headerVariants}
            className="absolute -top-2 right-2 sm:-top-4 sm:right-8 lg:right-16 font-caveat text-ocheto-gold-500 text-lg sm:text-xl lg:text-2xl rotate-[8deg] select-none pointer-events-none"
          >
            ¡elige el tuyo!
          </motion.span>

          <motion.span
            variants={headerVariants}
            className="inline-block font-inter text-xs sm:text-sm font-semibold uppercase tracking-[0.32em] text-ocheto-green-700 mb-4 sm:mb-5"
          >
            <span className="inline-block w-6 h-px bg-ocheto-green-700 align-middle mr-2" />
            Nuestra Colección
            <span className="inline-block w-6 h-px bg-ocheto-green-700 align-middle ml-2" />
          </motion.span>

          <motion.h2
            variants={headerVariants}
            className="font-fraunces italic font-medium text-ocheto-coffee-900 leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
          >
            Granos que cuentan{' '}
            <span className="relative inline-block">
              <span className="relative z-10">historias</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-ocheto-caramel-500/40 -z-0 rounded-sm"
              />
            </span>
            ,
            <br className="hidden sm:block" /> merch que vibra.
          </motion.h2>

          <motion.p
            variants={headerVariants}
            className="mt-5 sm:mt-6 font-inter text-base sm:text-lg text-ocheto-coffee-900/70 leading-relaxed max-w-xl mx-auto"
          >
            Cada producto tostado, seleccionado o diseñado con la misma
            filosofía:{' '}
            <em className="font-fraunces italic text-ocheto-coffee-900/90">
              calidad, origen y cariño
            </em>
            .
          </motion.p>
        </motion.div>

        {/* ===== Filter + Sort bar ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10"
        >
          {/* Filter pills */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar -mx-2 px-2 pb-1">
            {FILTERS.map((f) => {
              const Icon = f.icon;
              const isActive = filter === f.key;
              return (
                <motion.button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    'inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 border-2',
                    isActive
                      ? 'bg-ocheto-green-700 text-ocheto-cream-50 border-ocheto-green-700 shadow-md'
                      : 'bg-white text-ocheto-coffee-900 border-ocheto-cream-200 hover:border-ocheto-green-700/40 hover:text-ocheto-green-700',
                  )}
                  aria-pressed={isActive}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.4} />
                  {f.label}
                </motion.button>
              );
            })}
          </div>

          {/* Sort dropdown */}
          <div
            ref={sortRef}
            onKeyDown={handleSortKeyDown}
            className="relative flex items-center gap-2 self-end sm:self-auto"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-ocheto-coffee-700/60" strokeWidth={2.5} />
            <span className="hidden sm:inline-block text-xs uppercase tracking-[0.2em] font-semibold text-ocheto-coffee-700/60">
              Ordenar:
            </span>

            <div className="relative">
              <motion.button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white border-2 border-ocheto-cream-200 hover:border-ocheto-green-700/40 font-semibold text-xs sm:text-sm text-ocheto-coffee-900 transition-all duration-300 min-w-[180px] sm:min-w-[200px] justify-between"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                <span className="truncate">{currentSortLabel}</span>
                <motion.span
                  animate={{ rotate: sortOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {sortOpen && (
                  <>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden
                      onClick={() => setSortOpen(false)}
                      className="fixed inset-0 z-30 cursor-default"
                    />
                    <motion.ul
                      role="listbox"
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-2 z-40 w-56 rounded-2xl bg-white border border-ocheto-cream-200 shadow-2xl shadow-ocheto-green-900/15 overflow-hidden"
                    >
                      {SORT_OPTIONS.map((opt) => {
                        const isActive = sort === opt.key;
                        return (
                          <li key={opt.key} role="option" aria-selected={isActive}>
                            <button
                              type="button"
                              onClick={() => {
                                setSort(opt.key);
                                setSortOpen(false);
                              }}
                              className={cn(
                                'w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-medium transition-colors',
                                isActive
                                  ? 'bg-ocheto-green-700/10 text-ocheto-green-700'
                                  : 'text-ocheto-coffee-900 hover:bg-ocheto-cream-100',
                              )}
                            >
                              <span>{opt.label}</span>
                              {isActive && (
                                <Check
                                  className="w-4 h-4 text-ocheto-green-700"
                                  strokeWidth={3}
                                />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </motion.ul>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ===== Result count ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-between gap-3 mb-6 sm:mb-8"
        >
          <p className="text-xs sm:text-sm text-ocheto-coffee-700/70 font-medium">
            Mostrando{' '}
            <span className="font-bold text-ocheto-coffee-900">
              {sorted.length}
            </span>{' '}
            {sorted.length === 1 ? 'producto' : 'productos'}
            <span className="hidden sm:inline">
              {' '}en
              <span className="text-ocheto-green-700 font-semibold">
                {' '}
                {activeFilter.label}
              </span>
            </span>
          </p>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-ocheto-coffee-700/50">
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              Stock fresco
            </span>
          </div>
        </motion.div>

        {/* ===== Product Grid ===== */}
        <AnimatePresence mode="wait">
          {sorted.length > 0 ? (
            <motion.div
              key={`${filter}-${sort}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
            >
              {sorted.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="grid"
                  index={i}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center text-center py-16 sm:py-20"
            >
              <div className="w-16 h-16 rounded-full bg-ocheto-cream-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-ocheto-coffee-700/50" />
              </div>
              <p className="font-fraunces italic text-2xl text-ocheto-coffee-900 mb-2">
                Nada por acá todavía
              </p>
              <p className="text-sm text-ocheto-coffee-700/70 max-w-sm">
                Pronto sumaremos más productos a esta categoría. Vuelve pronto.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Bottom helper ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-16 flex flex-col items-center text-center"
        >
          <p className="font-caveat text-ocheto-caramel-500 text-lg sm:text-xl">
            hecho a mano · con cariño · cada mañana
          </p>
          <p className="mt-1 text-xs sm:text-sm text-ocheto-coffee-700/60 max-w-md">
            ¿No encuentras lo que buscas? Escríbenos por WhatsApp y te
            conseguimos tu café ideal.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
