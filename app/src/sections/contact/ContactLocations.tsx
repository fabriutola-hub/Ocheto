import { motion, type Variants } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { LOCATIONS } from '@/data';
import { EASE } from '@/shared/motion';
import { LocationCard } from '@/features/locations/LocationCard';
import { useLocationImages } from '@/features/siteImages/queries';

const headerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const cardContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export default function ContactLocations() {
  const { data: locImages } = useLocationImages();
  const locations = LOCATIONS.map((l) => ({ ...l, image: locImages?.[l.id] ?? l.image }));
  return (
    <section
      className="relative w-full overflow-hidden bg-ocheto-green-900 grain-texture section-padding"
      aria-label="Ubicaciones de Ocheto Coffee en La Paz"
    >
      {/* ===== BACKGROUND DECORATIVE TEXT ===== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center z-0">
        <span
          className="block italic font-black text-center whitespace-nowrap leading-none"
          style={{
            fontFamily: "'Fraunces', serif",
            color: '#FAF7F0',
            fontSize: 'clamp(8rem, 22vw, 24rem)',
            opacity: 0.045,
            letterSpacing: '-0.04em',
          }}
        >
          VISÍTANOS
        </span>
      </div>

      {/* Secondary faded word */}
      <div className="absolute -bottom-10 -left-10 pointer-events-none select-none overflow-hidden z-0">
        <span
          className="block italic font-black whitespace-nowrap leading-none"
          style={{
            fontFamily: "'Fraunces', serif",
            color: '#FAF7F0',
            fontSize: 'clamp(6rem, 18vw, 18rem)',
            opacity: 0.035,
            letterSpacing: '-0.04em',
          }}
        >
          LA PAZ
        </span>
      </div>

      {/* Dotted pattern overlay */}
      <div className="absolute inset-0 dots-bg opacity-50 pointer-events-none z-[1]" />

      {/* ===== MAIN CONTAINER ===== */}
      <div className="relative z-10 container-ocheto">
        {/* Header */}
        <motion.div
          variants={headerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocheto-cream-50/10 backdrop-blur-md border border-ocheto-cream-50/20 text-ocheto-cream-50 text-[11px] font-bold tracking-[0.28em] uppercase">
              <Sparkles className="w-3 h-3 text-ocheto-gold-500" strokeWidth={2.5} />
              Nuestras sedes
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={fadeUp}
            className="text-ocheto-cream-50 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight font-black italic max-w-3xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Dos espacios para{' '}
            <span className="text-ocheto-gold-500">encontrarnos.</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mt-5 text-white text-base sm:text-lg max-w-2xl leading-relaxed font-light"
          >
            Pasa por cualquiera de nuestras cafeterías. Te esperamos con un espresso
            recién hecho y la mejor conversación.
          </motion.p>
        </motion.div>

        {/* ===== CARDS GRID ===== */}
        <motion.div
          variants={cardContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {locations.map((location, idx) => (
            <LocationCard key={location.id} location={location} index={idx} variant="contact" />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
