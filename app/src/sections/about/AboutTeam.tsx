import { motion, type Variants } from 'framer-motion';
import { Coffee, Heart } from 'lucide-react';
import { TEAM } from '@/data';

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
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

const cardContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: EASE },
  },
};

interface TeamCardProps {
  member: (typeof TEAM)[number];
  index: number;
}

function TeamCard({ member, index }: TeamCardProps) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_18px_50px_-18px_hsl(var(--ocheto-coffee-900)/0.2)] hover:shadow-[0_30px_70px_-20px_hsl(var(--ocheto-green-900)/0.3)] transition-shadow duration-500"
    >
      {/* Top image area with green ring avatar */}
      <div className="relative pt-10 pb-6 flex flex-col items-center bg-gradient-to-b from-ocheto-cream-100 to-white">
        {/* Decorative corner dot */}
        <span
          aria-hidden
          className="absolute top-4 right-4 w-2 h-2 rounded-full bg-ocheto-caramel-500 opacity-50"
        />

        {/* Avatar ring */}
        <motion.div
          whileHover={{ rotate: 4, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="relative"
        >
          <div
            className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full p-[3px]"
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--ocheto-green-700)) 0%, hsl(var(--ocheto-gold-500)) 100%)',
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-ocheto-cream-100 ring-[3px] ring-white">
              <img
                src={member.avatar}
                alt={member.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
          {/* Floating coffee bean accent */}
          <motion.span
            aria-hidden
            animate={{ rotate: [-10, 6, -10], y: [0, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-ocheto-gold-500 flex items-center justify-center shadow-lg ring-2 ring-white"
          >
            <Coffee className="w-4 h-4 text-ocheto-coffee-900" strokeWidth={2.5} />
          </motion.span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-7 pb-7 pt-2 text-center">
        {/* Name */}
        <h3
          className="font-fraunces italic font-medium text-ocheto-coffee-900 leading-tight"
          style={{
            fontSize: 'clamp(1.5rem, 2.4vw, 1.85rem)',
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
          }}
        >
          {member.name}
        </h3>

        {/* Role */}
        <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-ocheto-green-700 font-bold">
          {member.role}
        </p>

        {/* Divider */}
        <span
          aria-hidden
          className="block h-px w-10 mx-auto my-4 bg-gradient-to-r from-transparent via-ocheto-caramel-500 to-transparent"
        />

        {/* Bio */}
        <p className="text-sm text-ocheto-coffee-700/85 leading-relaxed min-h-[5em]">
          {member.bio}
        </p>

        {/* Favorite drink tag */}
        {member.favorite && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.08 }}
            className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ocheto-cream-100 border border-ocheto-green-700/15"
          >
            <Heart
              className="w-3 h-3 text-ocheto-berry-500 fill-ocheto-berry-500"
              strokeWidth={2}
            />
            <span className="text-[10px] uppercase tracking-[0.22em] text-ocheto-coffee-700 font-semibold">
              Favorito:
            </span>
            <span className="text-[11px] font-semibold text-ocheto-green-700">
              {member.favorite}
            </span>
          </motion.div>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
        style={{
          background:
            'linear-gradient(90deg, hsl(var(--ocheto-green-700)), hsl(var(--ocheto-gold-500)))',
        }}
      />
    </motion.article>
  );
}

export default function AboutTeam() {
  return (
    <section
      id="about-team"
      className="relative w-full overflow-hidden bg-ocheto-cream-100 section-padding grain-texture"
    >
      {/* Soft glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-40 w-[36rem] h-[36rem] rounded-full opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--ocheto-caramel-500)) 0%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-1/4 -right-40 w-[40rem] h-[40rem] rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--ocheto-green-700)) 0%, transparent 65%)',
        }}
      />

      {/* Background watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span
          className="select-none whitespace-nowrap leading-none"
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'hsl(var(--ocheto-coffee-900) / 0.04)',
            fontSize: 'clamp(7rem, 24vw, 20rem)',
            letterSpacing: '-0.04em',
          }}
        >
          EQUIPO
        </span>
      </div>

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
              Las manos detrás del café
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
            {'Las manos'.split(' ').map((word, i) => (
              <motion.span
                key={`a-${word}-${i}`}
                variants={wordVariants}
                className="inline-block mr-[0.22em]"
                style={{ transformOrigin: '50% 100%' }}
              >
                {word}
              </motion.span>
            ))}
            <br />
            <span className="text-ocheto-green-700 inline-block">
              {'detrás'.split(' ').map((word, i) => (
                <motion.span
                  key={`b-${word}-${i}`}
                  variants={wordVariants}
                  className="inline-block mr-[0.22em]"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {word}
                </motion.span>
              ))}
            </span>{' '}
            <span className="gradient-text inline-block">
              {'del café.'.split(' ').map((word, i) => (
                <motion.span
                  key={`c-${word}-${i}`}
                  variants={wordVariants}
                  className="inline-block mr-[0.22em]"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-base sm:text-lg text-ocheto-coffee-700/85 leading-relaxed max-w-2xl mx-auto"
          >
            Somos un equipo pequeño, pero con mucho{' '}
            <span className="font-caveat text-2xl sm:text-3xl text-ocheto-caramel-500 align-middle">
              cariño
            </span>{' '}
            entre manos. Conocenos.
          </motion.p>
        </motion.div>

        {/* ============ TEAM GRID ============ */}
        <motion.div
          variants={cardContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7"
        >
          {TEAM.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </motion.div>

        {/* ============ BOTTOM NOTE ============ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className="mt-14 sm:mt-20 flex flex-col items-center text-center gap-4"
        >
          <span
            aria-hidden
            className="block h-px w-16 bg-gradient-to-r from-transparent via-ocheto-caramel-500 to-transparent"
          />
          <p className="font-caveat text-2xl sm:text-3xl text-ocheto-green-700 leading-none">
            queremos que formes parte de la historia
          </p>
          <p className="text-sm sm:text-base text-ocheto-coffee-700/70 max-w-md leading-relaxed">
            Pasa por cualquiera de nuestras barras, te convidamos un café y te contamos todo sobre nuestros tostados.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
