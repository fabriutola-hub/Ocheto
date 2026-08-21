import { useState } from 'react';
import {
  motion,
  AnimatePresence,
  type Variants,
} from 'framer-motion';
import { Plus, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const HEADER_EASE = [0.16, 1, 0.3, 1] as const;

const FAQ_ITEMS = [
  {
    id: 'wifi',
    question: '¿Tienen WiFi?',
    answer:
      'Sí, WiFi de alta velocidad en ambas sedes. Sin contraseña — solo conecta y empieza a crear. Ideal para trabajar o estudiar.',
  },
  {
    id: 'mascotas',
    question: '¿Aceptan mascotas?',
    answer:
      'Sí, somos pet-friendly en Calacachi. En Sopocachi también, siempre que tu peludo se sienta cómodo entre laptops y lattes. Trae su correa y un snack.',
  },
  {
    id: 'catering',
    question: '¿Hacen catering?',
    answer:
      'Sí, para eventos privados y corporativos. Desde barras de café hasta menús completos. Escríbenos a hola@ocheto.coffee con los detalles y armamos una propuesta a tu medida.',
  },
  {
    id: 'granos',
    question: '¿Venden café en grano?',
    answer:
      'Sí, en nuestra tienda online y en ambas sedes físicas. Trabajamos con microlotes de Caranavi y Apolo, tostados cada semana en pequeñas cantidades.',
  },
  {
    id: 'vegano',
    question: '¿Tienen opciones veganas?',
    answer:
      'Sí, todas nuestras leches tienen alternativa vegetal: avena, coco, almendras. Nuestra panadería también ofrece opciones veganas todos los días.',
  },
  {
    id: 'eventos',
    question: '¿Hacen eventos?',
    answer:
      'Sí, desde catas privadas hasta workshops de barismo y latte art. Para grupos de 4 a 20 personas. Escríbenos y diseñamos la experiencia juntos.',
  },
];

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
    transition: { duration: 0.75, ease: HEADER_EASE },
  },
};

const listContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.4 },
  },
};

const listItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: HEADER_EASE },
  },
};

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      variants={listItem}
      className="border-b border-ocheto-cream-50/10 last:border-b-0"
    >
      <motion.button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group relative w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left focus:outline-none"
      >
        {/* Question text */}
        <span
          className="font-fraunces italic font-bold text-ocheto-cream-50 text-lg sm:text-xl lg:text-2xl leading-snug transition-colors duration-300 group-hover:text-ocheto-gold-500"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
          }}
        >
          {question}
        </span>

        {/* Animated chevron */}
        <motion.span
          animate={{
            rotate: isOpen ? 45 : 0,
            backgroundColor: isOpen
              ? 'hsl(var(--ocheto-gold-500))'
              : 'hsl(var(--ocheto-cream-50) / 0.08)',
            borderColor: isOpen
              ? 'hsl(var(--ocheto-gold-500))'
              : 'hsl(var(--ocheto-cream-50) / 0.2)',
          }}
          transition={{ duration: 0.4, ease: HEADER_EASE }}
          className="shrink-0 inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border"
        >
          <motion.span
            animate={{
              color: isOpen
                ? 'hsl(var(--ocheto-coffee-900))'
                : 'hsl(var(--ocheto-cream-50))',
            }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.75} />
          </motion.span>
        </motion.span>

        {/* Hover underline */}
        <motion.span
          initial={false}
          animate={{ scaleX: isOpen ? 0 : 1 }}
          transition={{ duration: 0.4, ease: HEADER_EASE }}
          style={{ transformOrigin: 'left' }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-ocheto-gold-500/0 via-ocheto-gold-500/40 to-ocheto-gold-500/0 pointer-events-none"
          aria-hidden
        />
      </motion.button>

      {/* Animated content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.5, ease: HEADER_EASE },
                opacity: { duration: 0.4, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.4, ease: 'easeInOut' },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.4, ease: HEADER_EASE }}
              className="pb-6 sm:pb-7 pr-12 sm:pr-16"
            >
              <div className="flex items-start gap-4">
                {/* Decorative bar */}
                <motion.span
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: HEADER_EASE }}
                  style={{ transformOrigin: 'top' }}
                  className="shrink-0 w-0.5 self-stretch bg-gradient-to-b from-ocheto-gold-500 via-ocheto-caramel-500/60 to-transparent rounded-full"
                />
                <p className="text-ocheto-cream-100/85 text-base sm:text-lg leading-relaxed font-light">
                  {answer}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ContactFAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden bg-ocheto-green-900 grain-texture section-padding"
      aria-label="Preguntas frecuentes"
    >
      {/* ===== BACKGROUND DECORATIVE: large faded "?" ===== */}
      <div
        aria-hidden
        className="absolute -top-10 -right-10 lg:-right-20 pointer-events-none select-none z-0"
      >
        <span
          className="block font-black leading-none italic"
          style={{
            fontFamily: "'Fraunces', serif",
            color: '#FAF7F0',
            fontSize: 'clamp(20rem, 40vw, 42rem)',
            opacity: 0.04,
            letterSpacing: '-0.05em',
            lineHeight: 0.8,
          }}
        >
          ?
        </span>
      </div>

      {/* Secondary small question marks scattered */}
      <motion.div
        aria-hidden
        animate={{ rotate: [0, 6, -4, 0], y: [0, -8, 4, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-24 left-[8%] pointer-events-none select-none z-0 hidden lg:block"
      >
        <span
          className="block font-black italic leading-none"
          style={{
            fontFamily: "'Fraunces', serif",
            color: '#FAF7F0',
            fontSize: 'clamp(4rem, 8vw, 9rem)',
            opacity: 0.05,
          }}
        >
          ?
        </span>
      </motion.div>

      {/* Decorative dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0 dots-bg opacity-40 pointer-events-none z-[1]"
      />

      {/* Decorative glow */}
      <div
        aria-hidden
        className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30 z-[1]"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-gold-500) / 0.08) 0%, transparent 60%)',
        }}
      />

      {/* ===== Container ===== */}
      <div className="relative z-10 container-ocheto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* ============================================ */}
          {/* LEFT — Header                                  */}
          {/* ============================================ */}
          <div className="lg:col-span-5">
            <motion.div
              variants={headerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="lg:sticky lg:top-28"
            >
              <motion.div variants={fadeUp} className="mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocheto-cream-50/10 backdrop-blur-md border border-ocheto-cream-50/20 text-ocheto-cream-50 text-[11px] font-bold tracking-[0.28em] uppercase">
                  <HelpCircle className="w-3.5 h-3.5 text-ocheto-gold-500" strokeWidth={2.5} />
                  FAQ
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className="font-fraunces italic font-black text-ocheto-cream-50 leading-[1.02] tracking-tight"
                style={{
                  fontSize: 'clamp(2.6rem, 6vw, 4.5rem)',
                  fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
                }}
              >
                Preguntas{' '}
                <span className="text-ocheto-gold-500">frecuentes.</span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-5 text-ocheto-cream-100/75 text-base sm:text-lg leading-relaxed max-w-md"
              >
                Si tienes una pregunta que no está aquí, escríbenos. Con gusto te
                ayudamos — siempre con un café al lado.
              </motion.p>

              {/* Still have questions card */}
              <motion.div
                variants={fadeUp}
                className="mt-10 relative overflow-hidden rounded-2xl border border-ocheto-cream-50/15 p-5 sm:p-6"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--ocheto-green-800)) 0%, hsl(var(--ocheto-green-950)) 100%)',
                }}
              >
                <div
                  aria-hidden
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, hsl(var(--ocheto-gold-500) / 0.2) 0%, transparent 70%)',
                  }}
                />
                <div className="relative flex items-start gap-3">
                  <span
                    className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full"
                    style={{
                      background:
                        'linear-gradient(135deg, hsl(var(--ocheto-gold-500)) 0%, hsl(var(--ocheto-caramel-500)) 100%)',
                    }}
                  >
                    <Sparkles
                      className="w-4 h-4"
                      style={{ color: 'hsl(var(--ocheto-coffee-900))' }}
                      strokeWidth={2.5}
                    />
                  </span>
                  <div className="min-w-0">
                    <p
                      className="font-fraunces italic font-bold text-ocheto-cream-50 text-lg sm:text-xl leading-tight"
                      style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
                    >
                      ¿Aún con dudas?
                    </p>
                    <p className="mt-1 text-sm text-ocheto-cream-100/70 leading-snug">
                      Escríbenos al formulario de arriba o por WhatsApp.
                    </p>
                  </div>
                </div>

                <Link
                  to="/menu"
                  className="group relative mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ocheto-cream-50 text-ocheto-green-900 text-sm font-bold hover:bg-ocheto-gold-500 transition-colors duration-300 overflow-hidden"
                >
                  <span className="relative">Ver la carta</span>
                  <ArrowRight
                    className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    strokeWidth={2.5}
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* ============================================ */}
          {/* RIGHT — Accordion                              */}
          {/* ============================================ */}
          <div className="lg:col-span-7">
            <motion.div
              variants={listContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="rounded-3xl p-6 sm:p-8 lg:p-10 border border-ocheto-cream-50/10"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--ocheto-green-950) / 0.5) 0%, hsl(var(--ocheto-green-800) / 0.4) 100%)',
                backdropFilter: 'blur(12px)',
                boxShadow:
                  '0 30px 80px -30px hsl(var(--ocheto-green-950) / 0.6)',
              }}
            >
              {FAQ_ITEMS.map((item) => (
                <FAQItem
                  key={item.id}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openId === item.id}
                  onToggle={() =>
                    setOpenId((prev) => (prev === item.id ? null : item.id))
                  }
                />
              ))}
            </motion.div>

            {/* Bottom CTA strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: HEADER_EASE }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center"
            >
              <span className="text-ocheto-cream-100/65 text-sm">
                ¿Listo para visitarnos?
              </span>
              <Link
                to="/"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ocheto-cream-50/25 bg-ocheto-cream-50/5 text-ocheto-cream-50 text-sm font-bold hover:bg-ocheto-cream-50 hover:text-ocheto-green-900 transition-all duration-300"
              >
                Volver al inicio
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.5}
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
