import { EASE } from '@/shared/motion';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import {
  Truck,
  Leaf,
  RotateCcw,
  MessageCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { FaqAccordion, type FaqItem } from '@/features/faq/FaqAccordion';

interface Benefit {
  icon: LucideIcon;
  title: string;
  detail: string;
  color: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: Truck,
    title: 'Retiro en tienda',
    detail: 'Federico Zuazo, Oruro e Illampu',
    color: '#D4A574',
  },
  {
    icon: Leaf,
    title: 'Tostado semanal',
    detail: 'Granos frescos, trazables',
    color: '#659753',
  },
  {
    icon: RotateCcw,
    title: 'Coordinación simple',
    detail: 'Pides por WhatsApp, retiras',
    color: '#E8B923',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp directo',
    detail: 'Respuesta en el día, La Paz',
    color: '#5C3A1E',
  },
];

const FAQS: FaqItem[] = [
  {
    question: '¿Cómo compro?',
    answer:
      'Eliges tus granos o merch en la tienda y das en “Comprar”. Se abre WhatsApp con tu pedido listo. Coordinamos retiro en la sucursal que elijas; no manejamos envíos ni pagos en línea por ahora.',
  },
  {
    question: '¿Cómo conservar el café?',
    answer:
      'En lugar fresco, seco y oscuro, dentro de su bolsa resellable. Evita la heladera. Consúmelo dentro de 30 días del tueste para notas óptimas.',
  },
  {
    question: '¿Tuestan cada semana?',
    answer:
      'Sí. Tostamos lotes pequeños cada semana en La Paz. Si tu grano favorito no está disponible, escríbenos y te avisamos del próximo tueste.',
  },
  {
    question: '¿Cambios?',
    answer:
      'Si tu grano llega con algún detalle, escríbenos el mismo día por WhatsApp con foto. Lo revisamos y coordinamos cambio en tienda.',
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
    transition: { duration: 0.65, ease: EASE },
  },
};

export default function ShopShipping() {
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
            Retiro en tienda y coordinación por WhatsApp. Fresco, trazable y
            sin letra pequeña.
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
              <FaqAccordion items={FAQS} variant="light" defaultOpenIndex={0} />
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
                  backgroundImage: 'url(/assets/grain.webp)',
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
                  Frescura garantizada.
                </h4>

                <p className="mt-3 text-white/80 text-sm sm:text-base leading-relaxed font-light">
                  Tostamos cada semana. Si tu bolsa no llega fresca, la
                  cambiamos en tienda el mismo día.
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['#E8B923', '#D4A574', '#659753'].map((c, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-ocheto-green-900 flex items-center justify-center text-[10px] font-black"
                        style={{ backgroundColor: c, color: '#2A1810' }}
                      >
                        ✓
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/70">
                    <span className="font-bold text-white">Tostado semanal</span> · La Paz
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
          transition={{ duration: 0.8, ease: EASE }}
          className="relative mt-14 sm:mt-16 lg:mt-20 rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="/assets/wallaper_2.webp"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover scale-110"
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
              Visítanos
            </motion.span>

            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-5 font-fraunces italic font-medium text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05]"
            >
              ¿Primera visita?{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-ocheto-gold-500">
                  Te esperamos
                </span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-white/15 -z-0 rounded-sm"
                />
              </span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-4 sm:mt-5 max-w-xl mx-auto text-white/80 text-sm sm:text-base leading-relaxed font-light"
            >
              Pásate por Federico Zuazo, Oruro o Illampu. Prueba, pregunta y
              llévate tu grano recién tostado.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-ocheto-gold-500 hover:bg-ocheto-caramel-500 text-ocheto-coffee-900 font-bold text-sm sm:text-base shadow-xl shadow-ocheto-gold-500/30 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                Ver menú
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/40 text-white hover:bg-white/10 font-semibold text-sm sm:text-base transition-all duration-300"
              >
                Cómo llegar
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
