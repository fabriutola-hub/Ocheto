import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import {
  Truck,
  Leaf,
  RotateCcw,
  MessageCircle,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Benefit {
  icon: LucideIcon;
  title: string;
  detail: string;
  color: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: Truck,
    title: 'Envío gratis',
    detail: 'En compras +Bs 200 a toda Bolivia',
    color: '#D4A574',
  },
  {
    icon: Leaf,
    title: 'Empaque sostenible',
    detail: 'Bolsas reciclables y compostables',
    color: '#1B5E20',
  },
  {
    icon: RotateCcw,
    title: 'Devolución 30 días',
    detail: 'Si no te gusta, te devolvemos tu dinero',
    color: '#E8B923',
  },
  {
    icon: MessageCircle,
    title: 'Soporte directo',
    detail: 'WhatsApp con nuestro equipo de La Paz',
    color: '#5C3A1E',
  },
];

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: '¿Cuánto tarda el envío?',
    answer:
      'Dentro de La Paz y El Alto entregamos en 24 a 48 horas. Para el resto del país (Santa Cruz, Cochabamba, Sucre, Tarija y más) el envío toma entre 3 y 5 días hábiles vía encomienda. Te enviamos el número de seguimiento por WhatsApp.',
  },
  {
    question: '¿Cómo conservar el café?',
    answer:
      'Guarda tus granos en un lugar fresco, seco y oscuro — idealmente dentro de la bolsa resellable que te enviamos. Evita la nevera (atrapa olores). Para mantener la frescura óptima, consúmelos dentro de los 30 días posteriores al tueste. La fecha de tueste viene impresa en cada bolsa.',
  },
  {
    question: '¿Hacen suscripción mensual?',
    answer:
      '¡Sí! Nuestro Club Ocheto entrega bolsas frescas cada 2 o 4 semanas, con un 15% de descuento y acceso a microlotes exclusivos. Puedes pausar o cancelar cuando quieras desde tu cuenta.',
  },
  {
    question: '¿Aceptan devoluciones?',
    answer:
      'Si tu café llega en mal estado o simplemente no te gustó el perfil de tueste, tienes 30 días para solicitar cambio o reembolso completo. Solo escríbenos por WhatsApp con tu número de pedido y resolvemos.',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ShopShipping() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleFaq = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  }, []);

  const setContentRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      contentRefs.current[index] = el;
    },
    [],
  );

  return (
    <section
      id="shop-shipping"
      className="relative w-full overflow-hidden bg-ocheto-cream-100 section-padding"
    >
      {/* Decorative dotted bg */}
      <div
        aria-hidden
        className="absolute inset-0 dots-bg opacity-40 pointer-events-none"
      />
      {/* Top blob */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-ocheto-gold-500/10 blur-3xl pointer-events-none"
      />

      <div className="relative container-ocheto">
        {/* ===== Header ===== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative max-w-3xl mx-auto text-center mb-12 sm:mb-14 lg:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="absolute -top-2 right-2 sm:-top-4 sm:right-8 lg:right-16 font-caveat text-ocheto-gold-500 text-lg sm:text-xl lg:text-2xl rotate-[-6deg] select-none pointer-events-none"
          >
            sin sorpresas
          </motion.span>

          <motion.span
            variants={fadeUp}
            className="inline-block font-inter text-xs sm:text-sm font-semibold uppercase tracking-[0.32em] text-ocheto-green-700 mb-4 sm:mb-5"
          >
            <span className="inline-block w-6 h-px bg-ocheto-green-700 align-middle mr-2" />
            Envíos & Preguntas
            <span className="inline-block w-6 h-px bg-ocheto-green-700 align-middle ml-2" />
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="font-fraunces italic font-medium text-ocheto-coffee-900 leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
          >
            Te lo hacemos{' '}
            <span className="relative inline-block">
              <span className="relative z-10">fácil</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-ocheto-caramel-500/40 -z-0 rounded-sm"
              />
            </span>
            .
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-5 sm:mt-6 font-inter text-base sm:text-lg text-ocheto-coffee-900/70 leading-relaxed max-w-xl mx-auto"
          >
            Envíos seguros a toda Bolivia, empaque responsable y soporte
            humano. Si tienes dudas, aquí están las respuestas.
          </motion.p>
        </motion.div>

        {/* ===== Benefits grid ===== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-14 sm:mb-16 lg:mb-20"
        >
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group relative p-5 sm:p-6 rounded-2xl bg-white border border-ocheto-cream-200/70 hover:border-ocheto-green-700/30 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Hover bg accent */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${benefit.color}08 0%, transparent 60%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mb-4"
                  style={{
                    backgroundColor: `${benefit.color}12`,
                    border: `1.5px solid ${benefit.color}30`,
                  }}
                >
                  <Icon
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    strokeWidth={2.2}
                    style={{ color: benefit.color }}
                  />
                  {/* Sparkle corner */}
                  <Sparkles
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ color: benefit.color }}
                    fill="currentColor"
                  />
                </div>

                {/* Title */}
                <h3 className="relative font-fraunces font-black italic text-ocheto-coffee-900 text-xl sm:text-2xl leading-tight">
                  {benefit.title}
                </h3>

                {/* Detail */}
                <p className="relative mt-1.5 text-ocheto-coffee-700/75 text-sm leading-relaxed">
                  {benefit.detail}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===== Two-col: FAQ + Side ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* FAQ column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="lg:col-span-7 xl:col-span-7"
          >
            <motion.div variants={fadeUp} className="mb-5 sm:mb-6">
              <h3 className="font-fraunces font-black italic text-ocheto-coffee-900 text-2xl sm:text-3xl lg:text-4xl leading-tight">
                Preguntas frecuentes
              </h3>
              <p className="mt-1.5 text-ocheto-coffee-700/70 text-sm sm:text-base">
                Todo lo que necesitas saber antes de hacer tu pedido.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-3xl bg-white border border-ocheto-cream-200/70 shadow-sm overflow-hidden"
            >
              {FAQS.map((faq, index) => {
                const isOpen = openIndex === index;
                const isLast = index === FAQS.length - 1;
                return (
                  <div
                    key={faq.question}
                    className={cn(!isLast && 'border-b border-ocheto-cream-200/70')}
                  >
                    <motion.button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      whileHover={{ x: isOpen ? 0 : 2 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 text-left group"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                    >
                      <span
                        className={cn(
                          'font-fraunces font-bold text-base sm:text-lg leading-snug transition-colors duration-300',
                          isOpen
                            ? 'text-ocheto-green-700'
                            : 'text-ocheto-coffee-900 group-hover:text-ocheto-green-700',
                        )}
                      >
                        {faq.question}
                      </span>
                      <motion.span
                        animate={{
                          rotate: isOpen ? 180 : 0,
                          backgroundColor: isOpen
                            ? 'hsl(var(--ocheto-green-700))'
                            : 'hsl(var(--ocheto-cream-100))',
                        }}
                        transition={{
                          duration: 0.35,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full"
                      >
                        {isOpen ? (
                          <Minus
                            className="w-4 h-4 text-ocheto-cream-50"
                            strokeWidth={3}
                          />
                        ) : (
                          <Plus
                            className="w-4 h-4 text-ocheto-coffee-900"
                            strokeWidth={3}
                          />
                        )}
                      </motion.span>
                    </motion.button>

                    {/* Collapsible content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${index}`}
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: 'auto',
                            opacity: 1,
                            transition: {
                              height: {
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1],
                              },
                              opacity: {
                                duration: 0.25,
                                delay: 0.1,
                              },
                            },
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                              height: {
                                duration: 0.3,
                                ease: [0.16, 1, 0.3, 1],
                              },
                              opacity: { duration: 0.15 },
                            },
                          }}
                          className="overflow-hidden"
                        >
                          <div
                            ref={setContentRef(index)}
                            className="px-4 sm:px-6 pb-5 pt-0 text-ocheto-coffee-700/85 text-sm sm:text-[15px] leading-relaxed font-light"
                          >
                            <div className="flex items-start gap-3">
                              <span
                                aria-hidden
                                className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-ocheto-gold-500 flex-shrink-0"
                              />
                              <p>{faq.answer}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Side column — trust + contact */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="lg:col-span-5 xl:col-span-5 space-y-5"
          >
            {/* Trust card */}
            <motion.div
              variants={fadeUp}
              className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-ocheto-green-700 via-ocheto-green-800 to-ocheto-green-900 text-ocheto-cream-50 overflow-hidden shadow-xl shadow-ocheto-green-900/25"
            >
              {/* Decorative grain pattern */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: 'url(/assets/grain.png)',
                  backgroundSize: '200px 200px',
                  backgroundRepeat: 'repeat',
                }}
              />
              {/* Glow */}
              <div
                aria-hidden
                className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, hsl(var(--ocheto-gold-500) / 0.4) 0%, transparent 70%)',
                }}
              />

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-ocheto-gold-500" strokeWidth={2.5} />
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-bold text-ocheto-gold-500">
                    Garantía Ocheto
                  </span>
                </div>

                <h4 className="font-fraunces italic font-medium text-2xl sm:text-3xl leading-tight">
                  Si no te encanta, te devolvemos el 100%.
                </h4>

                <p className="mt-3 text-white/80 text-sm sm:text-base leading-relaxed font-light">
                  Probá tu café. Si el tueste o las notas no son para ti, lo
                  cambiamos o te reembolsamos sin preguntas. Así de simple.
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['#E8B923', '#D4A574', '#1B5E20'].map((c, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-ocheto-green-900 flex items-center justify-center text-[10px] font-black"
                        style={{ backgroundColor: c, color: c === '#E8B923' || c === '#D4A574' ? '#2A1810' : '#FAF7F0' }}
                      >
                        ✓
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/70">
                    <span className="font-bold text-white">30 días</span> para
                    cambiar de opinión.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact card */}
            <motion.div
              variants={fadeUp}
              className="relative p-6 sm:p-7 rounded-3xl bg-white border border-ocheto-cream-200/70 shadow-sm overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, hsl(var(--ocheto-matcha-500) / 0.18) 0%, transparent 70%)',
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-ocheto-green-700" strokeWidth={2.5} />
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-bold text-ocheto-green-700">
                    Habla con nosotros
                  </span>
                </div>

                <h4 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-xl sm:text-2xl leading-tight">
                  ¿Dudas con tu pedido?
                </h4>
                <p className="mt-2 text-ocheto-coffee-700/75 text-sm leading-relaxed">
                  Escríbenos por WhatsApp y te respondemos el mismo día.
                  Estamos en La Paz, horario de cafetería.
                </p>

                <a
                  href="https://wa.me/59170123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-ocheto-green-700 hover:bg-ocheto-green-600 text-ocheto-cream-50 font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  Abrir WhatsApp
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ===== Final CTA Banner ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14 sm:mt-16 lg:mt-20 rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="/assets/wallaper-2.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover scale-110"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(115deg, rgba(8,36,14,0.94) 0%, rgba(14,52,24,0.88) 50%, rgba(18,66,30,0.86) 100%)',
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: 'url(/assets/grain.png)',
                backgroundSize: '320px 320px',
                backgroundRepeat: 'repeat',
              }}
            />
          </div>

          {/* Floating sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { top: '12%', left: '8%', size: 6, delay: 0 },
              { top: '22%', right: '14%', size: 8, delay: 0.6 },
              { bottom: '20%', left: '12%', size: 5, delay: 1.2 },
              { bottom: '14%', right: '10%', size: 7, delay: 1.8 },
            ].map((p, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute rounded-full"
                style={{
                  top: p.top,
                  bottom: p.bottom,
                  left: p.left,
                  right: p.right,
                  width: p.size,
                  height: p.size,
                  backgroundColor: 'hsl(var(--ocheto-gold-500))',
                  boxShadow: `0 0 ${p.size * 2}px hsl(var(--ocheto-gold-500))`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: p.delay,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative px-6 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-16 text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-ocheto-gold-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em]"
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
              Club Ocheto
            </motion.span>

            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-5 font-fraunces italic font-medium text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05]"
            >
              ¿Quieres una{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-ocheto-gold-500">
                  suscripción
                </span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-white/15 -z-0 rounded-sm"
                />
              </span>
              <br className="hidden sm:block" />
              mensual?
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-4 sm:mt-5 max-w-xl mx-auto text-white/80 text-sm sm:text-base leading-relaxed font-light"
            >
              Café recién tostado en tu puerta cada 2 o 4 semanas. Ahorra 15%,
              descubre microlotes exclusivos y nunca te quedes sin tu ritual.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <Link
                to="/nosotros"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-ocheto-gold-500 hover:bg-ocheto-caramel-500 text-ocheto-coffee-900 font-bold text-sm sm:text-base shadow-xl shadow-ocheto-gold-500/30 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                Únete al Club
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/40 text-white hover:bg-white/10 font-semibold text-sm sm:text-base transition-all duration-300"
              >
                Hablar con un barista
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-6 font-caveat text-ocheto-cream-50/85 text-lg sm:text-xl"
            >
              pausa o cancela cuando quieras · sin contratos
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
