import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import {
  Coffee,
  Sparkles,
  Snowflake,
  ShoppingBag,
  Croissant,
  Heart,
  CupSoda,
  ArrowRight,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '@/data';

type CategoryKey =
  | 'cafe'
  | 'specialty'
  | 'sin_cafe'
  | 'frio'
  | 'panaderia'
  | 'especialidades'
  | 'beans';

const CATEGORY_ICONS: Record<CategoryKey, LucideIcon> = {
  cafe: Coffee,
  specialty: Sparkles,
  sin_cafe: CupSoda,
  frio: Snowflake,
  panaderia: Croissant,
  especialidades: Heart,
  beans: ShoppingBag,
};

const CATEGORY_IMAGES: Record<CategoryKey, string> = {
  cafe: '/assets/vaso-ocheto-full.png',
  specialty: '/assets/vaso-espresso-tirado.png',
  sin_cafe: '/assets/vaso-ocheto-full.png',
  frio: '/assets/frappe-frutilla.png',
  panaderia: '/assets/tazas-alfajor.jpg',
  especialidades: '/assets/tazas-alfajor.jpg',
  beans: '/assets/cafe-bolsa-montana.jpg',
};

const FEATURED_CATEGORIES: CategoryKey[] = [
  'cafe',
  'specialty',
  'sin_cafe',
  'frio',
  'panaderia',
  'especialidades',
  'beans',
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const featuredCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const smallCardVariants: Variants = {
  hidden: { opacity: 0, x: 40, y: 24 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

interface CategoryCardProps {
  id: CategoryKey;
  number: string;
  variant?: 'featured' | 'small';
  index: number;
}

function CategoryCard({ id, number, variant = 'small' }: CategoryCardProps) {
  const Icon = CATEGORY_ICONS[id];
  const image = CATEGORY_IMAGES[id];
  const category = CATEGORIES[id];
  const count = PRODUCTS.filter((p) => p.category === id).length;
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      variants={isFeatured ? featuredCardVariants : smallCardVariants}
      className={`group relative overflow-hidden rounded-3xl bg-ocheto-coffee-900 shadow-lg shadow-ocheto-green-900/10 ${
        isFeatured
          ? 'aspect-[3/4] lg:aspect-auto lg:h-full lg:row-span-2'
          : 'aspect-[4/3] sm:aspect-square'
      }`}
    >
      <Link
        to="/menu"
        aria-label={`Ver ${category.name} en el menú`}
        className="block w-full h-full"
      >
        {/* Background image with slow scale on hover */}
        <motion.img
          src={image}
          alt={category.name}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Gradient overlay — darkens bottom, brightens subtly on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-opacity duration-500 group-hover:from-black/70 group-hover:via-black/30" />

        {/* Subtle inner border on hover */}
        <div className="absolute inset-0 rounded-3xl ring-1 ring-white/0 transition-all duration-500 group-hover:ring-white/20" />

        {/* Big editorial number (background watermark) */}
        <span
          aria-hidden
          className={`absolute top-3 left-4 sm:top-4 sm:left-6 font-fraunces font-bold leading-none text-white/15 pointer-events-none select-none ${
            isFeatured ? 'text-7xl sm:text-8xl lg:text-[7.5rem]' : 'text-5xl sm:text-6xl'
          }`}
        >
          {number}
        </span>

        {/* Icon in circle (top-right) */}
        <motion.div
          className={`absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/25 text-white ${
            isFeatured ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10 sm:w-12 sm:h-12'
          }`}
          whileHover={{ rotate: 15, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <Icon
            strokeWidth={1.6}
            className={isFeatured ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'}
          />
        </motion.div>

        {/* Content block at bottom */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7 flex flex-col gap-1.5">
          <motion.span
            className={`font-inter font-medium uppercase tracking-[0.18em] text-ocheto-gold-500 ${
              isFeatured ? 'text-[10px] sm:text-xs' : 'text-[9px] sm:text-[11px]'
            }`}
            initial={{ y: 0 }}
            whileHover={{ y: -2 }}
          >
            {number} · {isFeatured ? 'Nuestra esencia' : 'Categoría'}
          </motion.span>

          <motion.h3
            className={`font-fraunces italic font-medium text-white leading-[1.05] ${
              isFeatured
                ? 'text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl'
                : 'text-xl sm:text-2xl lg:text-[1.65rem] xl:text-3xl'
            }`}
            initial={{ y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {category.name}
          </motion.h3>

          <p
            className={`text-white/75 font-light leading-snug max-w-[28ch] ${
              isFeatured ? 'text-sm sm:text-[0.95rem] mt-1' : 'text-xs sm:text-sm mt-0.5'
            }`}
          >
            {category.description}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 text-white/65 font-inter ${
                isFeatured ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs'
              }`}
            >
              <span className="w-1 h-1 rounded-full bg-ocheto-gold-500" />
              {count} {count === 1 ? 'producto' : 'productos'}
            </span>

            {/* Hover-revealed arrow */}
            <motion.span
              aria-hidden
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-ocheto-coffee-900 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
            >
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.2} />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function MenuCategories() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px 0px' });

  const [featuredId, ...restIds] = FEATURED_CATEGORIES;
  const featuredIndex = FEATURED_CATEGORIES.indexOf(featuredId);

  return (
    <section
      ref={sectionRef}
      id="menu-categories"
      className="relative w-full overflow-hidden bg-ocheto-cream-50 section-padding"
    >
      {/* Subtle dots overlay */}
      <div
        aria-hidden
        className="absolute inset-0 dots-bg opacity-60 pointer-events-none"
      />

      {/* Decorative gradient blobs */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-ocheto-caramel-500/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-32 w-[480px] h-[480px] rounded-full bg-ocheto-matcha-500/10 blur-3xl pointer-events-none"
      />

      <div className="relative container-ocheto">
        {/* ===== Header ===== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative max-w-3xl mx-auto text-center mb-14 sm:mb-16 lg:mb-20"
        >
          {/* Floating handwritten note */}
          <motion.span
            variants={headerVariants}
            className="absolute -top-2 right-2 sm:-top-4 sm:right-8 lg:right-16 font-caveat text-ocheto-gold-500 text-lg sm:text-xl lg:text-2xl rotate-[8deg] select-none pointer-events-none"
            style={{ textShadow: '0 1px 0 rgba(232, 185, 35, 0.15)' }}
          >
            ¡Pide tu favorito!
          </motion.span>

          <motion.span
            variants={headerVariants}
            className="inline-block font-inter text-xs sm:text-sm font-semibold uppercase tracking-[0.32em] text-ocheto-green-700 mb-4 sm:mb-5"
          >
            <span className="inline-block w-6 h-px bg-ocheto-green-700 align-middle mr-2" />
            Explora nuestro menú
            <span className="inline-block w-6 h-px bg-ocheto-green-700 align-middle ml-2" />
          </motion.span>

          <motion.h2
            variants={headerVariants}
            className="font-fraunces italic font-medium text-ocheto-coffee-900 leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
          >
            Cada categoría,{' '}
            <span className="relative inline-block">
              <span className="relative z-10">un universo</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-ocheto-caramel-500/40 -z-0 rounded-sm"
              />
            </span>
            <br className="hidden sm:block" /> de sabor.
          </motion.h2>

          <motion.p
            variants={headerVariants}
            className="mt-5 sm:mt-6 font-inter text-base sm:text-lg text-ocheto-coffee-900/70 leading-relaxed max-w-xl mx-auto"
          >
            Desde nuestro café de especialidad hasta los alfajores de cacao y las{' '}
            <em className="font-fraunces italic text-ocheto-coffee-900/90">creaciones</em>{' '}
            del barista. Ingredientes de calidad, en cada preparación.
          </motion.p>
        </motion.div>

        {/* ===== Bento Grid ===== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4 sm:gap-5 lg:gap-6 lg:auto-rows-[minmax(260px,1fr)]"
        >
          {/* Featured (tall) card — Café */}
          <CategoryCard
            id={featuredId}
            number={`0${featuredIndex + 1}`}
            variant="featured"
            index={featuredIndex}
          />

          {/* Four small cards */}
          {restIds.map((id, i) => (
            <CategoryCard
              key={id}
              id={id}
              number={`0${featuredIndex + 1 + i + 1}`}
              variant="small"
              index={featuredIndex + 1 + i}
            />
          ))}
        </motion.div>

        {/* ===== "Ver todo el menú" inline link ===== */}
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-10 sm:mt-12 flex justify-center"
        >
          <Link
            to="/menu"
            className="group inline-flex items-center gap-3 font-inter text-sm sm:text-base font-medium text-ocheto-coffee-900 hover:text-ocheto-green-700 transition-colors duration-300"
          >
            <span className="relative">
              Ver todo el menú
              <span className="absolute left-0 -bottom-1 h-px w-full bg-ocheto-coffee-900/30 transition-all duration-500 group-hover:bg-ocheto-green-700 group-hover:w-full" />
            </span>
            <motion.span
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-ocheto-coffee-900/30 text-ocheto-coffee-900 group-hover:border-ocheto-green-700 group-hover:text-ocheto-green-700 group-hover:bg-ocheto-green-700/5 transition-all duration-300"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </motion.span>
          </Link>
        </motion.div>

        {/* ===== Bottom CTA ===== */}
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-12 sm:mt-16 lg:mt-20 flex flex-col items-center text-center"
        >
          <Link to="/menu" className="btn-primary group text-sm sm:text-base px-7 sm:px-9 py-3.5 sm:py-4">
            <span>Ver Menú Completo</span>
            <motion.span
              className="inline-flex"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.2} />
            </motion.span>
          </Link>

          <p className="mt-4 sm:mt-5 font-caveat text-ocheto-caramel-500 text-lg sm:text-xl">
            hecho con cariño · cada mañana
          </p>
        </motion.div>
      </div>
    </section>
  );
}
