import { EASE } from '@/shared/motion';
import { motion, type Variants } from 'framer-motion';
import { CoffeeBean } from '@/shared/icons';

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, rotate: -2 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const floatBean = (delay: number, amplitude: number, duration: number): Variants => ({
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [-amplitude, amplitude, -amplitude],
    rotate: [-6, 6, -6],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
});

const floatSlow = (delay: number, yAmp: number, rAmp: number, duration: number): Variants => ({
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [-yAmp, yAmp, -yAmp],
    rotate: [rAmp, -rAmp, rAmp],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
});

const manifestoStats = [
  { value: '1,800m', label: 'Altura de origen', sub: 'Yungas paceños' },
  { value: '100%', label: 'Specialty grade', sub: 'Granos selectos' },
  { value: '8+', label: 'Años tostando', sub: 'En La Paz' },
];

const cardPositions = [
  {
    top: '6%',
    left: '-6%',
    rotate: -8,
    accent: 'hsl(var(--ocheto-gold-500))',
    icon: '☕',
  },
  {
    top: '38%',
    right: '-8%',
    rotate: 6,
    accent: 'hsl(var(--ocheto-caramel-500))',
    icon: '✦',
  },
  {
    bottom: '4%',
    left: '18%',
    rotate: -4,
    accent: 'hsl(var(--ocheto-green-600))',
    icon: '◆',
  },
];

export default function ManifestoVisual() {
  return (
    <div className="lg:col-span-5 relative order-first lg:order-last">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="relative w-full max-w-[460px] mx-auto aspect-[4/5]"
      >
        {/* ===== DECORATIVE RING BEHIND CARD ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
          aria-hidden="true"
          className="absolute inset-0 -m-12 rounded-full border border-dashed pointer-events-none"
          style={{ borderColor: 'hsl(var(--ocheto-green-700) / 0.25)' }}
        />

        {/* ===== BACKGROUND CARD (rotated, cream) ===== */}
        <motion.div
          initial={{ opacity: 0, rotate: 8, y: 30 }}
          whileInView={{ opacity: 1, rotate: -3, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          aria-hidden="true"
          className="absolute inset-0 rounded-[2.5rem] shadow-[0_30px_60px_-20px_hsl(var(--ocheto-coffee-900)/0.25)]"
          style={{
            background:
              'linear-gradient(145deg, hsl(var(--ocheto-cream-100)) 0%, hsl(var(--ocheto-cream-50)) 60%, hsl(var(--ocheto-cream-200)) 100%)',
            transformOrigin: 'center',
          }}
        >
          {/* Subtle inner pattern */}
          <div
            className="absolute inset-6 rounded-[1.75rem] opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle, hsl(var(--ocheto-green-700) / 0.18) 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          />
        </motion.div>

        {/* ===== ACCENT STRIPE (top-right of card) ===== */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          aria-hidden="true"
          className="absolute top-8 right-8 h-1 w-20 origin-right rounded-full z-10"
          style={{
            background:
              'linear-gradient(90deg, hsl(var(--ocheto-caramel-500)), hsl(var(--ocheto-gold-500)))',
          }}
        />

        {/* ===== FLOATING BEANS (decorative) ===== */}
        <motion.div
          variants={floatBean(0, 14, 5)}
          initial="initial"
          animate="animate"
          className="absolute -top-4 left-4 z-20"
          style={{ filter: 'drop-shadow(0 8px 12px hsl(var(--ocheto-coffee-900) / 0.2))' }}
        >
          <CoffeeBean size={42} fill="hsl(var(--ocheto-coffee-700))" detail />
        </motion.div>

        <motion.div
          variants={floatSlow(0.4, 10, 8, 6)}
          initial="initial"
          animate="animate"
          className="absolute top-1/3 -right-3 z-20"
          style={{ filter: 'drop-shadow(0 8px 12px hsl(var(--ocheto-coffee-900) / 0.2))' }}
        >
          <CoffeeBean size={32} fill="hsl(var(--ocheto-coffee-900))" detail />
        </motion.div>

        <motion.div
          variants={floatBean(0.8, 8, 4.5)}
          initial="initial"
          animate="animate"
          className="absolute bottom-12 -left-5 z-20"
          style={{ filter: 'drop-shadow(0 8px 12px hsl(var(--ocheto-coffee-900) / 0.2))' }}
        >
          <CoffeeBean size={36} fill="hsl(var(--ocheto-caramel-600, 28 70% 50%))" detail />
        </motion.div>

        <motion.div
          variants={floatSlow(1.2, 7, 6, 5.5)}
          initial="initial"
          animate="animate"
          className="absolute bottom-2 right-6 z-20"
          style={{ filter: 'drop-shadow(0 8px 12px hsl(var(--ocheto-coffee-900) / 0.2))' }}
        >
          <CoffeeBean size={26} fill="hsl(var(--ocheto-green-700))" detail />
        </motion.div>

        {/* ===== MAIN IMAGE ===== */}
        <motion.div
          variants={imageVariants}
          className="absolute inset-0 z-10 flex items-center justify-center p-8"
        >
          <motion.img
            src="/assets/drink-complete-v2.webp"
            alt="Taza de café de especialidad Ocheto"
            draggable={false}
            className="relative w-full h-full object-contain"
            style={{
              filter:
                'drop-shadow(0 30px 50px hsl(var(--ocheto-coffee-900) / 0.35))',
            }}
            animate={{
              y: [0, -8, 0],
              rotate: [0, 1.5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* ===== FLOATING STAT CARDS ===== */}
        {manifestoStats.map((stat, i) => {
          const pos = cardPositions[i];
          return (
            <motion.div
              key={stat.value}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.4 + i * 0.15 }}
              whileHover={{
                y: -6,
                rotate: 0,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              className="absolute z-30 group"
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                bottom: pos.bottom,
                transform: `rotate(${pos.rotate}deg)`,
              }}
            >
              <div
                className="relative bg-white rounded-2xl px-4 py-3 shadow-[0_12px_30px_-8px_hsl(var(--ocheto-coffee-900)/0.25)] border border-ocheto-cream-200 min-w-[140px] backdrop-blur-sm"
              >
                {/* Top accent dot */}
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ background: pos.accent }}
                />

                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-fraunces font-bold text-ocheto-coffee-900 leading-none tabular-nums"
                    style={{
                      fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
                      fontVariationSettings: '"opsz" 144',
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] sm:text-xs font-semibold text-ocheto-coffee-900 uppercase tracking-wider leading-tight">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-[10px] sm:text-[11px] text-ocheto-coffee-700/70 leading-tight">
                  {stat.sub}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* ===== HANDWRITTEN "¡HOLA!" NOTE ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -14 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            duration: 0.8,
            delay: 0.9,
            ease: EASE,
          }}
          className="absolute -top-2 right-12 z-40 pointer-events-none"
          style={{ transformOrigin: 'center' }}
        >
          <motion.div
            animate={{
              rotate: [-14, -10, -14],
              y: [0, -4, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.6,
            }}
            className="relative font-caveat text-3xl sm:text-4xl text-ocheto-green-700 drop-shadow-md"
            style={{
              textShadow:
                '0 2px 0 hsl(var(--ocheto-cream-50)), 0 4px 12px hsl(var(--ocheto-coffee-900) / 0.15)',
            }}
          >
            ¡Hola!
            <svg
              aria-hidden="true"
              viewBox="0 0 80 50"
              className="absolute -bottom-6 -right-2 w-16 h-10 text-ocheto-caramel-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M5 5 C 20 25, 40 35, 70 25" />
              <path d="M65 18 L 72 25 L 65 32" />
            </svg>
          </motion.div>
        </motion.div>

        {/* ===== META UNDER VISUAL ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-ocheto-coffee-700/70"
        >
          <span className="flex items-center gap-2">
            <span className="block w-1.5 h-1.5 rounded-full bg-ocheto-green-700" />
            Caranavi
          </span>
          <span className="flex items-center gap-2">
            <span className="block w-1.5 h-1.5 rounded-full bg-ocheto-caramel-500" />
            Sud Yungas
          </span>
          <span className="flex items-center gap-2">
            <span className="block w-1.5 h-1.5 rounded-full bg-ocheto-gold-500" />
            Apolo
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
