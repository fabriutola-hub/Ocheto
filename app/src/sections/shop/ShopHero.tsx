import { useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { ShoppingBag, Sparkles, ArrowRight, Coffee, Leaf, Truck } from 'lucide-react';

const fadeInUp: Variants = {
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
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const floatBeanA: Variants = {
  initial: { y: 0, rotate: -8 },
  animate: {
    y: [-14, 16, -14],
    rotate: [-8, 6, -8],
    transition: {
      duration: 6.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const floatBeanB: Variants = {
  initial: { y: 0, rotate: 5 },
  animate: {
    y: [12, -14, 12],
    rotate: [5, -6, 5],
    transition: {
      duration: 7.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: 0.6,
    },
  },
};

const floatBeanC: Variants = {
  initial: { y: 0, rotate: -3 },
  animate: {
    y: [-10, 18, -10],
    rotate: [-3, 5, -3],
    transition: {
      duration: 5.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: 1.2,
    },
  },
};

const STATS = [
  {
    icon: Truck,
    label: 'Envío gratis',
    detail: '+Bs 200',
    color: '#D4A574',
  },
  {
    icon: Coffee,
    label: 'Tostado semanal',
    detail: 'Cada lunes',
    color: '#1B5E20',
  },
  {
    icon: Sparkles,
    label: 'Garantía 100%',
    detail: 'Calidad specialty',
    color: '#E8B923',
  },
];

export default function ShopHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const beansY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

  const handleScrollToGrid = useCallback(() => {
    const target = document.getElementById('shop-grid');
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[88vh] sm:min-h-[92vh] overflow-hidden bg-ocheto-cream-50"
      aria-label="Hero de la tienda Ocheto"
    >
      {/* Parallax background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <img
          src="/assets/cafe-bolsa-montana.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-[120%] object-cover scale-110 opacity-90"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(250, 247, 240, 0.88) 0%, rgba(250, 247, 240, 0.7) 35%, rgba(250, 247, 240, 0.85) 70%, rgba(250, 247, 240, 0.98) 100%)',
          }}
        />
      </motion.div>

      {/* Decorative dotted pattern */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] dots-bg opacity-50 pointer-events-none"
      />

      {/* Decorative glow blobs */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-gold-500) / 0.18) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-green-400) / 0.18) 0%, transparent 70%)',
        }}
      />

      {/* Floating grain texture (subtle) */}
      <motion.div
        style={{ y: beansY }}
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.1] mix-blend-multiply"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'url(/assets/grain.png)',
            backgroundSize: '320px 320px',
            backgroundRepeat: 'repeat',
          }}
        />
      </motion.div>

      {/* ===== Content ===== */}
      <div className="relative z-10 min-h-[88vh] sm:min-h-[92vh] flex items-center pt-20 sm:pt-24 pb-12">
        <div className="container-ocheto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: text content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              style={{ y: titleY }}
              className="lg:col-span-7 xl:col-span-7 text-center lg:text-left"
            >
              {/* Eyebrow */}
              <motion.div
                variants={fadeInUp}
                className="mb-5 flex justify-center lg:justify-start"
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-ocheto-green-700/20 shadow-sm">
                  <ShoppingBag
                    className="w-3.5 h-3.5 text-ocheto-green-700"
                    strokeWidth={2.5}
                  />
                  <span className="text-[10px] sm:text-xs tracking-[0.28em] font-bold uppercase text-ocheto-green-700">
                    Tienda Online
                  </span>
                </div>
              </motion.div>

              {/* Handwritten intro */}
              <motion.span
                variants={fadeInUp}
                className="block font-caveat text-ocheto-caramel-500 text-3xl sm:text-4xl md:text-5xl -rotate-2 leading-none mb-2"
              >
                directo desde La Paz
              </motion.span>

              {/* Big title */}
              <motion.h1
                variants={fadeInUp}
                className="font-fraunces font-black italic text-ocheto-coffee-900 leading-[0.92] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]"
              >
                Lleva{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-ocheto-green-700">Ocheto</span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-2 h-3 sm:h-4 bg-ocheto-gold-500/40 -z-0 rounded-sm"
                  />
                </span>
                <br />
                a tu casa.
              </motion.h1>

              {/* Divider */}
              <motion.div
                variants={fadeInUp}
                className="mt-5 flex justify-center lg:justify-start"
              >
                <span className="block h-[2px] w-16 rounded-full bg-gradient-to-r from-ocheto-green-700 via-ocheto-caramel-500 to-transparent" />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="mt-5 lg:mt-6 max-w-xl mx-auto lg:mx-0 text-ocheto-coffee-700/85 text-base sm:text-lg md:text-xl leading-relaxed font-light"
              >
                Granos recién tostados, accesorios y merch. Envíos a toda Bolivia,
                con el cariño de siempre.
              </motion.p>

              {/* CTA */}
              <motion.div
                variants={fadeInUp}
                className="mt-8 lg:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  type="button"
                  onClick={handleScrollToGrid}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary group text-sm sm:text-base px-7 py-3.5"
                  aria-label="Ver productos"
                >
                  Ver productos
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>

                <motion.a
                  href="#shop-story"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-sm sm:text-base border-2 border-ocheto-coffee-900/30 text-ocheto-coffee-900 hover:bg-ocheto-coffee-900 hover:text-ocheto-cream-50 transition-all duration-300"
                >
                  Nuestra historia
                </motion.a>
              </motion.div>

              {/* Trust bullets */}
              <motion.div
                variants={fadeInUp}
                className="mt-7 lg:mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm text-ocheto-coffee-700/75 font-medium"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-ocheto-green-700" />
                  Pago contra entrega
                </span>
                <span className="hidden sm:inline-block h-3 w-px bg-ocheto-coffee-700/25" />
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-ocheto-caramel-500" />
                  Empaque eco-friendly
                </span>
                <span className="hidden sm:inline-block h-3 w-px bg-ocheto-coffee-700/25" />
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-ocheto-gold-500" />
                  Soporte por WhatsApp
                </span>
              </motion.div>
            </motion.div>

            {/* Right: floating products */}
            <div className="lg:col-span-5 xl:col-span-5 relative h-[340px] sm:h-[460px] md:h-[540px] lg:h-[560px] xl:h-[620px] mt-4 lg:mt-0">
              {/* Glow halo */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-3xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, hsl(var(--ocheto-caramel-500) / 0.35) 0%, transparent 70%)',
                }}
              />

              {/* Floating grain bag (center hero) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] sm:w-[52%] md:w-[50%] lg:w-[55%] z-[3]"
              >
                <motion.div
                  animate={{ y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: 'easeInOut' as const,
                  }}
                  className="relative will-change-transform"
                >
                  <div className="relative aspect-square">
                    <img
                      src="/assets/vaso-ocheto-full.png"
                      alt="Vaso Ocheto con logo"
                      className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(60,30,10,0.45)]"
                      draggable={false}
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating bean (top-left) */}
              <motion.div
                variants={floatBeanA}
                initial="initial"
                animate="animate"
                className="absolute top-[6%] left-[2%] sm:left-[6%] md:left-[8%] w-[20%] sm:w-[22%] md:w-[20%] z-[4]"
              >
                <motion.img
                  src="/assets/grain.png"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-auto object-contain drop-shadow-[0_10px_22px_rgba(60,30,10,0.35)] opacity-90"
                  draggable={false}
                />
              </motion.div>

              {/* Floating cup (top-right) */}
              <motion.div
                variants={floatBeanB}
                initial="initial"
                animate="animate"
                className="absolute top-[12%] right-[2%] sm:right-[5%] w-[20%] sm:w-[22%] md:w-[20%] z-[4]"
              >
                <motion.img
                  src="/assets/tazas-alfajor.jpg"
                  alt="Tazas Ocheto con bolsa de café"
                  className="w-full h-auto object-contain drop-shadow-[0_14px_28px_rgba(60,30,10,0.4)]"
                  draggable={false}
                />
              </motion.div>

              {/* Floating glass (bottom-left) */}
              <motion.div
                variants={floatBeanC}
                initial="initial"
                animate="animate"
                className="absolute bottom-[8%] left-[0%] sm:left-[2%] md:left-[4%] w-[24%] sm:w-[26%] md:w-[22%] z-[4]"
              >
                <motion.img
                  src="/assets/frappe-frutilla.png"
                  alt="Frappé de frutilla"
                  className="w-full h-auto object-contain drop-shadow-[0_14px_28px_rgba(60,30,10,0.4)]"
                  draggable={false}
                />
              </motion.div>

              {/* Floating green (bottom-right) */}
              <motion.div
                variants={floatBeanA}
                initial="initial"
                animate="animate"
                className="absolute bottom-[6%] right-[4%] sm:right-[8%] md:right-[10%] w-[18%] sm:w-[20%] md:w-[18%] z-[4]"
              >
                <motion.img
                  src="/assets/frappe-mango.png"
                  alt="Frappé de mango"
                  className="w-full h-auto object-contain drop-shadow-[0_14px_28px_rgba(60,30,10,0.4)]"
                  draggable={false}
                />
              </motion.div>

              {/* Decorative handwritten badge */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                  delay: 0.8,
                }}
                className="absolute top-[2%] right-[20%] z-[5] hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ocheto-green-700/95 backdrop-blur-sm shadow-lg border border-white/15"
              >
                <Coffee className="w-3 h-3 text-ocheto-gold-500" strokeWidth={2.5} />
                <span className="text-[10px] font-bold tracking-[0.18em] text-ocheto-cream-50 uppercase">
                  Specialty
                </span>
              </motion.div>

              {/* Decorative handwritten badge 2 */}
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                  delay: 1.4,
                }}
                className="absolute bottom-[16%] right-[2%] z-[5] hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ocheto-cream-50/95 backdrop-blur-sm shadow-lg border border-ocheto-green-700/15"
              >
                <Leaf className="w-3 h-3 text-ocheto-green-700" strokeWidth={2.5} />
                <span className="text-[10px] font-bold tracking-[0.18em] text-ocheto-green-700 uppercase">
                  Hecho con cariño
                </span>
              </motion.div>

              {/* Caveat floating tag */}
              <motion.span
                animate={{ y: [0, -6, 0], rotate: [-6, -2, -6] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                }}
                className="absolute bottom-[4%] left-[28%] z-[5] font-caveat text-ocheto-caramel-500 text-xl sm:text-2xl lg:text-3xl hidden sm:block select-none pointer-events-none"
                style={{ textShadow: '0 2px 8px rgba(60,30,10,0.15)' }}
              >
                ¡recién tostado!
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom Stats Strip ===== */}
      <div className="relative z-10 bg-gradient-to-r from-ocheto-green-950 via-ocheto-green-900 to-ocheto-green-950 text-ocheto-cream-50">
        <div className="container-ocheto py-5 sm:py-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1, delayChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-0"
          >
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className={`flex items-center justify-center sm:justify-start gap-3 px-2 sm:px-6 ${
                    i !== 0 ? 'sm:border-l sm:border-white/15' : ''
                  }`}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-sm flex-shrink-0"
                    style={{
                      backgroundColor: `${stat.color}25`,
                      border: `1.5px solid ${stat.color}60`,
                    }}
                  >
                    <Icon
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      strokeWidth={2.2}
                      style={{ color: stat.color }}
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-bold text-ocheto-cream-50/70">
                      {stat.label}
                    </p>
                    <p className="font-fraunces font-black italic text-base sm:text-lg text-ocheto-cream-50 leading-tight">
                      {stat.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
