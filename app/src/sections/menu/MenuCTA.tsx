import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight, MapPin, ShoppingBag, Coffee, Sparkles } from 'lucide-react';

const headlineContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 32, rotateX: -35 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const HEADLINE = ['¿Se', 'te', 'antoja', 'algo?'];

const QUICK_FACTS = [
  { icon: MapPin, label: '2 sedes en La Paz' },
  { icon: Coffee, label: 'Hecho al momento' },
  { icon: ShoppingBag, label: 'Para llevar y delivery' },
];

export default function MenuCTA() {
  return (
    <section
      className="relative w-full overflow-hidden section-padding"
      aria-label="Llamada a la acción"
    >
      {/* ===== Background card ===== */}
      <div className="container-ocheto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden grain-texture"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--ocheto-cream-50)) 0%, hsl(var(--ocheto-cream-100)) 60%, hsl(var(--ocheto-cream-50)) 100%)',
            boxShadow:
              '0 40px 100px -30px hsl(var(--ocheto-coffee-900) / 0.25), 0 0 0 1px hsl(var(--ocheto-coffee-900) / 0.06)',
          }}
        >
          {/* ===== Decorative glows ===== */}
          <div
            aria-hidden
            className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none opacity-70"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--ocheto-gold-500) / 0.28) 0%, transparent 60%)',
            }}
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-32 w-[440px] h-[440px] rounded-full pointer-events-none opacity-60"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--ocheto-caramel-500) / 0.22) 0%, transparent 60%)',
            }}
          />
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--ocheto-matcha-500) / 0.12) 0%, transparent 70%)',
            }}
          />

          {/* ===== Floating decorative beans ===== */}
          <motion.div
            aria-hidden
            animate={{ y: [0, -14, 0], rotate: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-8 right-12 hidden md:block opacity-70"
          >
            <svg
              viewBox="0 0 40 56"
              width="42"
              height="58.8"
              aria-hidden="true"
            >
              <ellipse cx="20" cy="28" rx="18" ry="26" fill="hsl(var(--ocheto-caramel-500))" />
              <path
                d="M20 4 C 14 16, 14 40, 20 52"
                stroke="hsl(var(--ocheto-cream-50))"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </motion.div>
          <motion.div
            aria-hidden
            animate={{ y: [0, 12, 0], rotate: [-8, 8, -8] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute bottom-12 right-16 hidden lg:block opacity-60"
          >
            <svg
              viewBox="0 0 40 56"
              width="32"
              height="44.8"
              aria-hidden="true"
            >
              <ellipse cx="20" cy="28" rx="18" ry="26" fill="hsl(var(--ocheto-gold-500))" />
              <path
                d="M20 4 C 14 16, 14 40, 20 52"
                stroke="hsl(var(--ocheto-coffee-900))"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </motion.div>

          {/* ===== Sparkles ===== */}
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0.95, 0.45] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-12 left-16 text-ocheto-gold-500 hidden md:block"
          >
            <Sparkles className="w-5 h-5" strokeWidth={2} />
          </motion.div>
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.85, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-20 left-20 text-ocheto-caramel-500 hidden md:block"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.4} />
          </motion.div>

          {/* ===== Top border accent ===== */}
          <div
            aria-hidden
            className="absolute top-0 left-12 right-12 h-[1px]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, hsl(var(--ocheto-gold-500) / 0.5) 50%, transparent 100%)',
            }}
          />

          {/* ===== Content ===== */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-14 sm:py-16 lg:py-20 text-center">
            {/* Eyebrow */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="flex justify-center mb-6 sm:mb-7"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-ocheto-coffee-900/10 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-ocheto-gold-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ocheto-gold-500" />
                </span>
                <span className="text-[10px] sm:text-xs tracking-[0.28em] font-bold uppercase text-ocheto-coffee-900">
                  Te esperamos hoy
                </span>
              </div>
            </motion.div>

            {/* Editorial headline — word by word */}
            <motion.h2
              variants={headlineContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="font-fraunces italic font-medium text-ocheto-coffee-900 leading-[0.95] tracking-tight"
              style={{
                fontSize: 'clamp(2.75rem, 7.5vw, 5.75rem)',
                fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
                perspective: '1000px',
              }}
            >
              {HEADLINE.map((word, i) => (
                <motion.span
                  key={word + i}
                  variants={wordVariants}
                  className="inline-block mr-[0.22em]"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {word === 'antoja' ? (
                    <span
                      className="relative inline-block"
                      style={{
                        background:
                          'linear-gradient(135deg, hsl(var(--ocheto-caramel-500)) 0%, hsl(var(--ocheto-gold-500)) 60%, hsl(var(--ocheto-caramel-600)) 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                      }}
                    >
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </motion.h2>

            {/* Caveat accent */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="mt-3 sm:mt-4 flex justify-center"
            >
              <motion.span
                animate={{ rotate: [-3, 2, -3] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="font-caveat text-ocheto-caramel-500 text-2xl sm:text-3xl lg:text-4xl leading-none inline-block"
                style={{ textShadow: '0 1px 0 rgba(212, 165, 116, 0.15)' }}
              >
                — nosotros lo preparamos
              </motion.span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.4 }}
              className="mt-6 sm:mt-7 max-w-xl mx-auto text-ocheto-coffee-900/75 text-base sm:text-lg leading-relaxed"
            >
              Visítanos en cualquiera de nuestras sedes en La Paz o pide para
              llevar. Cada bebida se prepara al momento, con los mismos granos
              specialty que tostamos cada semana.
            </motion.p>

            {/* Quick facts strip */}
            <motion.ul
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.5 }}
              className="mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2.5 text-xs sm:text-sm text-ocheto-coffee-900/70 font-medium"
            >
              {QUICK_FACTS.map((fact, i) => {
                const Icon = fact.icon;
                return (
                  <li key={fact.label} className="inline-flex items-center gap-1.5">
                    <Icon
                      className="w-3.5 h-3.5 text-ocheto-gold-500"
                      strokeWidth={2.4}
                    />
                    <span>{fact.label}</span>
                    {i < QUICK_FACTS.length - 1 && (
                      <span
                        aria-hidden
                        className="hidden sm:inline-block ml-3 sm:ml-5 h-3 w-px bg-ocheto-coffee-900/15"
                      />
                    )}
                  </li>
                );
              })}
            </motion.ul>

            {/* ===== Buttons ===== */}
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.6 }}
              className="mt-9 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              {/* Primary: Ver Ubicaciones */}
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/contacto"
                  className="group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-base overflow-hidden shadow-[0_10px_30px_-10px_rgba(27,94,32,0.45)] hover:shadow-[0_18px_40px_-12px_rgba(27,94,32,0.55)] transition-shadow duration-300"
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(var(--ocheto-green-700)) 0%, hsl(var(--ocheto-green-600)) 100%)',
                    color: 'hsl(var(--ocheto-cream-50))',
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, hsl(var(--ocheto-cream-50) / 0.25), transparent)',
                    }}
                  />
                  <MapPin className="relative w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.4} />
                  <span className="relative">Ver Ubicaciones</span>
                  <ArrowRight
                    className="relative w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.4}
                  />
                </Link>
              </motion.div>

              {/* Secondary: Pedir Ahora */}
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/tienda"
                  className="group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-base overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(var(--ocheto-gold-500)) 0%, hsl(var(--ocheto-caramel-500)) 100%)',
                    color: 'hsl(var(--ocheto-coffee-900))',
                    boxShadow:
                      '0 10px 30px -10px hsl(var(--ocheto-gold-500) / 0.5), inset 0 1px 0 hsl(var(--ocheto-cream-50) / 0.3)',
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, hsl(var(--ocheto-cream-50) / 0.45), transparent)',
                    }}
                  />
                  <ShoppingBag className="relative w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.4} />
                  <span className="relative">Pedir Ahora</span>
                  <ArrowRight
                    className="relative w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.4}
                  />
                </Link>
              </motion.div>
            </motion.div>

            {/* Footer hint */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.8 }}
              className="mt-9 sm:mt-11 flex flex-col items-center gap-2"
            >
              <span
                aria-hidden
                className="block h-px w-10 bg-ocheto-coffee-900/20"
              />
              <p className="text-xs sm:text-sm text-ocheto-coffee-900/55 font-light tracking-wide">
                Horario · Lun a Sáb 7:00 — 22:00 · Dom 8:00 — 21:00
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
