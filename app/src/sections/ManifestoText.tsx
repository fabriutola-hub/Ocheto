import { EASE } from '@/shared/motion';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight, Quote } from 'lucide-react';

const headlineLineA = 'Pequeños detalles.';
const headlineLineB = 'Grandes momentos.';

const splitWords = (text: string) => text.split(' ');

export const eyebrowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const headlineContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

export const wordVariants: Variants = {
  hidden: { opacity: 0, y: 28, rotateX: -35 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const bodyVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.3 },
  },
};

const signatureVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.5 },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.6 },
  },
};

export default function ManifestoText() {
  const wordsA = splitWords(headlineLineA);
  const wordsB = splitWords(headlineLineB);

  return (
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
          Nuestra Historia
        </span>
      </motion.div>

      {/* Quote opening mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
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
        transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
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
        En Ocheto valoramos los ingredientes de calidad, la dedicación en cada
        preparación y los pequeños detalles que hacen especial cada momento. Por
        eso elaboramos nuestras bebidas y postres con cuidado, buscando ofrecer
        una experiencia cálida, deliciosa y accesible para acompañarte en
        cualquier momento del día.
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
          Tres tiendas y los ositos que nos acompañan 🧸
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
          Manifiesto Ocheto · 2026
        </span>
      </motion.div>
    </motion.div>
  );
}
