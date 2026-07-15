import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '@/data';

const AUTOPLAY_MS = 5000;
const DRAG_THRESHOLD = 80;

const formatDate = (iso: string): string => {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ];
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const wrapIndex = (i: number, len: number): number =>
  ((i % len) + len) % len;

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
      opacity: { duration: 0.35 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.92,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
      opacity: { duration: 0.25 },
    },
  }),
};

const sideCardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    scale: 0.85,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 280,
      damping: 32,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    scale: 0.85,
    transition: {
      type: 'spring' as const,
      stiffness: 280,
      damping: 32,
    },
  }),
};

const textFadeVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
};

function Stars({ rating, size = 16, gap = 'gap-0.5' }: { rating: number; size?: number; gap?: string }) {
  return (
    <div className={`flex items-center ${gap}`} aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            delay: i * 0.05,
            type: 'spring',
            stiffness: 380,
            damping: 18,
          }}
        >
          <Star
            size={size}
            className={
              i < rating
                ? 'fill-ocheto-gold-500 text-ocheto-gold-500'
                : 'fill-ocheto-cream-200 text-ocheto-cream-200'
            }
            strokeWidth={1.5}
          />
        </motion.span>
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  testimonial: (typeof TESTIMONIALS)[number];
  isActive: boolean;
}

function TestimonialCard({ testimonial, isActive }: TestimonialCardProps) {
  return (
    <div
      className={[
        'flex flex-col h-full bg-white rounded-2xl shadow-md',
        'p-6 sm:p-8 md:p-10',
        'transition-[border,box-shadow] duration-500',
        isActive
          ? 'border border-ocheto-green-700/20 shadow-[0_30px_80px_-20px_rgba(27,94,32,0.25)]'
          : 'border border-ocheto-cream-200 shadow-md',
      ].join(' ')}
    >
      {/* Quote icon */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div
          className={[
            'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center',
            'bg-ocheto-green-700/10 text-ocheto-green-700',
            'transition-transform duration-500',
            isActive ? 'scale-100 rotate-0' : 'scale-90 -rotate-6',
          ].join(' ')}
        >
          <Quote size={20} className="sm:hidden" strokeWidth={2.25} fill="currentColor" />
          <Quote size={24} className="hidden sm:block" strokeWidth={2.25} fill="currentColor" />
        </div>
        <Stars rating={testimonial.rating} size={isActive ? 16 : 14} />
      </div>

      {/* Text */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={testimonial.id + '-text'}
            variants={textFadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={[
              'text-ocheto-coffee-900 leading-relaxed',
              isActive
                ? 'text-base sm:text-lg md:text-xl font-medium'
                : 'text-sm sm:text-base font-normal line-clamp-4',
            ].join(' ')}
          >
            “{testimonial.text}”
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {/* Author */}
      <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-ocheto-cream-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={[
              'relative shrink-0 rounded-full overflow-hidden ring-2 ring-offset-2',
              isActive ? 'ring-ocheto-green-700/40 ring-offset-white' : 'ring-ocheto-cream-200 ring-offset-white',
              'transition-all duration-500',
              isActive ? 'w-11 h-11 sm:w-12 sm:h-12' : 'w-9 h-9 sm:w-10 sm:h-10',
            ].join(' ')}
          >
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div
              className="font-bold text-ocheto-coffee-900 truncate"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {testimonial.name}
            </div>
            <div className="text-xs sm:text-sm text-ocheto-coffee-700/70 truncate">
              {testimonial.role}
            </div>
          </div>
        </div>
        <div className="text-[10px] sm:text-xs text-ocheto-coffee-700/50 text-right shrink-0">
          {formatDate(testimonial.date)}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 1]);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = TESTIMONIALS.length;
  const active = TESTIMONIALS[index];
  const prev = TESTIMONIALS[wrapIndex(index - 1, total)];
  const next = TESTIMONIALS[wrapIndex(index + 1, total)];

  const paginate = useCallback(
    (dir: number) => {
      setIndex(([i]) => [wrapIndex(i + dir, total), dir]);
    },
    [total],
  );

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, paginate]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_THRESHOLD || velocity < -500) {
      paginate(1);
    } else if (offset > DRAG_THRESHOLD || velocity > 500) {
      paginate(-1);
    }
  };

  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden bg-ocheto-cream-50"
    >
      {/* ===== Decorative: warm gradient + grain ===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 20% 0%, hsla(124, 50%, 50%, 0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, hsla(42, 85%, 55%, 0.10) 0%, transparent 60%)',
        }}
      />

      {/* ===== Big background quote mark ===== */}
      <div
        aria-hidden
        className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 select-none pointer-events-none leading-none"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        <span className="block text-[14rem] sm:text-[22rem] md:text-[30rem] lg:text-[36rem] text-ocheto-green-700/[0.05] font-black">
          “
        </span>
      </div>

      {/* ===== Floating handwritten "¡Gracias!" ===== */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, rotate: -8, y: 10 }}
        whileInView={{ opacity: 1, rotate: -8, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        className="absolute top-24 sm:top-28 right-6 sm:right-12 lg:right-24 hidden sm:block pointer-events-none z-10"
      >
        <motion.span
          animate={{ rotate: [-8, -4, -8], y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="block text-3xl sm:text-4xl lg:text-5xl text-ocheto-gold-500"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          ¡Gracias!
        </motion.span>
        <svg
          aria-hidden
          className="absolute -bottom-4 right-2 text-ocheto-caramel-500"
          width="60"
          height="22"
          viewBox="0 0 60 22"
          fill="none"
        >
          <path
            d="M2 18 C 14 4, 30 4, 44 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M50 12 L 58 16 L 52 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* ===== Floating small coffee bean (decorative) ===== */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -14, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-32 left-6 sm:left-12 lg:left-20 hidden md:block pointer-events-none opacity-40"
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <ellipse cx="24" cy="24" rx="14" ry="20" transform="rotate(-25 24 24)" fill="hsl(var(--ocheto-coffee-700))" />
          <path
            d="M24 6 C 20 16, 20 32, 24 42"
            stroke="hsl(var(--ocheto-cream-50))"
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(-25 24 24)"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* ===== Content ===== */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-xs sm:text-sm font-bold tracking-[0.22em] text-ocheto-green-700 uppercase mb-4 sm:mb-5"
          >
            Lo que dicen nuestros clientes
          </motion.span>

          <h2
            className="font-bold italic text-ocheto-coffee-900 leading-[1.05] tracking-tight max-w-4xl mx-auto text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              fontFamily: "'Fraunces', serif",
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
            }}
          >
            2,000+ personas{' '}
            <span className="relative inline-block">
              ya vibran
              <svg
                aria-hidden
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full text-ocheto-caramel-500"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 C 80 2, 160 2, 298 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>{' '}
            con nosotros.
          </h2>

          {/* Rating summary */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-7 sm:mt-9 inline-flex items-center gap-3 sm:gap-4 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white/70 backdrop-blur-sm border border-ocheto-cream-200 shadow-sm"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="fill-ocheto-gold-500 text-ocheto-gold-500"
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <div className="h-4 w-px bg-ocheto-cream-200" />
            <span
              className="text-base sm:text-lg font-bold text-ocheto-coffee-900"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              4.9
            </span>
            <span className="text-xs sm:text-sm text-ocheto-coffee-700/70">
              · Google Reviews
            </span>
          </motion.div>
        </motion.div>

        {/* ===== Carousel ===== */}
        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Carousel stage */}
          <div className="relative h-[520px] sm:h-[480px] md:h-[460px] lg:h-[440px]">
            {/* === DESKTOP: side cards === */}
            <div className="hidden md:block">
              {/* Prev card (left peeking) */}
              <AnimatePresence custom={direction} initial={false} mode="popLayout">
                <motion.div
                  key={`prev-${prev.id}`}
                  custom={direction}
                  variants={sideCardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-[42%] lg:w-[38%] xl:w-[34%] pointer-events-none"
                >
                  <TestimonialCard testimonial={prev} isActive={false} />
                </motion.div>
              </AnimatePresence>

              {/* Next card (right peeking) */}
              <AnimatePresence custom={direction} initial={false} mode="popLayout">
                <motion.div
                  key={`next-${next.id}`}
                  custom={direction}
                  variants={sideCardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute top-1/2 -translate-y-1/2 right-0 w-[42%] lg:w-[38%] xl:w-[34%] pointer-events-none"
                >
                  <TestimonialCard testimonial={next} isActive={false} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* === Active card (centered, always on top) === */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={handleDragEnd}
                className="w-full max-w-[640px] md:w-[58%] lg:w-[52%] xl:w-[46%] px-2 cursor-grab active:cursor-grabbing"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <AnimatePresence custom={direction} initial={false} mode="wait">
                  <motion.div
                    key={`active-${active.id}`}
                    custom={direction}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <TestimonialCard testimonial={active} isActive={true} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* ===== Navigation: arrows + dots ===== */}
          <div className="mt-10 sm:mt-12 flex items-center justify-center gap-5 sm:gap-7">
            <motion.button
              type="button"
              onClick={() => paginate(-1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Testimonio anterior"
              className="group relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/70 backdrop-blur-md border border-ocheto-cream-200 shadow-md flex items-center justify-center text-ocheto-coffee-900 hover:bg-ocheto-green-700 hover:text-white hover:border-ocheto-green-700 transition-colors duration-300"
            >
              <ChevronLeft size={20} className="sm:hidden" strokeWidth={2.25} />
              <ChevronLeft size={26} className="hidden sm:block" strokeWidth={2.25} />
            </motion.button>

            <div className="flex items-center gap-2 sm:gap-2.5" role="tablist">
              {TESTIMONIALS.map((t, i) => {
                const isActive = i === index;
                return (
                  <motion.button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Ir al testimonio ${i + 1}`}
                    onClick={() => {
                      const diff = i - index;
                      if (diff !== 0) paginate(diff > 0 ? 1 : -1);
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className={[
                      'relative rounded-full transition-all duration-500',
                      isActive
                        ? 'bg-ocheto-green-700 w-9 sm:w-12 h-2.5 sm:h-3 shadow-md shadow-ocheto-green-700/30'
                        : 'bg-ocheto-coffee-900/20 w-2.5 sm:w-3 h-2.5 sm:h-3 hover:bg-ocheto-coffee-900/40',
                    ].join(' ')}
                  />
                );
              })}
            </div>

            <motion.button
              type="button"
              onClick={() => paginate(1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Siguiente testimonio"
              className="group relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/70 backdrop-blur-md border border-ocheto-cream-200 shadow-md flex items-center justify-center text-ocheto-coffee-900 hover:bg-ocheto-green-700 hover:text-white hover:border-ocheto-green-700 transition-colors duration-300"
            >
              <ChevronRight size={20} className="sm:hidden" strokeWidth={2.25} />
              <ChevronRight size={26} className="hidden sm:block" strokeWidth={2.25} />
            </motion.button>
          </div>

          {/* Progress bar (autoplay indicator) */}
          <div className="mt-6 max-w-[200px] mx-auto h-[2px] bg-ocheto-cream-200 rounded-full overflow-hidden">
            <motion.div
              key={index + (isPaused ? '-p' : '-a')}
              initial={{ width: '0%' }}
              animate={{ width: isPaused ? '0%' : '100%' }}
              transition={{
                duration: isPaused ? 0 : AUTOPLAY_MS / 1000,
                ease: 'linear',
              }}
              className="h-full bg-ocheto-green-700/70"
            />
          </div>
        </div>
      </div>

      {/* Bottom torn-paper edge */}
      <div
        aria-hidden
        className="absolute -bottom-px left-0 right-0 h-12 sm:h-16 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent, hsl(var(--ocheto-cream-100) / 0.6))',
        }}
      />
    </section>
  );
}
