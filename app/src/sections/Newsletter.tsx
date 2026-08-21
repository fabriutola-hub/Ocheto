import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Send, Sparkles, Check, Mail, Coffee, Heart } from 'lucide-react';
import { Link } from 'react-router';

const HEADLINE_WORDS = ['Únete', 'al', 'ritual.'];

const BENEFITS = [
  {
    icon: Coffee,
    title: '10% en tu primera compra',
    desc: 'Online y en cafetería.',
    color: 'ocheto-caramel-500',
  },
  {
    icon: Sparkles,
    title: 'Acceso anticipado',
    desc: 'Nuevos tostados antes que nadie.',
    color: 'ocheto-gold-500',
  },
  {
    icon: Heart,
    title: 'Catas y eventos',
    desc: 'Invitaciones a experiencias únicas.',
    color: 'ocheto-berry-500',
  },
  {
    icon: Mail,
    title: 'Recetas de barista',
    desc: 'Rituales para tu día a día.',
    color: 'ocheto-green-400',
  },
];

const headlineContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 36, rotateX: -45 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const benefitContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.55 },
  },
};

const benefitItem: Variants = {
  hidden: { opacity: 0, x: -22 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardContainer: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const formVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const successVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

function CoffeeBean({
  size = 28,
  fill = 'hsl(var(--ocheto-coffee-700))',
  className = '',
}: {
  size?: number;
  fill?: string;
  className?: string;
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
    </svg>
  );
}

function MemberCard() {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -6, y: 30, scale: 0.92 }}
      whileInView={{ opacity: 1, rotate: -4, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotate: 0, y: -6, transition: { duration: 0.4 } }}
      className="relative w-full max-w-[340px] mx-auto aspect-[1.586/1] rounded-2xl overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.5)]"
      style={{
        background:
          'linear-gradient(135deg, hsl(var(--ocheto-green-950)) 0%, hsl(var(--ocheto-green-800)) 60%, hsl(var(--ocheto-green-700)) 100%)',
      }}
    >
      {/* Inner glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 100% 0%, hsl(var(--ocheto-gold-500) / 0.25) 0%, transparent 60%)',
        }}
      />

      {/* Decorative grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--ocheto-cream-50)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ocheto-cream-50)) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Gold edge accent */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          padding: '1px',
          background:
            'linear-gradient(135deg, hsl(var(--ocheto-gold-500) / 0.6) 0%, transparent 50%, hsl(var(--ocheto-gold-500) / 0.4) 100%)',
          WebkitMask:
            'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Card content */}
      <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between text-ocheto-cream-50">
        {/* Top: logo + MEMBER */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--ocheto-cream-50)) 0%, hsl(var(--ocheto-cream-100)) 100%)',
              }}
            >
              <Coffee
                className="w-4 h-4"
                style={{ color: 'hsl(var(--ocheto-green-900))' }}
                strokeWidth={2.25}
              />
            </div>
            <div className="leading-tight">
              <div
                className="font-bold text-[13px] sm:text-sm tracking-wide uppercase"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Ocheto
              </div>
              <div className="text-[8px] sm:text-[9px] tracking-[0.22em] text-ocheto-cream-100/70 uppercase">
                Coffee Club
              </div>
            </div>
          </div>

          <div
            className="text-right leading-tight px-2.5 py-1 rounded-md"
            style={{
              background: 'hsl(var(--ocheto-gold-500) / 0.15)',
              border: '1px solid hsl(var(--ocheto-gold-500) / 0.4)',
            }}
          >
            <div
              className="text-[8px] sm:text-[9px] tracking-[0.25em] font-bold uppercase"
              style={{ color: 'hsl(var(--ocheto-gold-500))' }}
            >
              Member
            </div>
          </div>
        </div>

        {/* Middle: chip + waves */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-7 rounded-md"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--ocheto-gold-500)) 0%, hsl(var(--ocheto-caramel-500)) 100%)',
                boxShadow: 'inset 0 1px 0 hsl(var(--ocheto-cream-50) / 0.3)',
              }}
            />
            <Sparkles
              className="w-3.5 h-3.5"
              style={{ color: 'hsl(var(--ocheto-gold-500))' }}
              strokeWidth={2}
            />
          </div>

          <div
            className="text-[8px] sm:text-[9px] tracking-[0.25em] text-ocheto-cream-100/60 uppercase"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            2024
          </div>
        </div>

        {/* Bottom: name + number */}
        <div>
          <div className="text-[8px] sm:text-[9px] tracking-[0.25em] text-ocheto-cream-100/60 uppercase mb-1">
            Miembro
          </div>
          <div
            className="font-medium italic text-base sm:text-lg leading-none mb-2"
            style={{
              fontFamily: "'Fraunces', serif",
              color: 'hsl(var(--ocheto-cream-50))',
            }}
          >
            [Tu nombre]
          </div>
          <div className="flex items-center justify-between">
            <div
              className="text-[11px] sm:text-xs tracking-[0.18em] tabular-nums text-ocheto-cream-100/80"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              ···· 2024
            </div>
            <div className="flex items-center gap-1">
              <span
                aria-hidden
                className="block w-1.5 h-1.5 rounded-full bg-ocheto-gold-500 animate-pulse"
              />
              <span
                className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-semibold"
                style={{ color: 'hsl(var(--ocheto-gold-500))' }}
              >
                Activo
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo válido.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    window.setTimeout(() => {
      console.log('Newsletter signup:', email.trim());
      setIsSubmitting(false);
      setIsSuccess(true);

      window.setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
      }, 3000);
    }, 650);
  };

  return (
    <section
      id="newsletter"
      className="relative w-full overflow-hidden bg-ocheto-cream-50 dots-bg section-padding"
    >
      {/* ===== Decorative: large background circle ===== */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.06]"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-green-700)) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full pointer-events-none opacity-[0.05]"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-caramel-500)) 0%, transparent 70%)',
        }}
      />

      {/* ===== Floating decorative beans ===== */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -14, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 left-[8%] hidden lg:block pointer-events-none opacity-50"
        style={{
          filter: 'drop-shadow(0 8px 14px hsl(var(--ocheto-coffee-900) / 0.2))',
        }}
      >
        <CoffeeBean size={42} fill="hsl(var(--ocheto-coffee-700))" />
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ y: [0, 12, 0], rotate: [-6, 6, -6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute bottom-32 right-[6%] hidden lg:block pointer-events-none opacity-50"
        style={{
          filter: 'drop-shadow(0 8px 14px hsl(var(--ocheto-coffee-900) / 0.2))',
        }}
      >
        <CoffeeBean size={34} fill="hsl(var(--ocheto-coffee-900))" />
      </motion.div>

      {/* ===== Floating cup image ===== */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute top-1/3 right-[4%] hidden xl:block pointer-events-none opacity-90"
        style={{
          filter: 'drop-shadow(0 20px 30px hsl(var(--ocheto-coffee-900) / 0.25))',
        }}
      >
        <img
          src="/assets/vaso-ocheto-full.png"
          alt=""
          className="w-20 h-auto"
          draggable={false}
        />
      </motion.div>

      {/* ===== Container ===== */}
      <div className="relative z-10 container-ocheto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={cardContainer}
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden grain-texture"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--ocheto-green-900)) 0%, hsl(var(--ocheto-green-950)) 50%, hsl(var(--ocheto-green-800)) 100%)',
            boxShadow:
              '0 40px 100px -30px hsl(var(--ocheto-green-950) / 0.5), 0 0 0 1px hsl(var(--ocheto-gold-500) / 0.15)',
          }}
        >
          {/* ===== Inner glow corners ===== */}
          <div
            aria-hidden
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40"
            style={{
              background:
                'radial-gradient(circle at top right, hsl(var(--ocheto-gold-500) / 0.25) 0%, transparent 60%)',
              transform: 'translate(30%, -30%)',
            }}
          />
          <div
            aria-hidden
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-30"
            style={{
              background:
                'radial-gradient(circle at bottom left, hsl(var(--ocheto-caramel-500) / 0.2) 0%, transparent 60%)',
              transform: 'translate(-30%, 30%)',
            }}
          />

          {/* ===== Decorative top border accent ===== */}
          <div
            aria-hidden
            className="absolute top-0 left-8 right-8 h-[1px]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, hsl(var(--ocheto-gold-500) / 0.5) 50%, transparent 100%)',
            }}
          />

          {/* ===== Decorative corner sparkles ===== */}
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-8 right-8 text-ocheto-gold-500 pointer-events-none"
          >
            <Sparkles className="w-5 h-5" strokeWidth={2} />
          </motion.div>
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute top-20 right-20 text-ocheto-caramel-500 pointer-events-none"
          >
            <Sparkles className="w-3 h-3" strokeWidth={2.5} />
          </motion.div>
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
            className="absolute bottom-10 left-10 text-ocheto-gold-500 pointer-events-none"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2} />
          </motion.div>

          {/* ===== Inner content grid ===== */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 px-6 sm:px-10 lg:px-14 py-12 sm:py-16 lg:py-20">
            {/* ============================================ */}
            {/* LEFT — Content                                */}
            {/* ============================================ */}
            <div className="lg:col-span-7 text-ocheto-cream-50">
              {/* Eyebrow tag */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 mb-6 sm:mb-7"
              >
                <span
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase"
                  style={{
                    background: 'hsl(var(--ocheto-gold-500) / 0.12)',
                    color: 'hsl(var(--ocheto-gold-500))',
                    border: '1px solid hsl(var(--ocheto-gold-500) / 0.3)',
                  }}
                >
                  <Coffee className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Club Ocheto
                </span>
              </motion.div>

              {/* Headline — word-by-word */}
              <motion.h2
                variants={headlineContainer}
                className="font-fraunces italic text-ocheto-cream-50 leading-[0.95] tracking-tight"
                style={{
                  fontSize: 'clamp(2.6rem, 6.5vw, 4.8rem)',
                  fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
                  perspective: '1000px',
                }}
              >
                {HEADLINE_WORDS.map((word, i) => (
                  <motion.span
                    key={word + i}
                    variants={wordVariants}
                    className="inline-block mr-[0.22em]"
                    style={{ transformOrigin: '50% 100%' }}
                  >
                    {word === 'ritual.' ? (
                      <span className="text-ocheto-gold-500">{word}</span>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.7,
                  delay: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-ocheto-cream-100/80 leading-relaxed max-w-[58ch]"
              >
                Recibe cada semana un correo con{' '}
                <span className="text-ocheto-cream-50 font-medium">
                  nuevos tostados
                </span>
                , descuentos exclusivos, recetas de barista y acceso anticipado
                a eventos.
              </motion.p>

              {/* ===== Benefits grid ===== */}
              <motion.ul
                variants={benefitContainer}
                className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
              >
                {BENEFITS.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.li
                      key={benefit.title}
                      variants={benefitItem}
                      className="group flex items-start gap-3"
                    >
                      <span
                        className="shrink-0 mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: `hsl(var(--${benefit.color}) / 0.18)`,
                          border: `1px solid hsl(var(--${benefit.color}) / 0.35)`,
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: `hsl(var(--${benefit.color}))` }}
                          strokeWidth={2.25}
                        />
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm sm:text-base text-ocheto-cream-50 leading-tight">
                          {benefit.title}
                        </div>
                        <div className="text-xs sm:text-sm text-ocheto-cream-100/60 leading-snug mt-0.5">
                          {benefit.desc}
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* ===== Email form ===== */}
              <motion.div variants={formVariants} className="mt-8 sm:mt-10 relative">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                      className="relative"
                    >
                      <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 rounded-full bg-ocheto-cream-50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]">
                        {/* Email input */}
                        <div className="relative flex-1 flex items-center">
                          <Mail
                            className="absolute left-5 w-4 h-4 pointer-events-none"
                            style={{ color: 'hsl(var(--ocheto-coffee-700) / 0.6)' }}
                            strokeWidth={2.25}
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (error) setError(null);
                            }}
                            placeholder="tu@email.com"
                            aria-label="Tu correo electrónico"
                            disabled={isSubmitting}
                            className="w-full pl-12 pr-5 py-3 sm:py-3.5 bg-transparent rounded-full text-ocheto-coffee-900 placeholder:text-ocheto-coffee-700/50 text-sm sm:text-base font-medium focus:outline-none transition-all duration-300"
                            style={{
                              fontFamily: "'Inter', sans-serif",
                            }}
                          />
                        </div>

                        {/* Submit button */}
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                          className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base whitespace-nowrap disabled:opacity-80 overflow-hidden"
                          style={{
                            background:
                              'linear-gradient(135deg, hsl(var(--ocheto-gold-500)) 0%, hsl(var(--ocheto-caramel-500)) 100%)',
                            color: 'hsl(var(--ocheto-coffee-900))',
                            boxShadow:
                              '0 8px 24px hsl(var(--ocheto-gold-500) / 0.35), inset 0 1px 0 hsl(var(--ocheto-cream-50) / 0.3)',
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {/* Shine effect */}
                          <span
                            aria-hidden
                            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                            style={{
                              background:
                                'linear-gradient(90deg, transparent, hsl(var(--ocheto-cream-50) / 0.5), transparent)',
                            }}
                          />
                          <span className="relative">
                            {isSubmitting ? 'Enviando…' : 'Suscribirme'}
                          </span>
                          {isSubmitting ? (
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                              className="relative w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                            />
                          ) : (
                            <Send
                              className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                              strokeWidth={2.5}
                            />
                          )}
                        </motion.button>
                      </div>

                      {/* Error message */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-2 ml-5 text-xs text-ocheto-berry-500 font-medium"
                          >
                            {error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Privacy reassurance */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 1.3 }}
                        className="mt-4 ml-1 flex items-center gap-2 text-xs sm:text-sm text-ocheto-cream-100/55"
                      >
                        <span
                          aria-hidden
                          className="block w-1.5 h-1.5 rounded-full bg-ocheto-green-400"
                        />
                        Sin spam. Puedes cancelar cuando quieras.
                      </motion.p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      variants={successVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="flex items-center gap-4 px-6 py-5 rounded-2xl"
                      style={{
                        background:
                          'linear-gradient(135deg, hsl(var(--ocheto-gold-500) / 0.15) 0%, hsl(var(--ocheto-caramel-500) / 0.1) 100%)',
                        border: '1px solid hsl(var(--ocheto-gold-500) / 0.4)',
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                          delay: 0.1,
                        }}
                        className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            'linear-gradient(135deg, hsl(var(--ocheto-gold-500)) 0%, hsl(var(--ocheto-caramel-500)) 100%)',
                          color: 'hsl(var(--ocheto-coffee-900))',
                          boxShadow:
                            '0 8px 24px hsl(var(--ocheto-gold-500) / 0.4)',
                        }}
                      >
                        <Check className="w-6 h-6" strokeWidth={3} />
                      </motion.div>
                      <div className="min-w-0">
                        <div
                          className="font-fraunces italic text-xl sm:text-2xl text-ocheto-cream-50 leading-tight"
                          style={{
                            fontVariationSettings: '"opsz" 144, "SOFT" 60',
                          }}
                        >
                          ¡Bienvenide al club! 💚
                        </div>
                        <div className="text-xs sm:text-sm text-ocheto-cream-100/70 mt-0.5">
                          Te enviamos una bienvenida a{' '}
                          <span className="font-medium text-ocheto-cream-50">
                            {email}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ===== Handwritten signature ===== */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 sm:mt-10 flex items-center gap-3"
              >
                <span
                  aria-hidden
                  className="block h-px w-8"
                  style={{ background: 'hsl(var(--ocheto-gold-500) / 0.5)' }}
                />
                <span
                  className="font-caveat text-2xl sm:text-3xl leading-none"
                  style={{ color: 'hsl(var(--ocheto-gold-500))' }}
                >
                  ¡Te esperamos! — El equipo Ocheto 🐻☕
                </span>
              </motion.div>
            </div>

            {/* ============================================ */}
            {/* RIGHT — Member card mockup                    */}
            {/* ============================================ */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative">
              <div className="relative w-full">
                {/* Subtle dotted ring behind */}
                <div
                  aria-hidden
                  className="absolute inset-0 -m-10 rounded-full border border-dashed pointer-events-none hidden lg:block"
                  style={{ borderColor: 'hsl(var(--ocheto-gold-500) / 0.25)' }}
                />

                <MemberCard />

                {/* Floating handwritten "¡Gracias!" note */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 0.8,
                    delay: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute -top-6 -right-2 sm:-right-6 z-20 pointer-events-none hidden sm:block"
                  style={{ transformOrigin: 'center' }}
                >
                  <motion.div
                    animate={{
                      rotate: [-8, -4, -8],
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1.8,
                    }}
                    className="relative px-3 py-1.5 rounded-lg"
                    style={{
                      background:
                        'hsl(var(--ocheto-cream-50) / 0.95)',
                      boxShadow:
                        '0 10px 30px -10px hsl(var(--ocheto-coffee-900) / 0.4)',
                    }}
                  >
                    <span
                      className="font-caveat text-xl sm:text-2xl leading-none block"
                      style={{ color: 'hsl(var(--ocheto-green-700))' }}
                    >
                      ¡HOLA!
                    </span>
                    {/* Tape effect */}
                    <span
                      aria-hidden
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 rounded-sm rotate-3"
                      style={{
                        background:
                          'hsl(var(--ocheto-gold-500) / 0.5)',
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* Star sparkle near card */}
                <motion.div
                  aria-hidden
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 180] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -left-4 text-ocheto-gold-500 pointer-events-none"
                >
                  <Sparkles className="w-6 h-6" strokeWidth={2} />
                </motion.div>

                {/* Caption under card */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: 1.2 }}
                  className="mt-6 text-center"
                >
                  <p className="text-xs sm:text-sm text-ocheto-cream-100/70 leading-relaxed">
                    Tu tarjeta{' '}
                    <span
                      className="font-fraunces italic text-ocheto-gold-500 font-medium"
                      style={{ fontVariationSettings: '"opsz" 144' }}
                    >
                      Ocheto Member
                    </span>{' '}
                    te espera dentro.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ===== Footer strip inside card ===== */}
          <div className="relative border-t border-ocheto-cream-50/10 px-6 sm:px-10 lg:px-14 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-ocheto-cream-100/55">
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="block w-1.5 h-1.5 rounded-full bg-ocheto-green-400 animate-pulse"
              />
              2,000+ personas ya vibran con nosotros
            </span>
            <Link
              to="/nosotros"
              className="group inline-flex items-center gap-1.5 text-ocheto-cream-100/70 hover:text-ocheto-gold-500 transition-colors duration-300 font-medium"
            >
              Conoce más
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
