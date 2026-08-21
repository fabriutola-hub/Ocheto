import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import {
  Mountain,
  Award,
  Flame,
  ArrowRight,
  Sparkles,
  Quote,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

interface StatDef {
  icon: LucideIcon;
  value: string;
  label: string;
  detail: string;
  color: string;
}

const STATS: StatDef[] = [
  {
    icon: Award,
    value: '100%',
    label: 'Calidad',
    detail: 'Ingredientes seleccionados',
    color: '#1B5E20',
  },
  {
    icon: Flame,
    value: '3',
    label: 'Tiendas',
    detail: 'En La Paz',
    color: '#E8B923',
  },
  {
    icon: Mountain,
    value: '∞',
    label: 'Detalles',
    detail: 'En cada bolsa',
    color: '#D4A574',
  },
];

export default function ShopStory() {
  return (
    <section
      id="shop-story"
      className="relative w-full overflow-hidden bg-gradient-to-b from-ocheto-cream-50 via-white to-ocheto-cream-50 section-padding"
    >
      {/* Decorative dotted bg */}
      <div
        aria-hidden
        className="absolute inset-0 dots-bg opacity-40 pointer-events-none"
      />
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute top-32 -right-32 w-[420px] h-[420px] rounded-full bg-ocheto-green-400/12 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-32 -left-32 w-[440px] h-[440px] rounded-full bg-ocheto-caramel-500/12 blur-3xl pointer-events-none"
      />

      <div className="relative container-ocheto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* ===== Left: Image collage ===== */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="lg:col-span-6 xl:col-span-6 relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main image — framed editorial photo */}
              <motion.div
                variants={fadeUp}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-ocheto-green-900/25 border border-ocheto-cream-200/60"
              >
                <motion.img
                  src="/assets/cafe-bolsa-montana.jpg"
                  alt="Bolsa de café Ocheto en la montaña"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ scale: 1.08 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  draggable={false}
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(20,40,20,0.0) 0%, rgba(20,40,20,0.05) 50%, rgba(20,40,20,0.5) 100%)',
                  }}
                />
                {/* Origin caption */}
                <motion.div
                  variants={fadeUp}
                  className="absolute bottom-0 left-0 right-0 p-5 sm:p-7"
                >
                  <p className="font-inter text-[10px] sm:text-xs uppercase tracking-[0.28em] font-bold text-ocheto-gold-500 mb-1.5">
                    · Ocheto Coffee ·
                  </p>
                  <p className="font-fraunces italic font-medium text-white text-2xl sm:text-3xl leading-tight">
                    Hecho con cariño, bolsa a bolsa.
                  </p>
                </motion.div>

                {/* Top-right floating note */}
                <motion.div
                  variants={fadeUp}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/30"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 rounded-full bg-ocheto-green-700 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-ocheto-green-700" />
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-ocheto-green-700">
                    Temporada activa
                  </span>
                </motion.div>
              </motion.div>

              {/* Floating small card — handwritten quote */}
              <motion.div
                variants={fadeUp}
                animate={{ y: [0, -10, 0], rotate: [-3, 1, -3] }}
                transition={{
                  y: {
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut' as const,
                  },
                  rotate: {
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut' as const,
                  },
                }}
                className="absolute -top-6 -left-3 sm:-left-8 max-w-[230px] sm:max-w-[260px] p-4 sm:p-5 rounded-2xl bg-ocheto-gold-500 shadow-2xl shadow-ocheto-gold-500/30 z-10 border border-white/30"
              >
                <Quote
                  className="absolute -top-2 -left-2 w-7 h-7 p-1 rounded-full text-ocheto-cream-50"
                  style={{ backgroundColor: 'hsl(var(--ocheto-coffee-900))' }}
                  fill="currentColor"
                  strokeWidth={0}
                />
                <p className="font-caveat text-ocheto-coffee-900 text-lg sm:text-xl leading-tight">
                  "Los pequeños detalles hacen especial cada momento"
                </p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] font-bold text-ocheto-coffee-900/70">
                  — El equipo Ocheto
                </p>
              </motion.div>

              {/* Floating secondary image (cup) */}
              <motion.div
                variants={fadeUp}
                animate={{ y: [0, 10, 0], rotate: [2, -2, 2] }}
                transition={{
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut' as const,
                    delay: 0.5,
                  },
                  rotate: {
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut' as const,
                  },
                }}
                className="absolute -bottom-8 -right-3 sm:-right-10 w-[42%] sm:w-[46%] lg:w-[52%] aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-ocheto-green-900/30 border-[6px] border-white z-10"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--ocheto-caramel-500) / 0.25), hsl(var(--ocheto-gold-500) / 0.15))',
                }}
              >
                <img
                  src="/assets/vaso-espresso-tirado.png"
                  alt="Espresso sirviéndose en taza Ocheto"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at center, transparent 30%, rgba(20,40,20,0.2) 100%)',
                  }}
                />
              </motion.div>

              {/* Vertical decorative line */}
              <div className="hidden lg:block absolute -left-12 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-ocheto-green-700/30 to-transparent" />
            </div>
          </motion.div>

          {/* ===== Right: Story text ===== */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="lg:col-span-6 xl:col-span-6 relative order-1 lg:order-2"
          >
            {/* Eyebrow */}
            <motion.span
              variants={fadeUp}
              className="inline-block font-inter text-xs sm:text-sm font-semibold uppercase tracking-[0.32em] text-ocheto-green-700 mb-4 sm:mb-5"
            >
              <span className="inline-block w-6 h-px bg-ocheto-green-700 align-middle mr-2" />
              De Ocheto a tu mesa
              <span className="inline-block w-6 h-px bg-ocheto-green-700 align-middle ml-2" />
            </motion.span>

            {/* Big title */}
            <motion.h2
              variants={fadeUp}
              className="font-fraunces italic font-medium text-ocheto-coffee-900 leading-[1.02] tracking-tight text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem]"
            >
              De Ocheto a{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-ocheto-green-700">tu cocina</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-ocheto-caramel-500/40 -z-0 rounded-sm"
                />
              </span>
              .
            </motion.h2>

            {/* Caveat intro */}
            <motion.p
              variants={fadeUp}
              className="font-caveat text-ocheto-caramel-500 text-2xl sm:text-3xl mt-3 leading-none"
            >
              un viaje que vale la pena contar
            </motion.p>

            {/* Divider */}
            <motion.div
              variants={fadeUp}
              className="mt-6 flex items-center gap-3"
            >
              <span className="block h-[2px] w-14 rounded-full bg-gradient-to-r from-ocheto-green-700 to-transparent" />
              <Sparkles className="w-4 h-4 text-ocheto-gold-500" />
              <span className="block h-[2px] w-6 rounded-full bg-gradient-to-r from-ocheto-gold-500 to-transparent" />
            </motion.div>

            {/* Story paragraphs */}
            <motion.div variants={fadeUp} className="mt-7 space-y-4">
              <p className="font-inter text-base sm:text-lg text-ocheto-coffee-700/85 leading-relaxed">
                Cada bolsa de Ocheto se prepara con los mismos ingredientes de
                calidad y la misma dedicación que servimos en cada tienda.
                Cuidamos cada paso para que la experiencia llegue completa a tu
                cocina.
              </p>
              <p className="font-inter text-base sm:text-lg text-ocheto-coffee-700/85 leading-relaxed">
                Seleccionamos los productos a mano, los empacamos con cuidado y
                los preparamos para que lleguen frescos a tu mesa. Cero
                inventarios enormes, cero productos de meses: solo lo fresco, lo
                honesto, lo que nosotros mismos tomamos.
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4"
            >
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -3 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="relative group p-3 sm:p-4 rounded-2xl bg-white border border-ocheto-cream-200/70 hover:border-ocheto-green-700/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full mb-2"
                      style={{
                        backgroundColor: `${stat.color}15`,
                        border: `1.5px solid ${stat.color}30`,
                      }}
                    >
                      <Icon
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        strokeWidth={2.2}
                        style={{ color: stat.color }}
                      />
                    </div>
                    <p
                      className="font-fraunces font-black italic text-2xl sm:text-3xl leading-none"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-ocheto-coffee-900">
                      {stat.label}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-ocheto-coffee-700/60 mt-0.5">
                      {stat.detail}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link
                to="/nosotros"
                className="btn-primary group text-sm sm:text-base px-6 py-3"
              >
                <span>Conoce nuestra historia</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-ocheto-coffee-900 hover:text-ocheto-green-700 transition-colors group"
              >
                Ver el menú de la cafetería
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
