import { EASE, useInfiniteAnimation } from '@/shared/motion';
import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { Coffee, Sparkles } from 'lucide-react';
import { CoffeeBean } from '@/shared/icons';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const floatA: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: EASE },
  },
  animate: {
    y: [-10, 12, -10],
    rotate: [-3, 5, -3],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const floatB: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, delay: 0.2, ease: EASE },
  },
  animate: {
    y: [8, -14, 8],
    rotate: [4, -4, 4],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const floatC: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, delay: 0.35, ease: EASE },
  },
  animate: {
    y: [-12, 10, -12],
    rotate: [-4, 3, -4],
    transition: {
      duration: 5.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export default function MenuHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.5]);
  const animateInfinite = useInfiniteAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[50vh] sm:min-h-[60vh] overflow-hidden bg-ocheto-green-950"
      aria-label="Hero del menú"
    >
      {/* ===== Parallax background ===== */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: bgScale }}
      >
        <img
          src="/assets/wallaper_1.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* ===== Gradient overlay ===== */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(135deg, hsl(var(--ocheto-green-950) / 0.86) 0%, hsl(var(--ocheto-green-900) / 0.72) 45%, hsl(var(--ocheto-green-950) / 0.92) 100%)',
        }}
      />

      {/* ===== Atmospheric glows ===== */}
      <motion.div
        aria-hidden
        animate={animateInfinite ? { opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.08, 0.95] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 right-[8%] -translate-y-1/2 z-[2] w-[55vw] h-[55vw] max-w-[640px] max-h-[640px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-gold-500) / 0.28) 0%, hsl(var(--ocheto-caramel-500) / 0.14) 38%, transparent 65%)',
        }}
      />
      <motion.div
        aria-hidden
        animate={animateInfinite ? { opacity: [0.25, 0.5, 0.25], scale: [0.95, 1.12, 0.95] } : undefined}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[20%] left-[6%] z-[2] w-[38vw] h-[38vw] max-w-[460px] max-h-[460px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-green-400) / 0.18) 0%, transparent 60%)',
        }}
      />

      {/* ===== Floating decoration: cups & beans ===== */}
      <motion.div
        variants={floatA}
        initial="hidden"
        animate={animateInfinite ? ['show', 'animate'] : 'show'}
        className="absolute top-[16%] right-[10%] sm:right-[14%] w-[14%] sm:w-[12%] lg:w-[10%] z-[3] hidden sm:block"
        aria-hidden="true"
      >
        <motion.img
          src="/assets/vaso-cafe.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-auto object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
        />
      </motion.div>

      <motion.div
        variants={floatB}
        initial="hidden"
        animate={animateInfinite ? ['show', 'animate'] : 'show'}
        className="absolute bottom-[18%] right-[8%] sm:right-[12%] w-[12%] sm:w-[10%] lg:w-[9%] z-[3] hidden sm:block"
        aria-hidden="true"
      >
        <motion.img
          src="/assets/vaso-verde.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-auto object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
        />
      </motion.div>

      <motion.div
        variants={floatC}
        initial="hidden"
        animate={animateInfinite ? ['show', 'animate'] : 'show'}
        className="absolute bottom-[24%] left-[6%] sm:left-[10%] w-[10%] sm:w-[9%] lg:w-[8%] z-[3] hidden md:block"
        aria-hidden="true"
      >
        <motion.img
          src="/assets/vaso-rojo.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-auto object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
        />
      </motion.div>

      {/* Floating coffee beans */}
      <motion.div
        aria-hidden
        animate={animateInfinite ? { y: [0, -16, 0], rotate: [0, 18, 0] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[28%] left-[14%] z-[3] hidden lg:block opacity-60"
      >
        <CoffeeBean size={32} fill="hsl(var(--ocheto-coffee-700))" />
      </motion.div>
      <motion.div
        aria-hidden
        animate={animateInfinite ? { y: [0, 14, 0], rotate: [-8, 8, -8] } : undefined}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute top-[60%] right-[22%] z-[3] hidden xl:block opacity-55"
      >
        <CoffeeBean size={24} fill="hsl(var(--ocheto-caramel-600, 28 70% 50%))" />
      </motion.div>
      <motion.div
        aria-hidden
        animate={animateInfinite ? { y: [0, -10, 0], rotate: [6, -6, 6] } : undefined}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
        className="absolute bottom-[14%] left-[20%] z-[3] hidden lg:block opacity-50"
      >
        <CoffeeBean size={20} fill="hsl(var(--ocheto-gold-500))" />
      </motion.div>

      {/* Sparkles */}
      <motion.div
        aria-hidden
        animate={animateInfinite ? { scale: [1, 1.35, 1], opacity: [0.45, 0.95, 0.45] } : undefined}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[24%] right-[28%] z-[3] text-ocheto-gold-500 hidden md:block"
      >
        <Sparkles className="w-5 h-5" strokeWidth={2} />
      </motion.div>
      <motion.div
        aria-hidden
        animate={animateInfinite ? { scale: [1, 1.25, 1], opacity: [0.4, 0.85, 0.4] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-[34%] right-[26%] z-[3] text-ocheto-caramel-500 hidden md:block"
      >
        <Sparkles className="w-4 h-4" strokeWidth={2.4} />
      </motion.div>

      {/* ===== Content ===== */}
      <motion.div
        style={{ y: titleY, opacity: contentOpacity }}
        className="relative z-10 min-h-[50vh] sm:min-h-[60vh] flex items-center pb-16 sm:pb-20 lg:pb-24"
      >
        <div className="container-ocheto w-full">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="relative max-w-3xl mx-auto text-center"
          >
            {/* Handwritten note */}
            <motion.div
              variants={fadeInUp}
              className="absolute -top-6 sm:-top-10 right-2 sm:right-6 lg:right-20 hidden sm:block pointer-events-none"
            >
              <motion.span
                animate={animateInfinite ? { rotate: [8, 4, 8], y: [0, -3, 0] } : undefined}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block font-caveat text-ocheto-gold-500 text-2xl sm:text-3xl lg:text-4xl"
                style={{ textShadow: '0 2px 0 rgba(232, 185, 35, 0.15)' }}
              >
                ¡Hecho a mano!
              </motion.span>
            </motion.div>

            {/* Eyebrow */}
            <motion.div
              variants={fadeInUp}
              className="flex justify-center mb-5 sm:mb-6"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                <Coffee
                  className="w-3.5 h-3.5 text-ocheto-gold-500"
                  strokeWidth={2.5}
                />
                <span className="text-[10px] sm:text-xs tracking-[0.28em] font-bold uppercase text-ocheto-gold-500">
                  Explora Nuestra Carta
                </span>
              </div>
            </motion.div>

            {/* Editorial title */}
            <motion.h1
              variants={fadeInUp}
              className="font-fraunces italic font-medium text-ocheto-cream-50 leading-[0.92] tracking-tight"
              style={{
                fontSize: 'clamp(3.5rem, 11vw, 8.5rem)',
                fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
              }}
            >
              Nuestro{' '}
              <span className="relative inline-block">
                <span
                  className="absolute inset-x-0 bottom-2 sm:bottom-3 h-3 sm:h-4 -z-0 rounded-sm"
                  style={{ background: 'hsl(var(--ocheto-gold-500) / 0.4)' }}
                  aria-hidden="true"
                />
                <span className="relative z-10 text-ocheto-gold-500">
                  Menú
                </span>
              </span>
            </motion.h1>

            {/* Decorative underline */}
            <motion.div
              variants={fadeInUp}
              className="mt-4 sm:mt-5 flex justify-center"
            >
              <span className="block h-[2px] w-16 sm:w-20 rounded-full bg-gradient-to-r from-transparent via-ocheto-gold-500 to-transparent" />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="mt-6 sm:mt-7 max-w-xl mx-auto text-ocheto-cream-100/80 text-base sm:text-lg lg:text-xl leading-relaxed font-light px-4"
            >
              Desde el espresso clásico hasta nuestras creaciones{' '}
              <em className="font-fraunces italic text-ocheto-cream-50 not-italic font-medium">
                signature
              </em>
              . Cada bebida, hecha con cariño en La Paz.
            </motion.p>

            {/* Quick stats strip */}
            <motion.div
              variants={fadeInUp}
              className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2.5 text-[11px] sm:text-xs text-ocheto-cream-100/70 font-medium"
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ocheto-gold-500" />
                <span className="text-ocheto-cream-50 font-bold">16</span>
                <span>creaciones</span>
              </span>
              <span className="hidden sm:inline-block h-3 w-px bg-ocheto-cream-100/20" />
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ocheto-matcha-500" />
                <span className="text-ocheto-cream-50 font-bold">5</span>
                <span>categorías</span>
              </span>
              <span className="hidden sm:inline-block h-3 w-px bg-ocheto-cream-100/20" />
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ocheto-caramel-500" />
                <span>100% specialty</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* ===== Bottom curved transition into cream ===== */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 z-[4] pointer-events-none"
      >
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50C40 38 80 62 120 48C160 34 200 58 240 44C280 30 320 54 360 40C400 26 440 50 480 36C520 22 560 46 600 32C640 18 680 42 720 28C760 14 800 38 840 24C880 10 920 34 960 20C1000 6 1040 30 1080 16C1120 2 1160 26 1200 12C1240 -2 1280 22 1320 8C1360 -6 1400 14 1440 0V100H0V50Z"
            fill="hsl(var(--ocheto-cream-50))"
          />
        </svg>
      </div>
    </section>
  );
}
