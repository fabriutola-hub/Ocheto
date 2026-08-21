import { EASE } from '@/shared/motion';
import { motion, type Variants } from 'framer-motion';
import { Leaf, Flame, Users, Recycle, ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: -40 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

interface Value {
  icon: LucideIcon;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  bgGradient: string;
}

const VALUES: Value[] = [
  {
    icon: Leaf,
    emoji: '🌱',
    title: 'Origen consciente',
    subtitle: 'Directo del productor',
    description:
      'Trabajamos directamente con pequeños productores locales de los Yungas paceños. Sin intermediarios, con relaciones que crecen cosecha a cosecha.',
    accent: 'hsl(var(--ocheto-green-700))',
    bgGradient:
      'linear-gradient(135deg, hsl(var(--ocheto-green-700) / 0.12) 0%, hsl(var(--ocheto-green-600) / 0.06) 100%)',
  },
  {
    icon: Flame,
    emoji: '🔥',
    title: 'Tueste artesanal',
    subtitle: 'Cada lote, cada semana',
    description:
      'Tostamos en pequeños lotes cada semana en nuestro horno Probat. Cada perfil está diseñado para resaltar las notas únicas de cada finca.',
    accent: 'hsl(var(--ocheto-caramel-500))',
    bgGradient:
      'linear-gradient(135deg, hsl(var(--ocheto-caramel-500) / 0.16) 0%, hsl(var(--ocheto-gold-500) / 0.06) 100%)',
  },
  {
    icon: Users,
    emoji: '🤝',
    title: 'Comunidad',
    subtitle: 'Paceños de corazón',
    description:
      'Somos parte del tejido paceño. Cada café es una excusa para conversar, encontrarnos y construir algo juntos en las alturas.',
    accent: 'hsl(var(--ocheto-gold-500))',
    bgGradient:
      'linear-gradient(135deg, hsl(var(--ocheto-gold-500) / 0.14) 0%, hsl(var(--ocheto-caramel-500) / 0.05) 100%)',
  },
  {
    icon: Recycle,
    emoji: '♻️',
    title: 'Sostenibilidad',
    subtitle: 'Cero desperdicio',
    description:
      'Empaque compostable, vaso reutilizable de regalo, cero desperdicio en barra. Cuidamos el planeta que nos regala los granos.',
    accent: 'hsl(var(--ocheto-matcha-500))',
    bgGradient:
      'linear-gradient(135deg, hsl(var(--ocheto-matcha-500) / 0.14) 0%, hsl(var(--ocheto-green-700) / 0.05) 100%)',
  },
];

interface ValueCardProps {
  value: Value;
  index: number;
  featured?: boolean;
}

function ValueCard({ value, index, featured = false }: ValueCardProps) {
  const Icon = value.icon;

  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { duration: 0.85, ease: EASE } },
      }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`group relative overflow-hidden rounded-3xl border border-ocheto-green-700/10 hover:border-ocheto-green-700/30 hover:shadow-[0_30px_70px_-20px_hsl(var(--ocheto-green-950)/0.25)] transition-all duration-500 ${
        featured ? 'lg:row-span-2 lg:col-span-1' : ''
      }`}
      style={{ background: value.bgGradient }}
    >
      {/* Decorative top-right corner emoji */}
      <div
        aria-hidden
        className="absolute -top-2 -right-2 text-6xl sm:text-7xl opacity-20 group-hover:opacity-40 group-hover:rotate-12 transition-all duration-700 select-none"
      >
        {value.emoji}
      </div>

      {/* Inner card */}
      <div
        className={`relative h-full bg-white/85 backdrop-blur-sm p-6 sm:p-7 lg:p-8 flex flex-col ${
          featured ? 'lg:min-h-[480px]' : 'min-h-[260px]'
        }`}
      >
        {/* Icon badge */}
        <motion.div
          whileHover={{ rotate: 14, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="relative shrink-0 mb-5 sm:mb-6"
        >
          <div
            className={`relative z-10 flex items-center justify-center rounded-2xl ${
              featured ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-14 h-14 sm:w-16 sm:h-16'
            }`}
            style={{
              background: `radial-gradient(circle at 30% 28%, ${value.accent} 0%, ${value.accent}b3 55%, ${value.accent}66 100%)`,
              boxShadow: `0 12px 28px -8px ${value.accent}aa, inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 -8px 18px rgba(0,0,0,0.22)`,
            }}
          >
            <Icon
              className={`text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] ${
                featured ? 'w-7 h-7 sm:w-9 sm:h-9' : 'w-6 h-6 sm:w-7 sm:h-7'
              }`}
              strokeWidth={1.75}
            />
          </div>
          <motion.span
            aria-hidden
            animate={{ scale: [1, 1.4], opacity: [0.45, 0] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeOut',
              delay: index * 0.3,
            }}
            className="absolute inset-0 rounded-2xl"
            style={{ border: `1.5px solid ${value.accent}` }}
          />
        </motion.div>

        {/* Subtitle */}
        <span
          className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-bold"
          style={{ color: value.accent }}
        >
          {value.subtitle}
        </span>

        {/* Title */}
        <h3
          className={`font-fraunces italic font-medium text-ocheto-coffee-900 mt-2 leading-[1.05] ${
            featured ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
          }`}
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
          }}
        >
          {value.title}
        </h3>

        {/* Description */}
        <p
          className={`mt-4 text-ocheto-coffee-700/85 leading-relaxed ${
            featured ? 'text-base sm:text-lg mt-6' : 'text-sm sm:text-[15px]'
          }`}
        >
          {value.description}
        </p>

        {/* Footer accent line */}
        <div className="mt-auto pt-6 flex items-center gap-3">
          <span
            aria-hidden
            className="block h-px flex-1 origin-left scale-x-100 group-hover:scale-x-150 transition-transform duration-700"
            style={{ background: value.accent, opacity: 0.4 }}
          />
          <ArrowUpRight
            className="w-4 h-4 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            style={{ color: value.accent }}
            strokeWidth={2.5}
          />
        </div>
      </div>
    </motion.article>
  );
}

export default function AboutValues() {
  const [featured, ...rest] = VALUES;

  return (
    <section
      id="about-values"
      className="relative w-full overflow-hidden bg-ocheto-cream-50 section-padding"
    >
      {/* Soft grain background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsl(var(--ocheto-green-700) / 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 right-0 w-[28rem] h-[28rem] rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--ocheto-caramel-500)) 0%, transparent 65%)',
          transform: 'translate(40%, -20%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-[32rem] h-[32rem] rounded-full opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--ocheto-green-700)) 0%, transparent 65%)',
          transform: 'translate(-40%, 30%)',
        }}
      />

      <div className="relative z-10 container-ocheto">
        {/* ============ HEADER ============ */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-4xl mx-auto text-center mb-14 sm:mb-20"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mb-6">
            <span aria-hidden className="block h-px w-10 sm:w-12 bg-ocheto-green-700/70" />
            <span className="text-ocheto-green-700 text-[10px] sm:text-xs font-bold uppercase tracking-[0.32em]">
              Lo que nos mueve
            </span>
            <span aria-hidden className="block h-px w-10 sm:w-12 bg-ocheto-green-700/70" />
          </motion.div>

          <motion.h2
            variants={headlineContainer}
            className="font-fraunces italic font-light text-ocheto-coffee-900 leading-[0.96] tracking-[-0.02em]"
            style={{
              fontSize: 'clamp(2.6rem, 7vw, 5.4rem)',
              fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0',
              perspective: '1000px',
            }}
          >
            {'Nuestros valores.'.split(' ').map((word, i) => (
              <motion.span
                key={word + i}
                variants={wordVariants}
                className="inline-block mr-[0.22em]"
                style={{ transformOrigin: '50% 100%' }}
              >
                {i === 1 ? <span className="text-ocheto-green-700">{word}</span> : word}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-base sm:text-lg text-ocheto-coffee-700/85 leading-relaxed max-w-2xl mx-auto"
          >
            Cuatro principios que viven en cada decisión, cada grano y cada taza que servimos.
          </motion.p>
        </motion.div>

        {/* ============ BENTO GRID ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 auto-rows-fr">
          {/* Featured big card (spans 2 rows on lg) */}
          <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <ValueCard value={featured} index={0} featured />
          </div>

          {/* Three smaller cards */}
          {rest.map((v, i) => (
            <div key={v.title}>
              <ValueCard value={v} index={i + 1} />
            </div>
          ))}
        </div>

        {/* ============ BOTTOM RIBBON ============ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="mt-14 sm:mt-20 flex flex-col items-center text-center"
        >
          <p className="font-caveat text-2xl sm:text-3xl text-ocheto-green-700 leading-none">
            valores que se sienten, se sirven, se comparten
          </p>
        </motion.div>
      </div>
    </section>
  );
}
