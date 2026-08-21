import { EASE } from '@/shared/motion';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ProcessSteps } from './ProcessSteps';

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export default function Process() {
  return (
    <section
      id="proceso"
      className="relative w-full overflow-hidden bg-ocheto-green-900 text-white"
    >
      {/* ===== Grain texture overlay ===== */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.14] mix-blend-screen"
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="proc-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.92"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#proc-noise)" />
        </svg>
      </div>

      {/* ===== Soft radial glows for depth ===== */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 z-[1] h-[420px] w-[420px] rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle at center, hsl(var(--ocheto-green-700) / 0.45) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 z-[1] h-[480px] w-[480px] rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle at center, hsl(var(--ocheto-gold-500) / 0.18) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* ===== Vertical gradient edge fades ===== */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-ocheto-green-950/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 bg-gradient-to-t from-ocheto-green-950/60 to-transparent" />

      {/* ===== Watermark word ===== */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden"
      >
        <span
          className="select-none whitespace-nowrap leading-none"
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(245, 240, 232, 0.05)',
            fontSize: 'clamp(7rem, 26vw, 22rem)',
            letterSpacing: '-0.04em',
          }}
        >
          PROCESO
        </span>
      </div>

      {/* ===== Content ===== */}
      <div className="container-ocheto relative z-10 py-24 sm:py-28 lg:py-36">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={headerVariants}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="ocheto-subtitle text-ocheto-gold-500 text-[11px] sm:text-xs">
            ·&nbsp;&nbsp;DEL GRANO A LA TAZA&nbsp;&nbsp;·
          </span>
          <h2
            className="mt-5 sm:mt-7 text-4xl sm:text-5xl lg:text-6xl xl:text-[5.5rem] font-normal leading-[1.02] tracking-tight"
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: 'italic',
              fontVariationSettings: "'opsz' 144",
            }}
          >
            Cada paso es un{' '}
            <span className="relative inline-block">
              <span className="relative z-10">acto de amor</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-3 sm:h-4 -z-0"
                style={{
                  background:
                    'linear-gradient(90deg, hsl(var(--ocheto-gold-500) / 0.35), hsl(var(--ocheto-caramel-500) / 0.25))',
                  transform: 'skewX(-8deg)',
                  borderRadius: '4px',
                }}
              />
            </span>{' '}
            por el café.
          </h2>
          <p className="mt-6 sm:mt-8 text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Del grano al latte: cuatro pasos, sin vueltas.
          </p>
        </motion.div>

        {/* ===== Steps ===== */}
        <ProcessSteps />

        {/* ===== CTA ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mt-16 sm:mt-20 lg:mt-28 flex flex-col items-center gap-3"
        >
          <Link
            to="/nosotros"
            className="group inline-flex items-center gap-3 text-ocheto-cream-50 transition-colors duration-300 hover:text-ocheto-gold-500"
          >
            <span
              className="relative text-base sm:text-lg font-medium"
              style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic' }}
            >
              Nuestra historia
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-ocheto-gold-500 transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-current transition-transform duration-500 ease-out group-hover:scale-x-0"
              />
            </span>
            <motion.span
              aria-hidden
              className="inline-flex"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
