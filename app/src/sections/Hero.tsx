import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight, Star, MapPin, Coffee, Leaf } from 'lucide-react';
import CurvedTitle from '@/components/CurvedTitle';

const floatCupA: Variants = {
  initial: { y: 0, rotate: -4 },
  animate: {
    y: [-12, 14, -12],
    rotate: [-4, 6, -4],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const floatCupB: Variants = {
  initial: { y: 0, rotate: 3 },
  animate: {
    y: [10, -12, 10],
    rotate: [3, -5, 3],
    transition: {
      duration: 6.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const floatCupC: Variants = {
  initial: { y: 0, rotate: -2 },
  animate: {
    y: [-8, 16, -8],
    rotate: [-2, 4, -2],
    transition: {
      duration: 4.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const floatSecondary: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [0, -16, 0],
    rotate: [-2, 3, -2],
    transition: {
      duration: 5.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const grainDrift: Variants = {
  initial: { rotate: 0, scale: 1 },
  animate: {
    rotate: [0, 8, -4, 0],
    scale: [1, 1.04, 0.98, 1],
    transition: {
      duration: 22,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const glowPulse: Variants = {
  initial: { opacity: 0.35, scale: 0.9 },
  animate: {
    opacity: [0.35, 0.7, 0.35],
    scale: [0.9, 1.15, 0.9],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const badgeFloat: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [0, -10, 0],
    rotate: [0, 4, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 28 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen overflow-hidden bg-ocheto-green-950"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/wallaper_1.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--ocheto-green-950)/0.78)] via-[hsl(var(--ocheto-green-900)/0.72)] to-[hsl(var(--ocheto-green-950)/0.9)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--ocheto-gold-500)/0.12),transparent_55%)]" />
      </div>

      <motion.div
        variants={grainDrift}
        initial="initial"
        animate="animate"
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage: 'url(/assets/grain.png)',
          backgroundSize: '340px 340px',
          backgroundRepeat: 'repeat',
        }}
      />

      <motion.div
        variants={glowPulse}
        initial="initial"
        animate="animate"
        className="absolute top-1/2 right-[6%] -translate-y-1/2 z-[3] w-[60vw] h-[60vw] max-w-[760px] max-h-[760px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-gold-500) / 0.38) 0%, hsl(var(--ocheto-caramel-500) / 0.18) 35%, transparent 65%)',
        }}
      />
      <motion.div
        animate={{
          opacity: [0.25, 0.55, 0.25],
          scale: [0.95, 1.1, 0.95],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        }}
        className="absolute top-[18%] left-[10%] z-[3] w-[40vw] h-[40vw] max-w-[520px] max-h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-green-400) / 0.22) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center pt-24 sm:pt-28 lg:pt-20 pb-20 sm:pb-24 lg:pb-16">
        <div className="container-ocheto w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 lg:gap-6">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="relative z-30 w-full lg:w-[46%] xl:w-[44%] text-center lg:text-left"
            >
              <motion.div
                variants={fadeInUp}
                className="mb-5 sm:mb-6 flex justify-center lg:justify-start"
              >
              </motion.div>

              <motion.div variants={fadeInUp} className="relative">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut' as const,
                    delay: 1.4,
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="relative cursor-default will-change-transform"
                >
                  <CurvedTitle />
                </motion.div>
              </motion.div>

              <motion.h2
                variants={fadeInUp}
                className="font-caveat text-ocheto-caramel-500 text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl mt-1 lg:-mt-1 leading-none drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)]"
              >
                El café que te define
              </motion.h2>

              <motion.div
                variants={fadeInUp}
                className="mt-3 lg:mt-4 flex justify-center lg:justify-start"
              >
                <span className="block h-[2px] w-14 rounded-full bg-gradient-to-r from-ocheto-gold-500 via-ocheto-caramel-500 to-transparent" />
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="mt-5 lg:mt-6 max-w-md mx-auto lg:mx-0 text-white/85 text-sm sm:text-base md:text-[15px] lg:text-base xl:text-[17px] leading-relaxed font-light"
              >
                Cada taza es un ritual. Granos de los Yungas paceños, tostados
                en pequeños lotes cada semana, servidos con la calidez de la
                altura.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="mt-7 lg:mt-9 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <Link to="/menu" className="btn-primary group">
                    Descubre el Menú
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <Link to="/tienda" className="btn-outline-light group">
                    Nuestra Tienda
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                variants={fadeInLeft}
                className="mt-8 lg:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 sm:gap-x-5 gap-y-2.5 text-[11px] sm:text-xs text-white/75 font-medium"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-ocheto-gold-500 fill-current" />
                  <span className="text-white font-semibold">4.9</span>
                  <span className="text-white/55">· 2K reseñas</span>
                </span>
                <span className="hidden sm:inline-block h-3 w-px bg-white/20" />
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-ocheto-caramel-500" />
                  <span>2 ubicaciones</span>
                </span>
                <span className="hidden sm:inline-block h-3 w-px bg-white/20" />
                <span className="inline-flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-ocheto-caramel-500" />
                  <span>100% specialty</span>
                </span>
                <span className="hidden sm:inline-block h-3 w-px bg-white/20" />
                <span className="inline-flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[hsl(var(--ocheto-matcha-500))]" />
                  <span>Origen local</span>
                </span>
              </motion.div>
            </motion.div>

            <div className="relative w-full lg:w-[54%] xl:w-[56%] h-[340px] sm:h-[460px] md:h-[560px] lg:h-[640px] xl:h-[720px] mt-2 lg:mt-0">
              <motion.div
                variants={grainDrift}
                initial="initial"
                animate="animate"
                className="absolute -top-[15%] -left-[30%] w-[160%] h-[160%] opacity-[0.2] mix-blend-screen pointer-events-none z-[1]"
              >
                <img
                  src="/assets/grain.png"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-contain"
                />
              </motion.div>

              <motion.div
                variants={floatCupA}
                initial="initial"
                animate="animate"
                className="absolute top-[6%] right-[8%] sm:right-[10%] w-[16%] sm:w-[17%] md:w-[15%] lg:w-[14%] z-[3]"
              >
                <img
                  src="/assets/vaso-cafe.png"
                  alt="Café helado"
                  className="w-full h-auto object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.5)]"
                />
              </motion.div>

              <motion.div
                variants={floatCupB}
                initial="initial"
                animate="animate"
                className="absolute top-[30%] left-[1%] sm:left-[3%] md:left-[4%] w-[15%] sm:w-[16%] md:w-[14%] lg:w-[13%] z-[4]"
              >
                <img
                  src="/assets/vaso-verde.png"
                  alt="Matcha latte"
                  className="w-full h-auto object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.5)]"
                />
              </motion.div>

              <motion.div
                variants={floatCupC}
                initial="initial"
                animate="animate"
                className="absolute top-[58%] left-[5%] sm:left-[7%] md:left-[8%] w-[13%] sm:w-[14%] md:w-[13%] lg:w-[12%] z-[5]"
              >
                <img
                  src="/assets/vaso-rojo.png"
                  alt="Berry blast"
                  className="w-full h-auto object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.5)]"
                />
              </motion.div>

              <motion.div
                variants={floatSecondary}
                initial="initial"
                animate="animate"
                className="absolute bottom-[6%] left-[1%] sm:left-[3%] md:left-[5%] w-[26%] sm:w-[27%] md:w-[24%] lg:w-[22%] z-[6]"
              >
                <img
                  src="/assets/cup-with-shadow.png"
                  alt="Vaso Ocheto"
                  className="w-full h-auto object-contain drop-shadow-[0_14px_34px_rgba(0,0,0,0.55)]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.86, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute bottom-[2%] right-[-2%] sm:right-[-3%] md:right-[-2%] w-[72%] sm:w-[78%] md:w-[76%] lg:w-[78%] z-[7]"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut' as const,
                    delay: 1.2,
                  }}
                  className="relative will-change-transform"
                >
                  <img
                    src="/assets/drink-complete-v2.png"
                    alt="Bebida signature Ocheto Coffee"
                    className="w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                  />

                  <div className="absolute top-[-6%] left-[28%] w-[44%] h-[55%] pointer-events-none">
                    <svg
                      viewBox="0 0 80 160"
                      className="w-full h-full overflow-visible"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M40 150 Q28 120 44 90 Q56 60 36 30 Q24 12 40 0"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.55"
                        className="animate-steam"
                        style={{ animationDelay: '0s' }}
                      />
                      <path
                        d="M40 150 Q52 120 36 90 Q24 60 44 30 Q56 12 40 0"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.4"
                        className="animate-steam"
                        style={{ animationDelay: '1s' }}
                      />
                      <path
                        d="M40 150 Q34 120 46 90 Q54 60 34 30 Q22 12 40 0"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.3"
                        className="animate-steam"
                        style={{ animationDelay: '2s' }}
                      />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={badgeFloat}
                initial="initial"
                animate="animate"
                className="absolute top-[18%] right-[2%] sm:right-[3%] z-[8] hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ocheto-cream-50/95 backdrop-blur-sm shadow-[0_10px_28px_rgba(0,0,0,0.35)] border border-ocheto-green-700/15"
              >
                <Coffee
                  className="w-3 h-3 text-ocheto-green-700"
                  strokeWidth={2.5}
                />
                <span className="text-[10px] font-bold tracking-[0.18em] text-ocheto-green-700 uppercase">
                  Specialty
                </span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                  delay: 1,
                }}
                className="absolute bottom-[28%] right-[3%] z-[8] hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ocheto-green-700/90 backdrop-blur-sm shadow-[0_10px_28px_rgba(0,0,0,0.4)] border border-white/15"
              >
                <Leaf className="w-3 h-3 text-ocheto-gold-500" />
                <span className="text-[10px] font-bold tracking-[0.18em] text-ocheto-cream-50 uppercase">
                  Yungas
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 60C30 52 60 70 90 56C120 42 150 64 180 52C210 40 240 66 270 50C300 36 330 60 360 48C390 36 420 60 450 46C480 32 510 56 540 44C570 32 600 54 630 42C660 30 690 52 720 40C750 28 780 50 810 38C840 26 870 48 900 36C930 24 960 46 990 34C1020 22 1050 44 1080 32C1110 20 1140 42 1170 30C1200 18 1230 40 1260 28C1290 16 1320 38 1350 26C1380 14 1410 36 1440 24V120H0V60Z"
            fill="#F5F0E8"
          />
          <path
            d="M0 75C40 64 80 84 120 70C160 56 200 78 240 64C280 50 320 72 360 58C400 44 440 66 480 52C520 38 560 60 600 46C640 32 680 54 720 40C760 26 800 48 840 34C880 20 920 42 960 28C1000 14 1040 34 1080 20C1120 6 1160 26 1200 12C1240 -2 1280 18 1320 4C1360 -10 1400 10 1440 -2V120H0V75Z"
            fill="#F5F0E8"
            opacity="0.88"
          />
          <path
            d="M0 92C50 82 100 100 150 88C200 76 250 96 300 84C350 72 400 92 450 80C500 68 550 88 600 76C650 64 700 84 750 72C800 60 850 80 900 68C950 56 1000 76 1050 64C1100 52 1150 72 1200 60C1250 48 1300 68 1350 56C1400 44 1420 62 1440 54V120H0V92Z"
            fill="#F5F0E8"
            opacity="0.72"
          />
        </svg>
        <div className="w-full h-4 sm:h-6 bg-[#F5F0E8]" />
      </div>
    </section>
  );
}
