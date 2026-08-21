import { useRef } from 'react';
import { EASE, useInfiniteAnimation } from '@/shared/motion';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Coffee } from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.3]);
  const animateInfinite = useInfiniteAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="about-hero"
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
    >
      {/* ===== Full-bleed parallax background — no filter ===== */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY }}
      >
        <img
          src="/assets/wallaper_1.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* ===== Bottom cream transition overlay (only at bottom) ===== */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
        style={{
          height: '40%',
          background:
            'linear-gradient(to top, hsl(var(--ocheto-cream-50)) 0%, hsl(var(--ocheto-cream-50) / 0.8) 60%, transparent 100%)',
        }}
      />

      {/* ===== Centered white card ===== */}
      <motion.div
        style={{ opacity }}
        className="relative z-[10] w-full max-w-2xl mx-auto px-6"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="bg-[hsl(var(--ocheto-cream-50))] rounded-2xl shadow-2xl p-8 sm:p-12 lg:p-14 border border-[hsl(var(--ocheto-green-700)/0.08)]"
        >
          {/* Top badge */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--ocheto-green-700)/0.08)]">
              <Coffee className="w-3.5 h-3.5 text-[hsl(var(--ocheto-green-700))]" strokeWidth={2.2} />
              <span className="text-[10px] tracking-[0.25em] font-semibold uppercase text-[hsl(var(--ocheto-green-700))]">
                Sobre Ocheto
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeInUp}
            className="font-fraunces italic font-medium text-[hsl(var(--ocheto-coffee-900))] leading-[0.92] tracking-tight text-center"
            style={{
              fontSize: 'clamp(2.2rem, 7vw, 4rem)',
              fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
            }}
          >
            Nuestra{' '}
            <span className="relative inline-block">
              <span
                className="absolute inset-x-0 bottom-1.5 h-2.5 -z-0 rounded-sm"
                style={{ background: 'hsl(var(--ocheto-gold-500) / 0.3)' }}
                aria-hidden="true"
              />
              <span className="relative z-10 text-[hsl(var(--ocheto-green-700))]">historia</span>
            </span>
          </motion.h1>

          {/* Decorative divider */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-3 my-7"
          >
            <span className="block h-px w-10 bg-[hsl(var(--ocheto-gold-500)/0.3)]" />
            <svg width="16" height="8" viewBox="0 0 24 12" fill="none">
              <path d="M2 6 A 10 10 0 0 1 22 6" stroke="hsl(var(--ocheto-gold-500))" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="8" r="2" fill="hsl(var(--ocheto-gold-500))" />
            </svg>
            <span className="block h-px w-10 bg-[hsl(var(--ocheto-gold-500)/0.3)]" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-center text-[hsl(var(--ocheto-coffee-700))] text-base sm:text-lg leading-relaxed font-light max-w-md mx-auto"
          >
            Tres sucursales en La Paz. Mismo grano, mismo oficio, desde 2017.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 flex items-center justify-center gap-8 sm:gap-12"
          >
            <div className="text-center">
              <span className="block font-fraunces font-bold text-[hsl(var(--ocheto-green-700))] text-2xl">3</span>
              <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--ocheto-coffee-600)/0.6)]">sucursales</span>
            </div>
            <div className="w-px h-10 bg-[hsl(var(--ocheto-green-700)/0.12)]" />
            <div className="text-center">
              <span className="block font-fraunces font-bold text-[hsl(var(--ocheto-green-700))] text-2xl">100%</span>
              <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--ocheto-coffee-600)/0.6)]">specialty</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ===== Scroll indicator ===== */}
      <motion.a
        href="#about-story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2 cursor-pointer group"
        aria-label="Descubrir más"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--ocheto-coffee-600)/0.6)] group-hover:text-[hsl(var(--ocheto-green-700))] transition-colors duration-300">
          Descubre más
        </span>
        <motion.div
          animate={animateInfinite ? { y: [0, 8, 0] } : undefined}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-[hsl(var(--ocheto-coffee-900)/0.2)] bg-[hsl(var(--ocheto-cream-50)/0.8)] backdrop-blur-sm flex items-center justify-center"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="hsl(var(--ocheto-coffee-900))"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.a>

      {/* ===== Bottom curved transition ===== */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
          aria-hidden="true"
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
