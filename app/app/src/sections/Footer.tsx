import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Facebook,
  Instagram,
  Music2,
  MessageCircle,
  MapPin,
  Phone,
  Clock,
  Mail,
  ArrowRight,
  Send,
  Heart,
} from 'lucide-react';
import { SOCIAL_LINKS, LOCATIONS } from '@/data';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
  viewport: { once: true, margin: '-80px' },
};

const navLinks = [
  { label: 'Menú', to: '/menu' },
  { label: 'Tienda', to: '/tienda' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
];

const marqueeWords = [
  'INGREDIENTES DE CALIDAD',
  'PEQUEÑOS DETALLES',
  'TRES TIENDAS EN LA PAZ',
  'OSITOS OCHETO',
  'HECHO CON CARIÑO',
  'ALFAJORES DE CACAO',
  'DEDICACIÓN EN CADA PREPARACIÓN',
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    console.log('Newsletter signup:', email);
    setSubmitted(true);
    setEmail('');
    window.setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <footer
      className="relative w-full overflow-hidden grain-texture bg-ocheto-green-900 text-ocheto-cream-50"
    >
      {/* ===== TORN EDGE (TOP) — 3 layered SVG paths ===== */}
      <div className="torn-edge-top pointer-events-none">
        <svg
          viewBox="0 0 1440 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50C40 42 80 58 120 48C160 38 200 56 240 44C280 32 320 52 360 40C400 28 440 48 480 36C520 24 560 44 600 32C640 20 680 40 720 28C760 16 800 36 840 24C880 12 920 32 960 20C1000 8 1040 28 1080 16C1120 4 1160 24 1200 12C1240 0 1280 20 1320 8C1360 -4 1400 16 1440 4V110H0V50Z"
            fill="#FAF7F0"
          />
          <path
            d="M0 68C50 58 100 76 150 64C200 52 250 72 300 60C350 48 400 68 450 56C500 44 550 64 600 52C650 40 700 60 750 48C800 36 850 56 900 44C950 32 1000 52 1050 40C1100 28 1150 48 1200 36C1250 24 1300 44 1350 32C1400 20 1420 38 1440 30V110H0V68Z"
            fill="#F5F0E5"
            opacity="0.95"
          />
          <path
            d="M0 84C60 74 120 92 180 80C240 68 300 88 360 76C420 64 480 84 540 72C600 60 660 80 720 68C780 56 840 76 900 64C960 52 1020 72 1080 60C1140 48 1200 68 1260 56C1320 44 1380 64 1440 52V110H0V84Z"
            fill="#FAF7F0"
          />
        </svg>
      </div>

      {/* ===== MASSIVE WATERMARK "OCHETO" ===== */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 0.04, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeOut' as const }}
          className="font-fraunces font-black text-cream-50 leading-none tracking-[-0.05em] text-[16rem] sm:text-[22rem] md:text-[30rem] lg:text-[38rem] whitespace-nowrap"
          style={{ color: '#FAF7F0' }}
          aria-hidden
        >
          OCHETO
        </motion.span>
      </div>

      {/* ===== SUBTLE TOP GLOW ===== */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] opacity-30 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at top, hsl(var(--ocheto-caramel-500) / 0.25) 0%, transparent 60%)',
        }}
      />

      {/* ===== CONTENT ===== */}
      <div className="relative z-20 container-ocheto pt-28 sm:pt-36 lg:pt-44 pb-10">
        {/* ===== EDITORIAL BRAND STATEMENT ===== */}
        <motion.div
          {...fadeInUp}
          className="text-center mb-14 sm:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-10 bg-ocheto-caramel-500/60" />
            <span className="font-caveat text-xl sm:text-2xl text-ocheto-gold-500">
              tres tiendas
            </span>
            <span className="h-px w-10 bg-ocheto-caramel-500/60" />
          </div>

          <h2
            className="font-fraunces italic font-light leading-[0.95] tracking-[-0.02em] text-ocheto-cream-50 text-[clamp(3rem,9vw,7.5rem)]"
          >
            Hecho con <span className="text-ocheto-gold-500 italic">cariño</span>
          </h2>

          <p className="font-caveat text-2xl sm:text-3xl md:text-4xl text-ocheto-cream-100/80 mt-2 -rotate-2 inline-block">
            La Paz, Bolivia — para acompañarte en cualquier momento del día
          </p>
        </motion.div>

        {/* ===== NEWSLETTER ===== */}
        <motion.div
          {...fadeInUp}
          className="max-w-2xl mx-auto mb-20 sm:mb-24"
        >
          <div className="text-center mb-6">
            <p className="text-ocheto-cream-100/70 text-sm sm:text-base leading-relaxed">
              Sumate al <span className="text-ocheto-cream-50 font-medium">Club Ocheto</span> y recibí lanzamientos, catas y descuentos exclusivos antes que nadie.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative"
            aria-label="Formulario de suscripción al newsletter"
          >
            <div className="relative group">
              {/* glow ring on focus */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-ocheto-caramel-500/0 via-ocheto-gold-500/0 to-ocheto-caramel-500/0 group-focus-within:from-ocheto-caramel-500/40 group-focus-within:via-ocheto-gold-500/40 group-focus-within:to-ocheto-caramel-500/40 blur-md transition-all duration-500" />

              <div className="relative flex items-center bg-ocheto-cream-50/10 backdrop-blur-sm border border-ocheto-cream-50/20 rounded-full p-1.5 group-focus-within:border-ocheto-caramel-500/60 group-focus-within:bg-ocheto-cream-50/15 transition-all duration-300">
                <Mail className="ml-4 h-5 w-5 text-ocheto-cream-100/60 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  aria-label="Email"
                  disabled={submitted}
                  className="flex-1 bg-transparent border-none outline-none px-3 py-2.5 text-ocheto-cream-50 placeholder:text-ocheto-cream-100/40 text-sm sm:text-base font-inter"
                />
                <motion.button
                  type="submit"
                  disabled={submitted}
                  whileHover={{ scale: submitted ? 1 : 1.04 }}
                  whileTap={{ scale: submitted ? 1 : 0.96 }}
                  className="relative inline-flex items-center gap-2 rounded-full px-5 sm:px-6 py-2.5 bg-ocheto-cream-50 text-ocheto-green-900 font-semibold text-sm sm:text-base overflow-hidden disabled:opacity-90"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {submitted ? (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="inline-flex items-center gap-2"
                      >
                        ¡Listo! <Send className="h-4 w-4" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="inline-flex items-center gap-2"
                      >
                        Suscribirme <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-3 text-sm text-ocheto-gold-500 font-caveat text-xl"
                >
                  ¡Bienvenide al club! Te escribimos pronto ☕
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* ===== MAIN GRID ===== */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16 lg:mb-20"
        >
          {/* Column 1: Brand */}
          <motion.div
            variants={fadeInUp}
            className="text-center md:text-left lg:pr-4"
          >
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <img
                src="/assets/logo-ocheto.png"
                alt="Ocheto Coffee"
                className="h-12 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </Link>
            <h3
              className="font-fraunces italic text-2xl text-ocheto-cream-50 mb-3 leading-tight"
            >
              Hecho con <span className="text-ocheto-gold-500">cariño</span>.
            </h3>
            <p className="text-ocheto-cream-100/65 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Valoramos los ingredientes de calidad, la dedicación en cada preparación y los pequeños detalles que hacen especial cada momento. Tres tiendas para acompañarte.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs text-ocheto-cream-100/50 font-medium tracking-wider uppercase">
              <Heart className="h-3.5 w-3.5 text-ocheto-berry-500 fill-ocheto-berry-500" />
              <span>Hecho con cariño</span>
            </div>
          </motion.div>

          {/* Column 2: Navegación */}
          <motion.div
            variants={fadeInUp}
            className="text-center md:text-left"
          >
            <h4
              className="font-fraunces font-semibold text-lg text-ocheto-cream-50 mb-5 tracking-wide flex items-center justify-center md:justify-start gap-2"
            >
              <span className="h-px w-5 bg-ocheto-caramel-500" />
              Navegación
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-2 text-ocheto-cream-100/70 hover:text-ocheto-gold-500 transition-colors duration-300 text-sm sm:text-base"
                  >
                    <span className="h-1 w-1 rounded-full bg-ocheto-cream-100/30 group-hover:bg-ocheto-gold-500 group-hover:w-3 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Visítanos */}
          <motion.div
            variants={fadeInUp}
            className="text-center md:text-left"
          >
            <h4
              className="font-fraunces font-semibold text-lg text-ocheto-cream-50 mb-5 tracking-wide flex items-center justify-center md:justify-start gap-2"
            >
              <span className="h-px w-5 bg-ocheto-caramel-500" />
              Visítanos
            </h4>
            <div className="space-y-5">
              {LOCATIONS.map((loc) => (
                <div key={loc.id} className="text-sm">
                  <p className="font-semibold text-ocheto-cream-50 mb-1.5 font-fraunces italic">
                    {loc.name.replace('Ocheto ', '')}
                  </p>
                  <div className="flex items-start justify-center md:justify-start gap-2 text-ocheto-cream-100/70 leading-relaxed">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-ocheto-caramel-500" />
                    <span>{loc.address}, {loc.city}</span>
                  </div>
                </div>
              ))}

              <div className="pt-3 mt-3 border-t border-ocheto-cream-50/10 space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2 text-ocheto-cream-100/70 text-sm">
                  <Clock className="h-3.5 w-3.5 text-ocheto-caramel-500" />
                  <span>Lun–Sáb · 8:45 – 22:00</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-ocheto-cream-100/70 text-sm">
                  <Phone className="h-3.5 w-3.5 text-ocheto-caramel-500" />
                  <a
                    href={`tel:${LOCATIONS[0]?.phone?.replace(/\s/g, '')}`}
                    className="hover:text-ocheto-gold-500 transition-colors"
                  >
                    {LOCATIONS[0]?.phone}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 4: Síguenos */}
          <motion.div
            variants={fadeInUp}
            className="text-center md:text-left"
          >
            <h4
              className="font-fraunces font-semibold text-lg text-ocheto-cream-50 mb-5 tracking-wide flex items-center justify-center md:justify-start gap-2"
            >
              <span className="h-px w-5 bg-ocheto-caramel-500" />
              Síguenos
            </h4>
            <p className="text-ocheto-cream-100/65 text-sm mb-5 leading-relaxed">
              Detrás de cámara, latte art y cafecitos que se merecen un like.
            </p>

            <div className="flex justify-center md:justify-start gap-3 mb-6 flex-wrap">
              <SocialIcon
                href={SOCIAL_LINKS.facebook}
                label="Facebook"
                Icon={Facebook}
              />
              <SocialIcon
                href={SOCIAL_LINKS.instagram}
                label="Instagram"
                Icon={Instagram}
              />
              <SocialIcon
                href={SOCIAL_LINKS.tiktok}
                label="TikTok"
                Icon={Music2}
              />
              <SocialIcon
                href={SOCIAL_LINKS.whatsapp}
                label="WhatsApp"
                Icon={MessageCircle}
              />
            </div>

            <motion.a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 text-ocheto-cream-50 hover:bg-[#25D366]/25 hover:border-[#25D366]/60 transition-all duration-300 text-sm font-medium group"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>Pedí por WhatsApp</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* ===== MARQUEE STRIP ===== */}
        <motion.div
          {...fadeInUp}
          className="relative -mx-5 sm:-mx-8 lg:-mx-12 xl:-mx-16 mb-12 py-5 border-y border-ocheto-cream-50/10 bg-ocheto-green-950/40 overflow-hidden"
        >
          <div className="marquee">
            <div className="marquee-track">
              {[...marqueeWords, ...marqueeWords].map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className="inline-flex items-center gap-4 font-fraunces italic font-light text-xl sm:text-2xl md:text-3xl text-ocheto-cream-100/80 whitespace-nowrap"
                >
                  <span className="text-ocheto-gold-500">✦</span>
                  {word}
                </span>
              ))}
            </div>
            <div className="marquee-track" aria-hidden>
              {[...marqueeWords, ...marqueeWords].map((word, i) => (
                <span
                  key={`${word}-dup-${i}`}
                  className="inline-flex items-center gap-4 font-fraunces italic font-light text-xl sm:text-2xl md:text-3xl text-ocheto-cream-100/80 whitespace-nowrap"
                >
                  <span className="text-ocheto-gold-500">✦</span>
                  {word}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ===== BOTTOM BAR ===== */}
        <motion.div
          {...fadeInUp}
          className="pt-6 border-t border-ocheto-cream-50/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo-ocheto.png"
              alt="Ocheto"
              className="h-7 w-auto object-contain brightness-0 invert opacity-70"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="h-4 w-px bg-ocheto-cream-50/20" />
            <p className="text-ocheto-cream-100/50 text-xs tracking-widest uppercase">
              © {new Date().getFullYear()} Ocheto Coffee
            </p>
          </div>

          <p
            className="font-caveat text-xl text-ocheto-cream-100/70"
          >
            Hecho con cariño en La Paz, Bolivia
          </p>

          <div className="flex items-center gap-4 text-ocheto-cream-100/40 text-xs">
            <span className="hover:text-ocheto-cream-50 transition-colors cursor-pointer">Privacidad</span>
            <span>·</span>
            <span className="hover:text-ocheto-cream-50 transition-colors cursor-pointer">Términos</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

/* ===== Social Icon Button ===== */
function SocialIcon({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: typeof Facebook;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{
        scale: 1.15,
        y: -3,
        rotate: -5,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="group relative h-11 w-11 rounded-full bg-ocheto-cream-50/10 backdrop-blur-sm border border-ocheto-cream-50/20 flex items-center justify-center text-ocheto-cream-50 hover:bg-ocheto-caramel-500 hover:border-ocheto-caramel-500 hover:text-ocheto-green-900 transition-colors duration-300 overflow-hidden"
    >
      <span className="absolute inset-0 bg-ocheto-gold-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      <Icon className="relative h-5 w-5 group-hover:stroke-2 transition-all" strokeWidth={1.75} />
    </motion.a>
  );
}
