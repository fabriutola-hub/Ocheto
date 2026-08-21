import { EASE } from '@/shared/motion';
import { motion, type Variants } from 'framer-motion';
import { Mountain, Flame, Droplets, Coffee } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PROCESS_STEPS } from '@/data';
import { cn } from '@/lib/utils';

const STEP_ICONS: LucideIcon[] = [Mountain, Flame, Droplets, Coffee];

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: idx * 0.15,
      ease: EASE,
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
      ease: EASE,
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

export function ProcessSteps() {
  return (
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
  );
}
