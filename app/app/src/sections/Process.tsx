import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import { Sparkles, Heart, Hand, Coffee, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PROCESS_STEPS } from '@/data';
import { cn } from '@/lib/utils';

const STEP_ICONS: LucideIcon[] = [Sparkles, Heart, Hand, Coffee];

const HEADER_EASE = [0.16, 1, 0.3, 1] as const;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: HEADER_EASE },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: idx * 0.15,
      ease: HEADER_EASE,
    },
  }),
};

const numberVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 12 },
  visible: (idx: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.25 + idx * 0.15,
      ease: HEADER_EASE,
    },
  }),
};

interface IconBadgeProps {
  Icon: LucideIcon;
  color: string;
  size?: 'sm' | 'lg';
  pulseDelay?: number;
}

function IconBadge({ Icon, color, size = 'lg', pulseDelay = 0 }: IconBadgeProps) {
  const isLg = size === 'lg';

  return (
    <div className="relative shrink-0">
      <motion.div
        whileHover={{ rotate: 14, scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        className={cn(
          'relative z-10 flex items-center justify-center rounded-full',
          isLg ? 'h-24 w-24' : 'h-14 w-14 sm:h-16 sm:w-16'
        )}
        style={{
          background: `radial-gradient(circle at 30% 28%, ${color} 0%, ${color}b3 55%, ${color}66 100%)`,
          boxShadow: `0 ${isLg ? 18 : 12}px ${isLg ? 40 : 28}px -${isLg ? 10 : 8}px ${color}aa, inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 -${isLg ? 10 : 6}px ${isLg ? 20 : 14}px rgba(0,0,0,0.22)`,
        }}
      >
        <Icon
          className={cn(
            'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]',
            isLg ? 'h-10 w-10' : 'h-6 w-6 sm:h-7 sm:w-7'
          )}
          strokeWidth={1.5}
        />
      </motion.div>

      <motion.span
        aria-hidden
        animate={{ scale: [1, 1.5], opacity: [0.55, 0] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: 'easeOut',
          delay: pulseDelay,
        }}
        className="absolute inset-0 rounded-full"
        style={{ border: `1.5px solid ${color}` }}
      />
    </div>
  );
}

interface JourneyLineProps {
  orientation: 'horizontal' | 'vertical';
}

function JourneyLine({ orientation }: JourneyLineProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'pointer-events-none absolute',
        isHorizontal
          ? 'left-0 right-0 z-0'
          : 'left-7 sm:left-9 top-0 bottom-0 w-px z-0'
      )}
      style={isHorizontal ? { top: '48px' } : undefined}
    >
      <svg
        className={cn('w-full', isHorizontal ? 'h-px' : 'h-full w-px')}
        viewBox={isHorizontal ? '0 0 100 2' : '0 0 2 100'}
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.line
          x1={isHorizontal ? '12.5' : '1'}
          y1={isHorizontal ? '1' : '0'}
          x2={isHorizontal ? '87.5' : '1'}
          y2={isHorizontal ? '1' : '100'}
          stroke="hsl(var(--ocheto-gold-500))"
          strokeWidth="0.6"
          strokeDasharray="3 2"
          pathLength={1}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.55 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.6, delay: 0.45, ease: 'easeInOut' }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

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
              <span className="relative z-10">acto de cariño</span>
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
            por el detalle.
          </h2>
          <p className="mt-6 sm:mt-8 text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Cuatro etapas que viven en cada bebida, cada postre y cada momento que compartimos contigo.
          </p>
        </motion.div>

        {/* ===== Steps ===== */}
        <div className="relative mt-16 sm:mt-20 lg:mt-28">
          {/* ============== DESKTOP ============== */}
          <div className="hidden lg:block relative">
            <JourneyLine orientation="horizontal" />

            <div className="relative z-10 grid grid-cols-4 gap-6 xl:gap-10">
              {PROCESS_STEPS.map((step, idx) => {
                const Icon = STEP_ICONS[idx] ?? Coffee;
                return (
                  <motion.article
                    key={step.step}
                    custom={idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={stepVariants}
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                    className="group relative flex flex-col items-center text-center"
                  >
                    <IconBadge
                      Icon={Icon}
                      color={step.color}
                      size="lg"
                      pulseDelay={idx * 0.4}
                    />

                    <motion.div
                      custom={idx}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-100px' }}
                      variants={numberVariants}
                      className="mt-8 text-6xl xl:text-7xl font-light leading-none"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontStyle: 'italic',
                        color: step.color,
                        fontVariationSettings: "'opsz' 144",
                      }}
                    >
                      {step.step}
                    </motion.div>

                    <h3
                      className="mt-3 text-2xl xl:text-[1.85rem] font-semibold text-white leading-tight"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontVariationSettings: "'opsz' 30",
                      }}
                    >
                      {step.title}
                    </h3>

                    <span
                      className="font-caveat text-[1.65rem] xl:text-[1.85rem] mt-0.5 leading-none"
                      style={{ color: 'hsl(var(--ocheto-caramel-500))' }}
                    >
                      {step.subtitle}
                    </span>

                    <p className="mt-4 text-sm xl:text-[15px] text-white/65 leading-relaxed max-w-[28ch]">
                      {step.description}
                    </p>

                    {/* Decorative bottom accent */}
                    <span
                      aria-hidden
                      className="mt-6 block h-px w-10 origin-center scale-x-100 transition-transform duration-500 group-hover:scale-x-150"
                      style={{ backgroundColor: step.color, opacity: 0.55 }}
                    />
                  </motion.article>
                );
              })}
            </div>
          </div>

          {/* ============== MOBILE / TABLET ============== */}
          <div className="lg:hidden relative">
            <JourneyLine orientation="vertical" />

            <ul className="relative z-10 space-y-12 sm:space-y-16">
              {PROCESS_STEPS.map((step, idx) => {
                const Icon = STEP_ICONS[idx] ?? Coffee;
                return (
                  <motion.li
                    key={step.step}
                    custom={idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={stepVariants}
                    className="relative flex gap-5 sm:gap-7 items-start"
                  >
                    <IconBadge
                      Icon={Icon}
                      color={step.color}
                      size="sm"
                      pulseDelay={idx * 0.4}
                    />

                    <div className="flex-1 pt-1 min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <motion.span
                          custom={idx}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: '-100px' }}
                          variants={numberVariants}
                          className="text-5xl sm:text-6xl font-light leading-none"
                          style={{
                            fontFamily: "'Fraunces', serif",
                            fontStyle: 'italic',
                            color: step.color,
                            fontVariationSettings: "'opsz' 144",
                          }}
                        >
                          {step.step}
                        </motion.span>
                        <h3
                          className="text-2xl sm:text-3xl font-semibold text-white leading-tight"
                          style={{
                            fontFamily: "'Fraunces', serif",
                            fontVariationSettings: "'opsz' 30",
                          }}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <span
                        className="font-caveat text-2xl sm:text-[1.85rem] block mt-0.5 leading-none"
                        style={{ color: 'hsl(var(--ocheto-caramel-500))' }}
                      >
                        {step.subtitle}
                      </span>
                      <p className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed max-w-prose">
                        {step.description}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ===== CTA ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: HEADER_EASE }}
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
              Conoce nuestra historia
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

          <span
            aria-hidden
            className="font-caveat text-xl sm:text-2xl text-white/35"
          >
            desde los alfajores hasta tres tiendas
          </span>
        </motion.div>
      </div>
    </section>
  );
}
