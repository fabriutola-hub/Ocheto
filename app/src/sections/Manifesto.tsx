import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight, Quote } from 'lucide-react';
import { STATS } from '@/data';

const headlineLineA = 'No somos solo una cafetería.';
const headlineLineB = 'Somos pequeños detalles que importan.';

const splitWords = (text: string) => text.split(' ');

const eyebrowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const headlineContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 28, rotateX: -35 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const bodyVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
  },
};

const signatureVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, rotate: -2 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
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

function CoffeeBean({
  className = '',
  fill = 'hsl(var(--ocheto-coffee-700))',
  size = 28,
}: {
  className?: string;
  fill?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 40 56"
      width={size}
      height={(size * 56) / 40}
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="20" cy="28" rx="18" ry="26" fill={fill} />
      <path
        d="M20 4 C 14 16, 14 40, 20 52"
        stroke="hsl(var(--ocheto-cream-50))"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 6 C 18 14, 18 22, 20 30 C 22 22, 22 14, 20 6 Z"
        fill="hsl(var(--ocheto-coffee-900))"
        opacity="0.35"
      />
    </svg>
  );
}

const manifestoStats = [
  { value: '3', label: 'Tiendas', sub: 'Para acompañarte' },
  { value: '100%', label: 'Ingredientes', sub: 'De calidad' },
  { value: '∞', label: 'Pequeños detalles', sub: 'En cada visita' },
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

export default function Manifesto() {
  const wordsA = splitWords(headlineLineA);
  const wordsB = splitWords(headlineLineB);

  return (
    <section
      id="manifesto"
      className="relative w-full overflow-hidden bg-ocheto-cream-50 dots-bg section-padding"
    >
      {/* ===== BIG BACKGROUND QUOTE MARKS ===== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 0.06, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="font-fraunces select-none -translate-y-6 leading-none"
          style={{
            fontSize: 'clamp(20rem, 42vw, 56rem)',
            color: 'hsl(var(--ocheto-coffee-900))',
            fontWeight: 700,
          }}
        >
          “
        </motion.span>
      </div>

      {/* ===== SOFT TOP FADE ===== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, hsl(var(--ocheto-cream-50)) 0%, transparent 100%)',
        }}
      />

      {/* ===== MAIN CONTAINER ===== */}
      <div className="relative z-10 container-ocheto">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* ===== VERTICAL DIVIDER (desktop only) ===== */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-1/2 -translate-y-1/2"
            style={{
              left: '60%',
              width: '1px',
              height: '70%',
              background:
                'linear-gradient(to bottom, transparent 0%, hsl(var(--ocheto-green-700) / 0.25) 30%, hsl(var(--ocheto-green-700) / 0.25) 70%, transparent 100%)',
            }}
          />

          {/* ====================================================== */}
          {/* LEFT COLUMN — 60% Editorial Text                       */}
          {/* ====================================================== */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-7 relative"
          >
            {/* Eyebrow */}
            <motion.div
              variants={eyebrowVariants}
              className="flex items-center gap-3 mb-7"
            >
              <span
                aria-hidden="true"
                className="block h-px w-10 bg-ocheto-green-700"
              />
              <span className="text-ocheto-green-700 text-xs sm:text-sm font-semibold uppercase tracking-[0.32em]">
                Quiénes Somos
              </span>
            </motion.div>

            {/* Quote opening mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-2 left-0 text-ocheto-caramel-500/40 pointer-events-none select-none"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(4rem, 8vw, 7rem)',
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              “
            </motion.div>

            {/* Headline — Line A */}
            <motion.h2
              variants={headlineContainer}
              className="font-fraunces italic font-light text-ocheto-coffee-900 leading-[0.95] tracking-tight"
              style={{
                fontSize: 'clamp(2.4rem, 6.5vw, 5rem)',
                fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0',
              }}
            >
              {wordsA.map((word, i) => (
                <motion.span
                  key={`a-${i}`}
                  variants={wordVariants}
                  className="inline-block mr-[0.22em]"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>

            {/* Headline — Line B (gradient / accent color) */}
            <motion.h2
              variants={headlineContainer}
              className="font-fraunces italic font-medium mt-2 leading-[0.95] tracking-tight"
              style={{
                fontSize: 'clamp(2.4rem, 6.5vw, 5rem)',
                fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 1',
              }}
            >
              <span className="gradient-text inline-block">
                {wordsB.map((word, i) => (
                  <motion.span
                    key={`b-${i}`}
                    variants={wordVariants}
                    className="inline-block mr-[0.22em]"
                    style={{ transformOrigin: '50% 100%' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <motion.span
                variants={wordVariants}
                className="inline-block text-ocheto-caramel-500"
                style={{ transformOrigin: '50% 100%' }}
                aria-hidden="true"
              >
                .
              </motion.span>
            </motion.h2>

            {/* Underline accent */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-[3px] w-24 mt-7 origin-left rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, hsl(var(--ocheto-green-700)) 0%, hsl(var(--ocheto-caramel-500)) 100%)',
              }}
            />

            {/* Body */}
            <motion.p
              variants={bodyVariants}
              className="mt-8 max-w-[58ch] text-base sm:text-lg lg:text-xl text-ocheto-coffee-700/90 leading-relaxed"
            >
              En Ocheto valoramos los ingredientes de calidad, la dedicación en
              cada preparación y los pequeños detalles que hacen especial cada
              momento. Nuestras bebidas y postres se elaboran con cuidado, para
              ofrecer una experiencia cálida, deliciosa y accesible.{' '}
              <span className="text-ocheto-coffee-900 font-medium">
                Una historia construida con cariño, taza a taza.
              </span>
            </motion.p>

            {/* Signature */}
            <motion.div
              variants={signatureVariants}
              className="mt-8 flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className="block h-px w-6 bg-ocheto-green-700/50"
              />
              <p className="font-caveat text-2xl sm:text-3xl text-ocheto-green-700 leading-none">
                Con cariño, el equipo Ocheto 🐻☕
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div variants={ctaVariants} className="mt-10">
              <Link
                to="/nosotros"
                className="group inline-flex items-center gap-2 text-ocheto-green-700 font-semibold text-base sm:text-lg relative pb-1"
              >
                <span className="relative">
                  Conoce más sobre nosotros
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                    style={{
                      background:
                        'linear-gradient(90deg, hsl(var(--ocheto-green-700)), hsl(var(--ocheto-caramel-500)))',
                    }}
                  />
                </span>
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-500 ease-out group-hover:translate-x-1.5"
                  strokeWidth={2.5}
                />
              </Link>
            </motion.div>

            {/* Desktop-only Quote icon footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="hidden lg:flex items-center gap-2 mt-12 text-ocheto-green-700/40"
            >
              <Quote className="h-4 w-4" strokeWidth={2.5} />
              <span className="text-xs uppercase tracking-[0.3em] font-semibold">
                Manifiesto Ocheto
              </span>
            </motion.div>
          </motion.div>

          {/* ====================================================== */}
          {/* RIGHT COLUMN — 40% Visual Composition                  */}
          {/* ====================================================== */}
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
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
                <CoffeeBean size={42} fill="hsl(var(--ocheto-coffee-700))" />
              </motion.div>

              <motion.div
                variants={floatSlow(0.4, 10, 8, 6)}
                initial="initial"
                animate="animate"
                className="absolute top-1/3 -right-3 z-20"
                style={{ filter: 'drop-shadow(0 8px 12px hsl(var(--ocheto-coffee-900) / 0.2))' }}
              >
                <CoffeeBean size={32} fill="hsl(var(--ocheto-coffee-900))" />
              </motion.div>

              <motion.div
                variants={floatBean(0.8, 8, 4.5)}
                initial="initial"
                animate="animate"
                className="absolute bottom-12 -left-5 z-20"
                style={{ filter: 'drop-shadow(0 8px 12px hsl(var(--ocheto-coffee-900) / 0.2))' }}
              >
                <CoffeeBean size={36} fill="hsl(var(--ocheto-caramel-600, 28 70% 50%))" />
              </motion.div>

              <motion.div
                variants={floatSlow(1.2, 7, 6, 5.5)}
                initial="initial"
                animate="animate"
                className="absolute bottom-2 right-6 z-20"
                style={{ filter: 'drop-shadow(0 8px 12px hsl(var(--ocheto-coffee-900) / 0.2))' }}
              >
                <CoffeeBean size={26} fill="hsl(var(--ocheto-green-700))" />
              </motion.div>

              {/* ===== MAIN IMAGE ===== */}
              <motion.div
                variants={imageVariants}
                className="absolute inset-0 z-10 flex items-center justify-center p-8"
              >
                <motion.img
                  src="/assets/vaso-ocheto-full.png"
                  alt="Vaso Ocheto con logo"
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
                      className="relative bg-white rounded-2xl px-4 py-3 shadow-[0_12px_30px_-8px_hsl(var(--ocheto-coffee-900)/0.25)] border border-ocheto-cream-200 min-w-[140px] backdrop-blur-sm inner-highlight"
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
                  ease: [0.16, 1, 0.3, 1],
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

              {/* ===== LATITUDE / LOCATION BADGE ===== */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: 1.1 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-ocheto-coffee-900 text-ocheto-cream-50 rounded-full shadow-lg">
                  <span
                    aria-hidden="true"
                    className="block w-2 h-2 rounded-full bg-ocheto-gold-500 animate-pulse"
                  />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
                    3 tiendas en La Paz
                  </span>
                </div>
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
                Zuazo
              </span>
              <span className="flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-ocheto-caramel-500" />
                Illampu
              </span>
              <span className="flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-ocheto-gold-500" />
                Oruro
              </span>
            </motion.div>
          </div>
        </div>

        {/* ===== BOTTOM MARQUEE STRIP (DATA-DRIVEN) ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 lg:mt-32 border-t border-b border-ocheto-green-700/15 py-5 overflow-hidden"
        >
          <div className="marquee">
            <div className="marquee-track">
              {[...STATS, ...STATS, ...STATS].map((stat, i) => (
                <div
                  key={`${stat.label}-${i}`}
                  className="flex items-center gap-4 flex-shrink-0"
                >
                  <span
                    aria-hidden="true"
                    className="block w-1.5 h-1.5 rounded-full bg-ocheto-caramel-500"
                  />
                  <span className="font-fraunces italic font-light text-ocheto-coffee-900 text-2xl sm:text-3xl tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-ocheto-coffee-700">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
