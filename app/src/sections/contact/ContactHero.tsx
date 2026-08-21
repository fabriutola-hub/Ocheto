import { useRef } from 'react';
import { EASE, useInfiniteAnimation } from '@/shared/motion';
import { motion, type Variants } from 'framer-motion';
import { Mail, Sparkles, ArrowDown } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 48, rotateX: -35 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.95,
      delay: 0.15 + i * 0.08,
      ease: EASE,
    },
  }),
};

const cupFloatA: Variants = {
  initial: { y: 0, rotate: -8 },
  animate: {
    y: [-14, 14, -14],
    rotate: [-8, 4, -8],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

const cupFloatB: Variants = {
  initial: { y: 0, rotate: 6 },
  animate: {
    y: [12, -14, 12],
    rotate: [6, -6, 6],
    transition: {
      duration: 7.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: 0.6,
    },
  },
};

const cupFloatC: Variants = {
  initial: { y: 0, rotate: -3 },
  animate: {
    y: [-8, 18, -8],
    rotate: [-3, 5, -3],
    transition: {
      duration: 5.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: 1.2,
    },
  },
};

const handwritingVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -25 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: -8,
    transition: {
      duration: 0.9,
      delay: 1.2,
      ease: EASE,
      type: 'spring',
      stiffness: 140,
      damping: 14,
    },
  },
};

const handwritingWobble: Variants = {
  initial: { rotate: -8 },
  animate: {
    rotate: [-8, -4, -8],
    y: [0, -3, 0],
    transition: {
      duration: 4.2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: 2.1,
    },
  },
};

const scrollHintVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 1.6, ease: EASE },
  },
};

const scrollBounce: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, 8, 0],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const animateInfinite = useInfiniteAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-ocheto-cream-50 grain-texture"
      aria-label="Página de contacto de Ocheto Coffee"
    >
      {/* ===== Background decorative radial ===== */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none opacity-[0.08]"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-green-700)) 0%, transparent 60%)',
        }}
      />

      {/* ===== Dotted pattern overlay ===== */}
      <div
        aria-hidden
        className="absolute inset-0 dots-bg opacity-40 pointer-events-none"
      />

      {/* ===== Subtle grid lines ===== */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--ocheto-coffee-900)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ocheto-coffee-900)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ===== Floating decorative cups ===== */}
      <motion.div
        aria-hidden
        variants={cupFloatA}
        initial="initial"
        animate={animateInfinite ? 'animate' : 'initial'}
        className="absolute top-[18%] left-[6%] sm:left-[10%] hidden md:block pointer-events-none opacity-90"
        style={{
          filter:
            'drop-shadow(0 20px 30px hsl(var(--ocheto-coffee-900) / 0.18))',
        }}
      >
        <img
          src="/assets/vaso-cafe.webp"
          alt=""
          className="w-20 sm:w-24 lg:w-28 h-auto"
          draggable={false}
        />
      </motion.div>

      <motion.div
        aria-hidden
        variants={cupFloatB}
        initial="initial"
        animate={animateInfinite ? 'animate' : 'initial'}
        className="absolute bottom-[14%] left-[4%] hidden lg:block pointer-events-none opacity-90"
        style={{
          filter:
            'drop-shadow(0 18px 28px hsl(var(--ocheto-coffee-900) / 0.15))',
        }}
      >
        <img
          src="/assets/cup-with-shadow.webp"
          alt=""
          className="w-16 sm:w-20 h-auto"
          draggable={false}
        />
      </motion.div>

      <motion.div
        aria-hidden
        variants={cupFloatC}
        initial="initial"
        animate={animateInfinite ? 'animate' : 'initial'}
        className="absolute top-[22%] right-[5%] lg:right-[8%] hidden md:block pointer-events-none opacity-90"
        style={{
          filter:
            'drop-shadow(0 22px 32px hsl(var(--ocheto-coffee-900) / 0.18))',
        }}
      >
        <img
          src="/assets/vaso-verde.webp"
          alt=""
          className="w-24 sm:w-28 lg:w-32 h-auto"
          draggable={false}
        />
      </motion.div>

      {/* ===== Floating sparkles ===== */}
      <motion.div
        aria-hidden
        animate={animateInfinite ? { scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[30%] right-[14%] text-ocheto-gold-500 hidden lg:block pointer-events-none"
      >
        <Sparkles className="w-6 h-6" strokeWidth={2} />
      </motion.div>

      <motion.div
        aria-hidden
        animate={animateInfinite ? { scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] } : undefined}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-[28%] right-[12%] text-ocheto-caramel-500 hidden lg:block pointer-events-none"
      >
        <Sparkles className="w-4 h-4" strokeWidth={2.5} />
      </motion.div>

      {/* ===== Handwritten "¡Escríbenos!" note ===== */}
      <motion.div
        variants={handwritingVariants}
        initial="hidden"
        animate="show"
        className="absolute top-[16%] right-[8%] lg:right-[14%] z-20 pointer-events-none hidden sm:block"
        style={{ transformOrigin: 'center' }}
      >
        <motion.div
          variants={handwritingWobble}
          initial="initial"
          animate={animateInfinite ? 'animate' : 'initial'}
          className="relative px-4 py-2 rounded-lg rotate-[-8deg]"
          style={{
            background: 'hsl(var(--ocheto-cream-50) / 0.95)',
            boxShadow:
              '0 14px 40px -12px hsl(var(--ocheto-coffee-900) / 0.35)',
            border: '1px solid hsl(var(--ocheto-cream-200))',
          }}
        >
          <span
            className="font-caveat text-3xl sm:text-4xl lg:text-5xl leading-none block text-ocheto-green-700 whitespace-nowrap"
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            ¡Escríbenos!
          </span>
          {/* Tape effect */}
          <span
            aria-hidden
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 rounded-sm rotate-3"
            style={{ background: 'hsl(var(--ocheto-gold-500) / 0.6)' }}
          />
          {/* Underline squiggle */}
          <svg
            className="absolute -bottom-3 left-2 right-2 w-[calc(100%-1rem)] h-3"
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.path
              d="M 2 6 Q 30 2, 60 6 T 120 6 T 198 6"
              stroke="hsl(var(--ocheto-caramel-500))"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 1.8, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* ===== Main content ===== */}
      <div className="relative z-10 container-ocheto pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative max-w-4xl mx-auto text-center"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUpVariants} className="mb-7 sm:mb-9">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocheto-green-700/10 border border-ocheto-green-700/20 text-ocheto-green-700 text-[11px] font-bold tracking-[0.28em] uppercase">
              <Mail className="w-3.5 h-3.5" strokeWidth={2.5} />
              Contacto · Ocheto Coffee
            </span>
          </motion.div>

          {/* Headline — word-by-word reveal */}
          <h1
            className="font-fraunces italic font-black text-ocheto-coffee-900 leading-[0.95] tracking-tight"
            style={{
              fontSize: 'clamp(4rem, 12vw, 9rem)',
              fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1',
              perspective: '1000px',
            }}
          >
            <span className="inline-block">
              {['Hablemos.'].map((word, i) => (
                <motion.span
                  key={word + i}
                  custom={i}
                  variants={wordVariants}
                  className="inline-block"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUpVariants}
            className="mt-7 sm:mt-9 text-base sm:text-lg lg:text-xl text-ocheto-coffee-700/85 leading-relaxed max-w-2xl mx-auto px-2"
          >
            Estamos aquí para una{' '}
            <span className="text-ocheto-green-700 font-medium">conversación</span>, una
            pregunta, o simplemente un{' '}
            <span className="text-ocheto-caramel-500 font-medium">café virtual</span>.
          </motion.p>

          {/* Decorative dot row */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-9 sm:mt-12 flex items-center justify-center gap-3"
          >
            <span
              aria-hidden
              className="block w-10 h-px bg-ocheto-green-700/40"
            />
            <span
              aria-hidden
              className="block w-1.5 h-1.5 rounded-full bg-ocheto-gold-500"
            />
            <span
              aria-hidden
              className="block w-1.5 h-1.5 rounded-full bg-ocheto-caramel-500"
            />
            <span
              aria-hidden
              className="block w-1.5 h-1.5 rounded-full bg-ocheto-green-700"
            />
            <span
              aria-hidden
              className="block w-10 h-px bg-ocheto-green-700/40"
            />
          </motion.div>
        </motion.div>

        {/* ===== Scroll hint ===== */}
        <motion.div
          variants={scrollHintVariants}
          initial="hidden"
          animate="show"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] uppercase tracking-[0.28em] text-ocheto-coffee-700/60 font-semibold">
            Desliza
          </span>
          <motion.div
            variants={scrollBounce}
            initial="initial"
            animate={animateInfinite ? 'animate' : 'initial'}
            className="text-ocheto-green-700"
          >
            <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </div>

      {/* ===== Bottom torn edge ===== */}
      <svg
        aria-hidden
        className="torn-edge-bottom"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        width="100%"
        height="60"
      >
        <path
          d="M0,60 L0,30 Q60,10 120,25 T240,30 T360,20 T480,32 T600,18 T720,28 T840,15 T960,30 T1080,22 T1200,30 T1320,18 T1440,28 L1440,60 Z"
          fill="hsl(var(--ocheto-green-900))"
        />
      </svg>
    </section>
  );
}
