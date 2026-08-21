import { EASE } from '@/shared/motion';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight, MapPin, Coffee, Sparkles } from 'lucide-react';

const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -50 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 1, ease: EASE },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const driftA: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [-12, 12, -12],
    rotate: [-4, 6, -4],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
  },
};

const driftB: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [10, -14, 10],
    rotate: [5, -5, 5],
    transition: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.7 },
  },
};

const titleWords = ['¿Listo', 'para', 'probar', 'el', 'café', 'que', 'te', 'define?'];

export default function AboutCTA() {
  return (
    <section
      id="about-cta"
      className="relative w-full overflow-hidden text-ocheto-cream-50 section-padding"
    >
      {/* ===== DEEP GREEN BACKGROUND ===== */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, hsl(var(--ocheto-green-950)) 0%, hsl(var(--ocheto-green-900)) 50%, hsl(var(--ocheto-green-950)) 100%)',
        }}
      />

      {/* ===== GRAIN TEXTURE ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] opacity-[0.15] mix-blend-overlay pointer-events-none"
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="ctaGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#ctaGrain)" />
        </svg>
      </div>

      {/* ===== INNER GLOW CORNERS ===== */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-gold-500) / 0.22) 0%, transparent 60%)',
          transform: 'translate(35%, -35%)',
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 w-[480px] h-[480px] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-caramel-500) / 0.18) 0%, transparent 60%)',
          transform: 'translate(-30%, 30%)',
        }}
      />

      {/* ===== DECORATIVE GRID ===== */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--ocheto-cream-50)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ocheto-cream-50)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ===== FLOATING DECORATIVE ELEMENTS ===== */}
      <motion.div
        variants={driftA}
        initial="initial"
        animate="animate"
        aria-hidden
        className="absolute top-[18%] left-[6%] sm:left-[12%] z-[2] pointer-events-none hidden md:block opacity-70"
      >
        <svg width="56" height="76" viewBox="0 0 48 64" fill="none">
          <ellipse cx="24" cy="32" rx="20" ry="28" fill="hsl(var(--ocheto-gold-500))" />
          <path
            d="M24 6 C 18 18, 18 46, 24 58"
            stroke="hsl(var(--ocheto-green-950))"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      <motion.div
        variants={driftB}
        initial="initial"
        animate="animate"
        aria-hidden
        className="absolute bottom-[20%] right-[8%] sm:right-[14%] z-[2] pointer-events-none hidden md:block opacity-70"
      >
        <svg width="44" height="60" viewBox="0 0 48 64" fill="none">
          <ellipse cx="24" cy="32" rx="20" ry="28" fill="hsl(var(--ocheto-caramel-500))" />
          <path
            d="M24 6 C 18 18, 18 46, 24 58"
            stroke="hsl(var(--ocheto-green-950))"
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(15 24 32)"
          />
        </svg>
      </motion.div>

      {/* Big watermark word */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span
          className="select-none whitespace-nowrap leading-none"
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(245, 240, 232, 0.04)',
            fontSize: 'clamp(7rem, 26vw, 22rem)',
            letterSpacing: '-0.04em',
          }}
        >
          OCHETO
        </span>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 container-ocheto">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 sm:mb-10"
            style={{
              background: 'hsl(var(--ocheto-gold-500) / 0.12)',
              border: '1px solid hsl(var(--ocheto-gold-500) / 0.4)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-ocheto-gold-500" strokeWidth={2.5} />
            <span className="text-[10px] sm:text-xs tracking-[0.28em] font-bold uppercase text-ocheto-gold-500">
              Te esperamos
            </span>
            <Coffee className="w-3.5 h-3.5 text-ocheto-gold-500" strokeWidth={2.5} />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={headlineContainer}
            className="font-fraunces italic font-light text-ocheto-cream-50 leading-[0.98] tracking-[-0.02em]"
            style={{
              fontSize: 'clamp(2.6rem, 8vw, 6.5rem)',
              fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
              perspective: '1000px',
              textShadow: '0 4px 30px rgba(0,0,0,0.35)',
            }}
          >
            {titleWords.map((word, i) => {
              const isHighlight = word === 'café' || word === 'define?';
              return (
                <motion.span
                  key={word + i}
                  variants={wordVariants}
                  className="inline-block mr-[0.2em]"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {isHighlight ? (
                    <span className="text-ocheto-gold-500">{word}</span>
                  ) : (
                    word
                  )}
                </motion.span>
              );
            })}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ delay: 0.6 }}
            className="mt-7 sm:mt-9 text-base sm:text-lg lg:text-xl text-ocheto-cream-100/80 leading-relaxed max-w-2xl mx-auto"
          >
            Dos barras en La Paz, los mismos granos de los Yungas y el mismo cariño de siempre.
            Pasa, te servimos una{' '}
            <span className="font-caveat text-2xl sm:text-3xl text-ocheto-caramel-500 align-middle">
              bienvenida
            </span>
            .
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            className="my-9 sm:my-11 mx-auto h-px w-24 sm:w-32 origin-center"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, hsl(var(--ocheto-gold-500)) 50%, transparent 100%)',
            }}
          />

          {/* ===== CTA BUTTONS ===== */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            {/* Primary CTA — Visítanos */}
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="relative group"
            >
              <div
                aria-hidden
                className="absolute -inset-1 rounded-full opacity-60 group-hover:opacity-100 blur-md transition-opacity duration-500"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--ocheto-gold-500)) 0%, hsl(var(--ocheto-caramel-500)) 100%)',
                }}
              />
              <Link
                to="/contacto"
                className="relative inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-4 sm:py-4.5 rounded-full font-bold text-sm sm:text-base whitespace-nowrap overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--ocheto-gold-500)) 0%, hsl(var(--ocheto-caramel-500)) 100%)',
                  color: 'hsl(var(--ocheto-coffee-900))',
                  boxShadow:
                    '0 10px 28px hsl(var(--ocheto-gold-500) / 0.4), inset 0 1px 0 hsl(var(--ocheto-cream-50) / 0.3)',
                }}
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                <span>Visítanos</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
            </motion.div>

            {/* Secondary CTA — Ver Menú */}
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <Link
                to="/menu"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full px-7 sm:px-9 py-4 sm:py-4.5 font-bold text-sm sm:text-base whitespace-nowrap border-2 transition-all duration-300"
                style={{
                  color: 'hsl(var(--ocheto-cream-50))',
                  borderColor: 'hsl(var(--ocheto-cream-50) / 0.45)',
                  backgroundColor: 'hsla(var(--ocheto-cream-50), 0.05)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Coffee className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                <span>Ver Menú</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
            </motion.div>
          </motion.div>

          {/* ===== META ROW ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-3 text-[11px] sm:text-xs text-white/65 font-medium"
          >
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="block w-1.5 h-1.5 rounded-full bg-ocheto-green-400 animate-pulse" />
              Abierto hoy
            </span>
            <span aria-hidden className="hidden sm:inline-block h-3 w-px bg-white/20" />
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-ocheto-gold-500" strokeWidth={2.5} />
              Sopocachi · Calacoto
            </span>
            <span aria-hidden className="hidden sm:inline-block h-3 w-px bg-white/20" />
            <span className="inline-flex items-center gap-2">
              <Coffee className="w-3.5 h-3.5 text-ocheto-gold-500" strokeWidth={2.5} />
              100% specialty
            </span>
          </motion.div>

          {/* ===== HANDWRITTEN SIGNATURE ===== */}
          <motion.div
            initial={{ opacity: 0, y: 14, rotate: -10 }}
            whileInView={{ opacity: 1, y: 0, rotate: -6 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 1.2, ease: EASE }}
            className="mt-9 sm:mt-12 flex items-center justify-center gap-3"
            style={{ transformOrigin: 'center' }}
          >
            <motion.span
              animate={{ rotate: [-6, -2, -6], y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
              className="font-caveat text-3xl sm:text-4xl text-ocheto-gold-500 leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            >
              ¡Te esperamos! — Diego ☕
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
