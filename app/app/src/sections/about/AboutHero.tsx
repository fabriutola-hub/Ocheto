import { motion, type Variants } from 'framer-motion';
import { ChevronDown, Coffee } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const headlineContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.25 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: -55 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 1, ease: EASE },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.8, ease: EASE },
  },
};

const noteVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7, rotate: -16, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: -8,
    y: 0,
    transition: { duration: 0.9, delay: 1.2, ease: EASE },
  },
};

const quotePulse: Variants = {
  initial: { scale: 1, opacity: 0.08 },
  animate: {
    scale: [1, 1.04, 1],
    opacity: [0.08, 0.13, 0.08],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
  },
};

const driftLeft: Variants = {
  initial: { x: 0, y: 0 },
  animate: {
    x: [-10, 14, -10],
    y: [-12, 8, -12],
    transition: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
  },
};

const driftRight: Variants = {
  initial: { x: 0, y: 0 },
  animate: {
    x: [12, -10, 12],
    y: [10, -14, 10],
    transition: { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
  },
};

const scrollBounce: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, 10, 0],
    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
  },
};

const TITLE_WORDS = ['Nuestra', 'historia.'];

export default function AboutHero() {
  return (
    <section
      id="about-hero"
      className="relative w-full min-h-screen overflow-hidden bg-ocheto-green-950 isolate"
    >
      {/* ===== BACKGROUND IMAGE WITH PARALLAX ===== */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 8, ease: EASE }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/assets/equipo-montana.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover scale-110"
        />
      </motion.div>

      {/* ===== OVERLAY GRADIENTS ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, hsl(var(--ocheto-green-950) / 0.85) 0%, hsl(var(--ocheto-green-900) / 0.72) 45%, hsl(var(--ocheto-green-950) / 0.92) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 30%, hsl(var(--ocheto-gold-500) / 0.18) 0%, transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(circle at 85% 80%, hsl(var(--ocheto-caramel-500) / 0.18) 0%, transparent 55%)',
        }}
      />

      {/* ===== GRAIN TEXTURE ===== */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.18] mix-blend-overlay"
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="aboutHeroGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#aboutHeroGrain)" />
        </svg>
      </div>

      {/* ===== GIANT FLOATING QUOTE MARKS ===== */}
      <motion.div
        variants={quotePulse}
        initial="initial"
        animate="animate"
        aria-hidden
        className="pointer-events-none absolute top-[6%] left-[4%] sm:left-[8%] z-[3] select-none leading-none text-ocheto-cream-50"
        style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 'clamp(8rem, 22vw, 28rem)',
          textShadow: '0 0 80px hsl(var(--ocheto-gold-500) / 0.25)',
        }}
      >
        “
      </motion.div>

      <motion.div
        variants={quotePulse}
        initial="initial"
        animate="animate"
        aria-hidden
        className="pointer-events-none absolute bottom-[8%] right-[3%] sm:right-[6%] z-[3] select-none leading-none text-ocheto-cream-50"
        style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 'clamp(8rem, 22vw, 28rem)',
          textShadow: '0 0 80px hsl(var(--ocheto-gold-500) / 0.25)',
        }}
      >
        ”
      </motion.div>

      {/* ===== DECORATIVE FLOATING COFFEE BEANS ===== */}
      <motion.div
        variants={driftLeft}
        initial="initial"
        animate="animate"
        aria-hidden
        className="absolute top-[18%] right-[12%] sm:right-[18%] z-[4] pointer-events-none opacity-70"
      >
        <svg width="48" height="64" viewBox="0 0 48 64" fill="none">
          <ellipse cx="24" cy="32" rx="20" ry="28" fill="hsl(var(--ocheto-coffee-700))" />
          <path
            d="M24 6 C 18 18, 18 46, 24 58"
            stroke="hsl(var(--ocheto-cream-50))"
            strokeWidth="2.2"
            strokeLinecap="round"
            transform="rotate(-20 24 32)"
          />
        </svg>
      </motion.div>

      <motion.div
        variants={driftRight}
        initial="initial"
        animate="animate"
        aria-hidden
        className="absolute bottom-[22%] left-[8%] sm:left-[14%] z-[4] pointer-events-none opacity-60"
      >
        <svg width="40" height="56" viewBox="0 0 48 64" fill="none">
          <ellipse cx="24" cy="32" rx="20" ry="28" fill="hsl(var(--ocheto-caramel-600, 28 70% 50%))" />
          <path
            d="M24 6 C 18 18, 18 46, 24 58"
            stroke="hsl(var(--ocheto-cream-50))"
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(15 24 32)"
          />
        </svg>
      </motion.div>

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-24 sm:pb-28">
        <div className="container-ocheto w-full">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            {/* Eyebrow */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mb-7 sm:mb-9"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-ocheto-gold-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ocheto-gold-500" />
                </span>
                <Coffee className="w-3.5 h-3.5 text-ocheto-caramel-500" strokeWidth={2.5} />
                <span className="text-[10px] sm:text-xs tracking-[0.28em] font-semibold uppercase text-white/90">
                  Sobre Nosotros · La Paz
                </span>
              </div>
            </motion.div>

            {/* Decorative pre-title rule */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mb-6 sm:mb-8 flex items-center gap-3"
            >
              <span
                aria-hidden
                className="block h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-ocheto-gold-500"
              />
              <span className="font-caveat text-xl sm:text-2xl text-ocheto-caramel-500 leading-none">
                capítulo uno
              </span>
              <span
                aria-hidden
                className="block h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-ocheto-gold-500"
              />
            </motion.div>

            {/* Headline — word-by-word */}
            <motion.h1
              variants={headlineContainer}
              initial="hidden"
              animate="show"
              className="font-fraunces italic text-ocheto-cream-50 leading-[0.92] tracking-[-0.02em]"
              style={{
                fontSize: 'clamp(3.5rem, 12vw, 9rem)',
                fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
                perspective: '1000px',
                textShadow: '0 4px 30px rgba(0,0,0,0.4)',
              }}
            >
              {TITLE_WORDS.map((word, i) => (
                <motion.span
                  key={word + i}
                  variants={wordVariants}
                  className="inline-block mr-[0.18em]"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {i === TITLE_WORDS.length - 1 ? (
                    <span className="text-ocheto-gold-500">{word}</span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={subtitleVariants}
              initial="hidden"
              animate="show"
              className="mt-8 sm:mt-10 max-w-2xl text-base sm:text-lg md:text-xl lg:text-[1.4rem] text-white/85 leading-relaxed font-light"
            >
              Empezamos con alfajores de cacao y muchas ganas. Hoy somos tres
              tiendas en La Paz, con los mismos ingredientes de calidad y el{' '}
              <span className="font-fraunces italic text-ocheto-gold-500 font-medium">
                mismo cariño
              </span>{' '}
              de siempre.
            </motion.p>

            {/* Handwritten signature */}
            <motion.div
              variants={noteVariants}
              initial="hidden"
              animate="show"
              className="mt-10 sm:mt-12 flex items-center gap-3"
              style={{ transformOrigin: 'center' }}
            >
              <motion.span
                animate={{ rotate: [-8, -4, -8], y: [0, -3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
                className="font-caveat text-3xl sm:text-4xl lg:text-5xl text-ocheto-caramel-500 leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              >
                Con cariño, el equipo Ocheto 🐻☕
              </motion.span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===== SCROLL-DOWN INDICATOR ===== */}
      <motion.a
        href="#about-story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5, ease: EASE }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 group cursor-pointer"
        aria-label="Bajar a la historia"
      >
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-white/55 font-semibold group-hover:text-ocheto-gold-500 transition-colors duration-300">
          Descubre más
        </span>
        <motion.span
          variants={scrollBounce}
          initial="initial"
          animate="animate"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/25 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/70 group-hover:border-ocheto-gold-500 group-hover:text-ocheto-gold-500 group-hover:bg-ocheto-gold-500/10 transition-all duration-300"
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.25} />
        </motion.span>
      </motion.a>

      {/* ===== BOTTOM TORN EDGE ===== */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 50C40 38 80 62 120 48C160 34 200 60 240 46C280 32 320 56 360 42C400 28 440 52 480 38C520 24 560 48 600 34C640 20 680 44 720 30C760 16 800 40 840 26C880 12 920 36 960 22C1000 8 1040 32 1080 18C1120 4 1160 28 1200 14C1240 0 1280 24 1320 10C1360 -4 1400 20 1440 8V100H0V50Z"
            fill="hsl(var(--ocheto-cream-50))"
          />
          <path
            d="M0 70C50 58 100 80 150 66C200 52 250 74 300 60C350 46 400 68 450 54C500 40 550 62 600 48C650 34 700 56 750 42C800 28 850 50 900 36C950 22 1000 44 1050 30C1100 16 1150 38 1200 24C1250 10 1300 32 1350 18C1400 4 1430 22 1440 18V100H0V70Z"
            fill="hsl(var(--ocheto-cream-50))"
            opacity="0.7"
          />
        </svg>
      </div>
    </section>
  );
}
