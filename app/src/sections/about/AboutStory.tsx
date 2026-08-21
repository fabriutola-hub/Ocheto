import { EASE } from '@/shared/motion';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { STATS } from '@/data';
import { TimelineNode } from './TimelineNode';
import { useMilestones } from '@/features/about/queries';
import { MILESTONES as FALLBACK_MILESTONES } from './TimelineNode';

const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 36, rotateX: -45 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const timelineDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.4, delay: 0.4, ease: EASE },
  },
};

export default function AboutStory() {
  const { data: milestonesData } = useMilestones();
  const MILESTONES = milestonesData && milestonesData.length > 0 ? milestonesData : FALLBACK_MILESTONES;
  return (
    <section
      id="about-story"
      className="relative w-full overflow-hidden bg-ocheto-cream-50 dots-bg section-padding"
    >
      {/* ===== Big background quote mark ===== */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 right-0 sm:right-10 select-none leading-none text-ocheto-green-700/[0.05]"
        style={{ fontFamily: "'Fraunces', serif", fontWeight: 700 }}
      >
        <span className="block text-[14rem] sm:text-[24rem] lg:text-[34rem]">“</span>
      </div>

      {/* ===== Soft gradient blobs ===== */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 -left-32 w-[28rem] h-[28rem] rounded-full opacity-25 blur-2xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--ocheto-caramel-500)) 0%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -right-40 w-[32rem] h-[32rem] rounded-full opacity-20 blur-2xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--ocheto-green-700)) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 container-ocheto">
        {/* ============ HEADER ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-16 sm:mb-20 lg:mb-28">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-7"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <span aria-hidden className="block h-px w-10 bg-ocheto-green-700" />
              <span className="text-ocheto-green-700 text-xs sm:text-sm font-semibold uppercase tracking-[0.32em]">
                Alfajores de cacao · Un apodo
              </span>
            </motion.div>

            <motion.h2
              variants={headlineContainer}
              className="font-fraunces italic font-light text-ocheto-coffee-900 leading-[0.96] tracking-[-0.02em]"
              style={{
                fontSize: 'clamp(2.6rem, 7.2vw, 5.6rem)',
                fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0',
                perspective: '1000px',
              }}
            >
              {'Una historia'.split(' ').map((word, i) => (
                <motion.span
                  key={`a-${i}`}
                  variants={wordVariants}
                  className="inline-block mr-[0.22em]"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <span className="gradient-text inline-block">
                {'con mucho cariño'.split(' ').map((word, i) => (
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
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-5"
          >
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-ocheto-coffee-700/85 leading-relaxed max-w-md lg:ml-auto"
            >
              La historia de Ocheto comenzó de forma sencilla: con alfajores de
              cacao y muchas ganas de crear algo especial. El nombre nació de un
              apodo que se transformó en algo mucho más grande.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-5 flex items-center gap-3 lg:justify-end">
              <span aria-hidden className="block h-px w-8 bg-ocheto-green-700/40" />
              <span className="font-caveat text-2xl sm:text-3xl text-ocheto-green-700 leading-none">
                tres tiendas y seguimos creciendo
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* ============ STORY BODY (editorial pull-quote) ============ */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="relative max-w-4xl mx-auto my-16 sm:my-20 lg:my-24 px-4 sm:px-0"
        >
          {/* Big quotation mark */}
          <motion.div
            variants={fadeUp}
            aria-hidden
            className="absolute -top-10 sm:-top-14 left-0 sm:-left-6 text-ocheto-caramel-500/50 select-none leading-none pointer-events-none"
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(5rem, 10vw, 9rem)',
            }}
          >
            “
          </motion.div>
          <motion.blockquote
            variants={fadeUp}
            className="font-fraunces italic text-ocheto-coffee-900 leading-[1.18] tracking-tight text-center"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
              fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
            }}
          >
            Ocheto nunca ha sido solamente una cafetería. Es una historia
            construida por personas que creen en los pequeños detalles.
          </motion.blockquote>
          <motion.div
            variants={fadeUp}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <span aria-hidden className="block h-px w-10 bg-ocheto-caramel-500/60" />
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-ocheto-coffee-700">
              Los ositos · Nuestra identidad
            </span>
          </motion.div>
        </motion.div>

        {/* ============ TIMELINE ============ */}
        <div className="relative mt-12 sm:mt-16">
          {/* Vertical timeline line (desktop) */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none"
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 2 100"
              preserveAspectRatio="none"
              fill="none"
            >
              <motion.line
                x1="1"
                y1="0"
                x2="1"
                y2="100"
                stroke="hsl(var(--ocheto-green-700))"
                strokeWidth="2"
                strokeDasharray="4 4"
                pathLength={1}
                variants={timelineDraw}
                style={{ opacity: 0.35 }}
              />
            </svg>
          </div>

          {/* Milestones */}
          <div className="space-y-20 sm:space-y-28 lg:space-y-40">
            {MILESTONES.map((m, i) => (
              <TimelineNode
                key={m.year}
                milestone={m}
                index={i}
                align={i % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>

          {/* Full historia — texto oficial Ocheto */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            className="mt-16 sm:mt-20 max-w-3xl mx-auto text-center"
          >
            <p className="text-ocheto-coffee-700/85 leading-relaxed text-base sm:text-lg">
              Con el paso del tiempo llegaron más clientes, más historias y nuevas
              oportunidades para crecer. Se incorporaron las primeras mesas, se amplió
              la oferta y cada vez más personas comenzaron a formar parte de la
              comunidad Ocheto.
            </p>
            <p className="mt-4 text-ocheto-coffee-700/85 leading-relaxed text-base sm:text-lg">
              El crecimiento continuó con la apertura de nuevas tiendas y la llegada
              de personas que compartían los mismos valores y la misma pasión por el
              servicio. Poco a poco se formó un equipo sólido, donde cada integrante
              aporta desde su experiencia, talento y compromiso.
            </p>
            <p className="mt-4 font-fraunces italic text-ocheto-coffee-900 text-base sm:text-lg leading-relaxed">
              Porque Ocheto nunca ha sido solamente una cafetería. Es una historia
              construida por personas que creen en los pequeños detalles, en el trabajo
              en equipo y en la importancia de crear momentos que merecen ser recordados.
            </p>
          </motion.div>
        </div>

        {/* ============ STATS BAR ============ */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-24 sm:mt-32 lg:mt-40 relative overflow-hidden rounded-3xl grain-texture"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--ocheto-green-900)) 0%, hsl(var(--ocheto-green-950)) 50%, hsl(var(--ocheto-green-800)) 100%)',
            boxShadow: '0 30px 80px -30px hsl(var(--ocheto-green-950) / 0.5)',
          }}
        >
          {/* inner glow */}
          <div
            aria-hidden
            className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-50 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--ocheto-gold-500) / 0.25) 0%, transparent 65%)',
              transform: 'translate(30%, -30%)',
            }}
          />
          <div
            aria-hidden
            className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full opacity-40 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--ocheto-caramel-500) / 0.18) 0%, transparent 65%)',
              transform: 'translate(-30%, 30%)',
            }}
          />

          <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-10 sm:py-14">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
              <motion.div variants={fadeUp} className="max-w-md">
                <span className="ocheto-subtitle text-ocheto-gold-500 text-[11px] sm:text-xs">
                  ·&nbsp;&nbsp;EN NÚMEROS&nbsp;&nbsp;·
                </span>
                <h3
                  className="mt-3 font-fraunces italic font-light text-ocheto-cream-50 leading-[1.05]"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.4vw, 2.6rem)',
                    fontVariationSettings: '"opsz" 144, "SOFT" 50',
                  }}
                >
                  Una década <span className="text-ocheto-gold-500">de altitud.</span>
                </h3>
              </motion.div>

              <motion.dl
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
                }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 flex-1"
              >
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label + i}
                    variants={fadeUp}
                    className="relative text-center lg:text-left pl-4 lg:pl-0 lg:border-l lg:border-white/10 first:lg:border-l-0 first:lg:pl-0"
                  >
                    <dt className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-white/55 font-semibold">
                      {stat.label}
                    </dt>
                    <dd
                      className="mt-2 font-fraunces italic font-light text-ocheto-cream-50 tabular-nums leading-none"
                      style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontVariationSettings: '"opsz" 144',
                      }}
                    >
                      {stat.value}
                    </dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </div>
        </motion.div>

        {/* ============ CLOSING NOTE + CTA ============ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="mt-14 sm:mt-20 flex flex-col items-center gap-5 text-center"
        >
          <p
            className="font-fraunces italic text-ocheto-coffee-700/80 max-w-2xl text-base sm:text-lg leading-relaxed"
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            Hoy contamos con tres tiendas y seguimos creciendo gracias al esfuerzo
            de muchas personas. Los ositos nos acompañan en cada detalle, promoción
            y rincón — la calidez que queremos compartir contigo.
          </p>
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 text-ocheto-green-700 font-semibold text-base sm:text-lg relative pb-1"
          >
            <span className="relative">
              Prueba nuestra carta
              <span
                aria-hidden
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
      </div>
    </section>
  );
}
