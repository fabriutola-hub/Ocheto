import { useState, useEffect, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Plus, Flame, Leaf } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PRODUCTS } from '@/data';
import { useCart } from '@/context/CartContext';

const featuredProducts = [
  PRODUCTS.find((p) => p.slug === 'oso-misu'),
  PRODUCTS.find((p) => p.slug === 'frapuccino-ocheto'),
  PRODUCTS.find((p) => p.slug === 'latte-ocheto'),
].filter((p): p is (typeof PRODUCTS)[number] => p !== undefined);

type FeaturedProduct = (typeof featuredProducts)[number];

interface ProductTag {
  label: string;
  icon: LucideIcon;
  color: string;
  text: string;
}

function getProductTag(product: FeaturedProduct): ProductTag | null {
  if (product.bestseller) {
    return { label: 'BESTSELLER', icon: Flame, color: '#E8B923', text: '#1a1a1a' };
  }
  if (product.new) {
    return { label: 'NUEVO', icon: Sparkles, color: '#D4A574', text: '#1a1a1a' };
  }
  if (product.vegan) {
    return { label: 'VEGANO', icon: Leaf, color: '#2E7D32', text: '#FAF7F0' };
  }
  return null;
}

const productVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 400 : -400,
    rotate: direction > 0 ? 25 : -25,
    opacity: 0,
    scale: 0.7,
  }),
  center: { y: 0, rotate: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    y: direction > 0 ? -400 : 400,
    rotate: direction > 0 ? -25 : 25,
    opacity: 0,
    scale: 0.7,
  }),
};

const FLOATING_BEANS = [
  { top: '8%', left: '14%', size: 12, delay: 0, duration: 4.2, color: '#E8B923' },
  { top: '18%', right: '10%', size: 9, delay: 0.9, duration: 5.0, color: '#D4A574' },
  { bottom: '20%', left: '8%', size: 14, delay: 1.5, duration: 4.6, color: '#E8B923' },
  { bottom: '12%', right: '14%', size: 10, delay: 2.2, duration: 5.4, color: '#D4A574' },
  { top: '45%', left: '3%', size: 7, delay: 0.5, duration: 5.8, color: '#FAF7F0' },
  { top: '52%', right: '3%', size: 8, delay: 1.8, duration: 5.2, color: '#FAF7F0' },
];

export default function FeaturedProducts() {
  const [[currentIndex, direction], setCurrentIndex] = useState<[number, number]>([0, 1]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  const paginate = useCallback((newDirection: number) => {
    setCurrentIndex(([prev]) => {
      const next = (prev + newDirection + featuredProducts.length) % featuredProducts.length;
      return [next, newDirection];
    });
  }, []);

  const goTo = useCallback((idx: number) => {
    setCurrentIndex(([prev]) => {
      if (idx === prev) return [prev, 0];
      const dir = idx > prev ? 1 : -1;
      return [idx, dir];
    });
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => paginate(1), 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, paginate]);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1400);
    return () => clearTimeout(t);
  }, [justAdded]);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      paginate(-1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      paginate(1);
    }
  };

  const currentProduct = featuredProducts[currentIndex];
  const productTag = getProductTag(currentProduct);
  const noteList = currentProduct.notes ?? currentProduct.tags?.slice(0, 3) ?? [];

  const handleAddToCart = () => {
    addItem({ ...currentProduct, quantity: 1 });
    setJustAdded(true);
  };

  return (
    <section
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onFocus={() => setIsAutoPlaying(false)}
      onBlur={() => setIsAutoPlaying(true)}
      className="relative w-full min-h-screen overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ocheto-cream-50/40"
      aria-label="Productos destacados de Ocheto Coffee"
    >
      {/* ====== TORN EDGE (TOP) ====== */}
      <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none rotate-180">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C60 35 120 50 180 45C240 40 300 55 360 50C420 45 480 60 540 55C600 50 660 65 720 60C780 55 840 70 900 65C960 60 1020 75 1080 70C1140 65 1200 80 1260 75C1320 70 1380 85 1440 80V80H0V40Z"
            fill="hsl(var(--ocheto-cream-50))"
          />
          <path
            d="M0 55C60 50 120 65 180 60C240 55 300 70 360 65C420 60 480 75 540 70C600 65 660 80 720 75C780 70 840 85 900 80C960 75 1020 90 1080 85C1140 80 1200 95 1260 90C1320 85 1380 100 1440 95V80H0V55Z"
            fill="hsl(var(--ocheto-cream-50))"
          />
        </svg>
      </div>

      {/* ====== BACKGROUND WALLPAPER ====== */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/cafe-bolsa-montana.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>

      {/* ====== DARK GREEN GRADIENT OVERLAY ====== */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,36,14,0.93) 0%, rgba(14,52,24,0.88) 30%, rgba(18,66,30,0.86) 55%, rgba(10,42,18,0.94) 100%)',
        }}
      />

      {/* ====== WATERMARK "OCHETO" STACKED ====== */}
      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden">
        {(['OCHETO', 'OCHETO', 'OCHETO', 'OCHETO'] as const).map((text, i) => (
          <motion.span
            key={i}
            className="block italic font-black leading-[0.78] tracking-tighter text-center text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem]"
            style={{
              fontFamily: "'Fraunces', serif",
              color: '#FFFFFF',
            }}
            animate={{ opacity: [0.06, 0.1, 0.06] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          >
            {text}
          </motion.span>
        ))}
      </div>

      {/* ====== DOTTED BG OVERLAY ====== */}
      <div className="absolute inset-0 z-[3] dots-bg opacity-40 pointer-events-none" />

      {/* ====== HEADER ====== */}
      <div className="relative z-[10] pt-24 sm:pt-28 lg:pt-32 px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1440px] mx-auto">
          {/* Top row: eyebrow tag + counter badge */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-ocheto-gold-500" strokeWidth={2.5} />
              <span>NUESTROS FAVORITOS</span>
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocheto-cream-50/10 backdrop-blur-sm border border-white/15 text-white/85 text-xs sm:text-sm font-medium tabular-nums"
            >
              <span className="text-ocheto-gold-500 font-bold">{currentIndex + 1}</span>
              <span className="opacity-50">de</span>
              <span>{featuredProducts.length}</span>
              <span className="opacity-50 hidden sm:inline">productos</span>
            </motion.span>
          </div>

          {/* Title row: handwritten Caveat + Fraunces italic */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-end">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:col-span-5 text-white"
            >
              <p
                className="text-4xl sm:text-5xl md:text-6xl leading-[0.95] -rotate-3 origin-left"
                style={{ fontFamily: "'Caveat', cursive", fontWeight: 600 }}
              >
                ¿Cuál es tu
                <br />
                próximo <span className="text-ocheto-gold-500">antojo</span>?
              </p>
              <p className="mt-3 text-white/65 text-sm sm:text-base max-w-xs font-light">
                Bebidas, postres y los pequeños detalles que hacen especial cada momento.
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="md:col-span-7 text-white font-fraunces font-black italic uppercase tracking-tight md:text-right text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] leading-[0.85] drop-shadow-2xl"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Ocheto
              <br />
              <span className="text-ocheto-cream-50/95">Favoritos</span>
            </motion.h2>
          </div>
        </div>
      </div>

      {/* ====== MAIN CAROUSEL ====== */}
      <div className="relative z-[10] w-full flex flex-col items-center justify-center mt-8 sm:mt-12 lg:mt-14 pb-24 sm:pb-28">
        {/* Floating beans/particles around the carousel */}
        <div className="absolute inset-0 pointer-events-none">
          {FLOATING_BEANS.map((bean, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                top: bean.top,
                bottom: bean.bottom,
                left: bean.left,
                right: bean.right,
                width: bean.size,
                height: bean.size,
                backgroundColor: bean.color,
                boxShadow: `0 0 ${bean.size * 1.8}px ${bean.color}AA`,
              }}
              animate={{
                y: [0, -18, 0, -10, 0],
                x: [0, 6, 0, -6, 0],
                rotate: [0, 180, 360],
                opacity: [0.4, 0.9, 0.6, 0.9, 0.4],
              }}
              transition={{
                duration: bean.duration,
                delay: bean.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Product hero area */}
        <div className="relative w-[300px] h-[400px] sm:w-[380px] sm:h-[500px] md:w-[460px] md:h-[580px] flex items-center justify-center">
          {/* Radial glow halo behind product */}
          <motion.div
            key={`halo-${currentIndex}`}
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] md:w-[540px] md:h-[540px] rounded-full blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${currentProduct.color}99 0%, transparent 70%)`,
            }}
          />

          {/* Floating tag (BESTSELLER / NUEVO / VEGANO) */}
          <AnimatePresence mode="wait">
            {productTag && (
              <motion.div
                key={`tag-${currentIndex}`}
                layoutId="productTag"
                initial={{ opacity: 0, scale: 0.4, x: -40, y: 30, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: -8 }}
                exit={{ opacity: 0, scale: 0.4, x: 40, y: -30, rotate: 15 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="absolute top-2 right-2 sm:top-4 sm:-right-2 z-20 px-3 sm:px-4 py-1.5 rounded-full backdrop-blur-md text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] flex items-center gap-1.5"
                style={{
                  backgroundColor: productTag.color,
                  color: productTag.text,
                  boxShadow: `0 10px 30px ${productTag.color}80`,
                }}
              >
                <productTag.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />
                {productTag.label}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product image with slide animation */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={productVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: 'spring', stiffness: 280, damping: 28 },
                rotate: { type: 'spring', stiffness: 280, damping: 28 },
                opacity: { duration: 0.25 },
                scale: { type: 'spring', stiffness: 280, damping: 28 },
              }}
              className="absolute w-full flex items-center justify-center"
            >
              <motion.img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-[240px] sm:w-[320px] md:w-[400px] h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
                draggable={false}
                animate={{ y: [0, -14, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Product info */}
        <div className="mt-6 sm:mt-8 w-full max-w-2xl px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {/* Origin / category mini-meta */}
              {currentProduct.origin && (
                <p className="text-ocheto-gold-500 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold mb-2">
                  · {currentProduct.origin} ·
                </p>
              )}

              {/* Name */}
              <h3
                className="text-white font-black text-3xl sm:text-4xl md:text-5xl drop-shadow-lg leading-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {currentProduct.name}
              </h3>

              {/* Description */}
              <p className="text-white/75 text-sm sm:text-base mt-2.5 max-w-md mx-auto leading-relaxed">
                {currentProduct.description}
              </p>

              {/* Animated color bar */}
              <motion.div
                className="w-14 h-1 rounded-full mx-auto mt-4"
                style={{ backgroundColor: currentProduct.color }}
                layoutId="colorBar"
                transition={{ duration: 0.4 }}
              />

              {/* Note pills */}
              {noteList.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
                  {noteList.map((note) => (
                    <span
                      key={note}
                      className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/85 text-[11px] sm:text-xs font-medium"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              )}

              {/* Price + CTA */}
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-wider"
                  >
                    Desde
                  </span>
                  <span
                    className="text-white font-black text-3xl sm:text-4xl tabular-nums drop-shadow-lg"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    Bs {currentProduct.price}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAddToCart}
                  className="sheen relative inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-xl overflow-hidden min-w-[200px]"
                  style={{
                    backgroundColor: 'hsl(var(--ocheto-green-700))',
                    color: 'hsl(var(--ocheto-cream-50))',
                    boxShadow: '0 10px 30px hsla(var(--ocheto-green-700), 0.5)',
                  }}
                  aria-label={`Agregar ${currentProduct.name} al carrito`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {justAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-2"
                      >
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ocheto-gold-500 text-ocheto-coffee-900 text-xs font-black"
                        >
                          +1
                        </motion.span>
                        ¡Agregado!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" strokeWidth={3} />
                        Agregar al carrito
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation: arrows + dot indicators */}
        <div className="flex items-center justify-center gap-5 sm:gap-7 mt-8">
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/20 shadow-lg"
            aria-label="Producto anterior"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </motion.button>

          <div className="flex items-center gap-2">
            {featuredProducts.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-white w-9 sm:w-11 h-2.5 shadow-lg shadow-white/40'
                      : 'bg-white/35 w-2.5 h-2.5 hover:bg-white/60'
                  }`}
                  aria-label={`Ir al producto ${idx + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                />
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/20 shadow-lg"
            aria-label="Producto siguiente"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Thumbnails */}
        <div className="flex items-end justify-center gap-4 sm:gap-5 mt-8">
          {featuredProducts.map((product, idx) => {
            const isActive = idx === currentIndex;
            return (
              <motion.button
                key={product.id}
                onClick={() => goTo(idx)}
                className={`relative transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                aria-label={`Ver ${product.name}`}
              >
                <div
                  className={`relative rounded-2xl p-2.5 sm:p-3 transition-all duration-300 ${
                    isActive
                      ? 'bg-white/25 shadow-[0_0_30px_rgba(255,255,255,0.35)]'
                      : 'bg-white/5'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`h-14 sm:h-20 md:h-24 w-auto object-contain transition-all duration-300 ${
                      isActive ? 'drop-shadow-lg' : 'grayscale-[45%]'
                    }`}
                    draggable={false}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="thumbIndicator"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-1 bg-white rounded-full shadow"
                    />
                  )}
                </div>
                <span className="block mt-2 text-[10px] sm:text-xs text-white/70 text-center font-medium tracking-wide">
                  {product.name.split(' ')[0]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ====== TORN EDGE (BOTTOM) ====== */}
      <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C60 35 120 50 180 45C240 40 300 55 360 50C420 45 480 60 540 55C600 50 660 65 720 60C780 55 840 70 900 65C960 60 1020 75 1080 70C1140 65 1200 80 1260 75C1320 70 1380 85 1440 80V80H0V40Z"
            fill="hsl(var(--ocheto-cream-50))"
          />
          <path
            d="M0 55C60 50 120 65 180 60C240 55 300 70 360 65C420 60 480 75 540 70C600 65 660 80 720 75C780 70 840 85 900 80C960 75 1020 90 1080 85C1140 80 1200 95 1260 90C1320 85 1380 100 1440 95V80H0V55Z"
            fill="hsl(var(--ocheto-cream-50))"
          />
        </svg>
        <div className="w-full h-6 bg-ocheto-cream-50" />
      </div>
    </section>
  );
}
