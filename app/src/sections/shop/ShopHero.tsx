import { EASE, useInfiniteAnimation } from '@/shared/motion';
import { useRef, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ShoppingBag, Truck, Coffee, Sparkles, ArrowRight, Leaf, Package } from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
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

const floatA: Variants = {
  initial: { y: 0, rotate: -3 },
  animate: {
    y: [-10, 12, -10],
    rotate: [-3, 4, -3],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
};

const floatB: Variants = {
  initial: { y: 0, rotate: 4 },
  animate: {
    y: [10, -12, 10],
    rotate: [4, -4, 4],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
  },
};

const floatC: Variants = {
  initial: { y: 0, rotate: -2 },
  animate: {
    y: [-12, 14, -12],
    rotate: [-2, 5, -2],
    transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 },
  },
};

const STATS = [
  { icon: Truck, label: 'Retiro en tienda', detail: 'Federico, Oruro, Illampu', color: 'hsl(var(--ocheto-green-700))' },
  { icon: Package, label: 'Tostado semanal', detail: 'Fresco, trazable', color: 'hsl(var(--ocheto-caramel-500))' },
  { icon: Sparkles, label: 'WhatsApp', detail: 'Coordinas al momento', color: 'hsl(var(--ocheto-gold-500))' },
];

export default function ShopHero() {
  const ref = useRef<HTMLElement>(null);
  const animateInfinite = useInfiniteAnimation(ref);

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
      className="relative w-full min-h-[85vh] sm:min-h-[90vh] overflow-hidden bg-[hsl(var(--ocheto-cream-50))]"
      aria-label="Hero de la tienda Ocheto"
    >
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'hsl(var(--ocheto-green-400) / 0.08)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'hsl(var(--ocheto-caramel-500) / 0.08)' }}
      />

      <div className="relative z-10 min-h-[85vh] sm:min-h-[90vh] flex items-center pt-20 sm:pt-24 pb-12">
        <div className="container-ocheto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: text content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 xl:col-span-7 text-center lg:text-left"
            >
              {/* Eyebrow badge */}
              <motion.div
                variants={fadeInUp}
                className="mb-5 flex justify-center lg:justify-start"
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[hsl(var(--ocheto-green-700)/0.08)] border border-[hsl(var(--ocheto-green-700)/0.15)]">
                  <ShoppingBag className="w-3.5 h-3.5 text-[hsl(var(--ocheto-green-700))]" strokeWidth={2.5} />
                  <span className="text-[10px] sm:text-xs tracking-[0.28em] font-bold uppercase text-[hsl(var(--ocheto-green-700))]">
                    Tienda Online
                  </span>
                </div>
              </motion.div>

              {/* Handwritten intro */}
              <motion.span
                variants={fadeInUp}
                className="block font-caveat text-[hsl(var(--ocheto-caramel-600))] text-3xl sm:text-4xl md:text-5xl -rotate-1 leading-none mb-2"
              >
                directo desde La Paz
              </motion.span>

              {/* Big title */}
              <motion.h1
                variants={fadeInUp}
                className="font-fraunces font-black italic text-[hsl(var(--ocheto-coffee-900))] leading-[0.92] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]"
              >
                <span className="relative inline-block">
                  <span className="relative z-10 text-[hsl(var(--ocheto-green-700))]">Ocheto</span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-2 h-3 sm:h-4 bg-[hsl(var(--ocheto-gold-500)/0.35)] -z-0 rounded-sm"
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
                <span className="block h-[2px] w-16 rounded-full bg-gradient-to-r from-[hsl(var(--ocheto-green-700))] via-[hsl(var(--ocheto-caramel-500))] to-transparent" />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="mt-5 lg:mt-6 max-w-xl mx-auto lg:mx-0 text-[hsl(var(--ocheto-coffee-700)/0.85)] text-base sm:text-lg md:text-xl leading-relaxed font-light"
              >
                Granos tostados cada semana y merch. Retiro en tienda o coordinación
                por WhatsApp. Sin humo: fresco y trazable.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={fadeInUp}
                className="mt-8 lg:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  type="button"
                  onClick={handleScrollToGrid}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold text-sm sm:text-base bg-[hsl(var(--ocheto-green-700))] text-[hsl(var(--ocheto-cream-50))] shadow-[0_8px_24px_-8px_hsl(var(--ocheto-green-900)/0.5)] hover:shadow-[0_12px_32px_-8px_hsl(var(--ocheto-green-900)/0.6)] transition-all duration-300"
                  aria-label="Ver productos"
                >
                  Ver productos
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>

                <motion.a
                  href="#shop-story"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-sm sm:text-base border-2 border-[hsl(var(--ocheto-coffee-900)/0.2)] text-[hsl(var(--ocheto-coffee-900))] hover:bg-[hsl(var(--ocheto-coffee-900))] hover:text-[hsl(var(--ocheto-cream-50))] transition-all duration-300"
                >
                  Nuestra historia
                </motion.a>
              </motion.div>

              {/* Trust bullets */}
              <motion.div
                variants={fadeInUp}
                className="mt-7 lg:mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm text-[hsl(var(--ocheto-coffee-700)/0.7)] font-medium"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ocheto-green-700))]" />
                  Pago contra entrega
                </span>
                <span className="hidden sm:inline-block h-3 w-px bg-[hsl(var(--ocheto-coffee-700)/0.2)]" />
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ocheto-caramel-500))]" />
                  Empaque eco-friendly
                </span>
                <span className="hidden sm:inline-block h-3 w-px bg-[hsl(var(--ocheto-coffee-700)/0.2)]" />
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ocheto-gold-500))]" />
                  Soporte por WhatsApp
                </span>
              </motion.div>
            </motion.div>

            {/* Right: floating products */}
            <div className="lg:col-span-5 xl:col-span-5 relative h-[340px] sm:h-[440px] md:h-[520px] lg:h-[540px] mt-4 lg:mt-0">
              {/* Glow halo */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, hsl(var(--ocheto-caramel-500) / 0.2) 0%, transparent 70%)' }}
              />

              {/* Center hero product */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] sm:w-[52%] md:w-[50%] lg:w-[55%] z-[3]"
              >
                <motion.div
                  animate={animateInfinite ? { y: [0, -12, 0], rotate: [-1, 1.5, -1] } : undefined}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative will-change-transform"
                >
                  <div className="relative aspect-square">
                    <img
                      src="/assets/grain.webp"
                      alt="Granos de café Ocheto"
                      className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(60,30,10,0.25)]"
                      draggable={false}
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating product 1 */}
              <motion.div
                variants={floatA}
                initial="initial"
                animate={animateInfinite ? 'animate' : 'initial'}
                className="absolute top-[6%] left-[4%] sm:left-[8%] w-[20%] sm:w-[22%] md:w-[20%] z-[4]"
              >
                <motion.img
                  src="/assets/cup-with-shadow.webp"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-auto object-contain drop-shadow-[0_10px_22px_rgba(60,30,10,0.2)]"
                  draggable={false}
                />
              </motion.div>

              {/* Floating product 2 */}
              <motion.div
                variants={floatB}
                initial="initial"
                animate={animateInfinite ? 'animate' : 'initial'}
                className="absolute top-[14%] right-[4%] sm:right-[8%] w-[20%] sm:w-[22%] md:w-[20%] z-[4]"
              >
                <motion.img
                  src="/assets/vaso-verde.webp"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(60,30,10,0.2)]"
                  draggable={false}
                />
              </motion.div>

              {/* Floating product 3 */}
              <motion.div
                variants={floatC}
                initial="initial"
                animate={animateInfinite ? 'animate' : 'initial'}
                className="absolute bottom-[8%] left-[2%] sm:left-[4%] w-[24%] sm:w-[26%] md:w-[22%] z-[4]"
              >
                <motion.img
                  src="/assets/vaso-cafe.webp"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(60,30,10,0.2)]"
                  draggable={false}
                />
              </motion.div>

              {/* Floating product 4 */}
              <motion.div
                variants={floatA}
                initial="initial"
                animate={animateInfinite ? 'animate' : 'initial'}
                className="absolute bottom-[8%] right-[6%] sm:right-[10%] w-[18%] sm:w-[20%] md:w-[18%] z-[4]"
              >
                <motion.img
                  src="/assets/grain.webp"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(60,30,10,0.2)]"
                  draggable={false}
                />
              </motion.div>

              {/* Decorative badge */}
              <motion.div
                animate={animateInfinite ? { y: [0, -6, 0], rotate: [0, 3, 0] } : undefined}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute top-[4%] right-[18%] z-[5] hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--ocheto-green-700)/0.95)] backdrop-blur-sm shadow-lg border border-white/15"
              >
                <Coffee className="w-3 h-3 text-[hsl(var(--ocheto-gold-500))]" strokeWidth={2.5} />
                <span className="text-[10px] font-bold tracking-[0.18em] text-[hsl(var(--ocheto-cream-50))] uppercase">
                  Specialty
                </span>
              </motion.div>

              {/* Decorative badge 2 */}
              <motion.div
                animate={animateInfinite ? { y: [0, 6, 0], rotate: [0, -3, 0] } : undefined}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
                className="absolute bottom-[18%] right-[4%] z-[5] hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--ocheto-cream-50)/0.95)] backdrop-blur-sm shadow-lg border border-[hsl(var(--ocheto-green-700)/0.15)]"
              >
                <Leaf className="w-3 h-3 text-[hsl(var(--ocheto-green-700))]" strokeWidth={2.5} />
                <span className="text-[10px] font-bold tracking-[0.18em] text-[hsl(var(--ocheto-green-700))] uppercase">
                  Yungas
                </span>
              </motion.div>

              {/* Caveat floating tag */}
              <motion.span
                animate={animateInfinite ? { y: [0, -5, 0], rotate: [-5, -1, -5] } : undefined}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[6%] left-[30%] z-[5] font-caveat text-[hsl(var(--ocheto-caramel-600))] text-xl sm:text-2xl lg:text-3xl hidden sm:block select-none pointer-events-none"
                style={{ textShadow: '0 2px 8px rgba(60,30,10,0.1)' }}
              >
                ¡recién tostado!
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom Stats Strip ===== */}
      <div className="relative z-10 bg-[hsl(var(--ocheto-green-950))] text-[hsl(var(--ocheto-cream-50))]">
        <div className="container-ocheto py-5 sm:py-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
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
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                  }}
                  className={`flex items-center justify-center sm:justify-start gap-3 px-2 sm:px-6 ${
                    i !== 0 ? 'sm:border-l sm:border-white/10' : ''
                  }`}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-sm flex-shrink-0"
                    style={{
                      backgroundColor: `${stat.color}20`,
                      border: `1.5px solid ${stat.color}50`,
                    }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} style={{ color: stat.color }} />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-bold text-[hsl(var(--ocheto-cream-50)/0.6)]">
                      {stat.label}
                    </p>
                    <p className="font-fraunces font-black italic text-base sm:text-lg text-[hsl(var(--ocheto-cream-50))] leading-tight">
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
