import { motion, useInView, type Variants } from 'framer-motion';
import { useRef } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Navigation,
  ArrowUpRight,
  Sparkles,
  Wifi,
  Sun,
  Users,
  Coffee,
  PawPrint,
  Briefcase,
  CalendarHeart,
  type LucideIcon,
} from 'lucide-react';
import { LOCATIONS } from '@/data';
import type { Location } from '@/types';
import { cn } from '@/lib/utils';

const FEATURE_ICONS: Record<string, LucideIcon> = {
  Wifi,
  'Para llevar': Coffee,
  Terraza: Sun,
  Eventos: CalendarHeart,
  Coworking: Briefcase,
  Catering: Users,
  'Pet-friendly': PawPrint,
};

const HEADER_EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: HEADER_EASE },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: 0.2 + idx * 0.15, ease: HEADER_EASE },
  }),
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4, y: -10 },
  visible: (idx: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 18,
      delay: 0.45 + idx * 0.07,
    },
  }),
};

const hourRowVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: (idx: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.6 + idx * 0.08, ease: HEADER_EASE },
  }),
};

function getWhatsAppUrl(whatsapp: string | undefined): string {
  if (!whatsapp) return '#';
  return `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;
}

interface LocationCardProps {
  location: Location;
  index: number;
}

function LocationCard({ location, index }: LocationCardProps) {
  const whatsAppUrl = getWhatsAppUrl(location.whatsapp);
  const isFirst = index === 0;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-ocheto-cream-50 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] border border-ocheto-cream-200/60"
    >
      {/* ===== IMAGE HEADER ===== */}
      <div className="relative h-64 sm:h-72 overflow-hidden">
        <motion.img
          src={location.image}
          alt={`Interior de ${location.name}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,36,14,0.25) 0%, rgba(8,36,14,0.05) 40%, rgba(8,36,14,0.85) 100%)',
          }}
        />

        {/* Decorative number stamp */}
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ocheto-cream-50/95 text-ocheto-green-900 font-black text-sm shadow-lg"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            0{index + 1}
          </span>
          <span className="text-[10px] uppercase tracking-[0.28em] text-ocheto-cream-50/90 font-semibold">
            {isFirst ? 'Original' : 'Tienda'}
          </span>
        </div>

        {/* Floating feature badges */}
        <div className="absolute top-5 right-5 flex flex-wrap justify-end gap-1.5 max-w-[60%]">
          {location.features.map((feature, i) => {
            const Icon = FEATURE_ICONS[feature];
            return (
              <motion.span
                key={feature}
                custom={i}
                variants={badgeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ocheto-cream-50/15 backdrop-blur-md border border-ocheto-cream-50/30 text-ocheto-cream-50 text-[10px] font-semibold tracking-wide uppercase"
              >
                {Icon && <Icon className="w-3 h-3" strokeWidth={2.5} />}
                {feature}
              </motion.span>
            );
          })}
        </div>

        {/* Location name overlay (bottom of image) */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <h3
            className="text-ocheto-cream-50 text-3xl sm:text-4xl leading-[1.05] font-black italic drop-shadow-lg"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Ocheto
            <br />
            <span className="text-ocheto-gold-500">{location.name.replace('Ocheto ', '')}</span>
          </h3>
        </div>
      </div>

      {/* ===== CARD BODY ===== */}
      <div className="flex flex-col gap-5 p-5 sm:p-6 bg-ocheto-cream-50">
        {/* Address */}
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex items-center justify-center w-9 h-9 rounded-full bg-ocheto-green-700/10 text-ocheto-green-700 shrink-0">
            <MapPin className="w-4 h-4" strokeWidth={2.5} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-ocheto-coffee-900 text-sm sm:text-base font-semibold leading-snug">
              {location.address}
            </p>
            <p className="text-ocheto-coffee-700/70 text-xs mt-0.5 uppercase tracking-wider">
              {location.city}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-ocheto-coffee-700/20 to-transparent" />

        {/* Hours */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Clock className="w-3.5 h-3.5 text-ocheto-green-700" strokeWidth={2.5} />
            <span className="text-[10px] uppercase tracking-[0.22em] text-ocheto-coffee-700/70 font-bold">
              Horarios
            </span>
          </div>
          <ul className="space-y-1.5">
            {location.hours.map((row, i) => (
              <motion.li
                key={row.day}
                custom={i}
                variants={hourRowVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-ocheto-coffee-900 font-medium">{row.day}</span>
                <span className="text-ocheto-coffee-900/80 tabular-nums font-semibold">
                  {row.time}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Phone */}
        <a
          href={`tel:${location.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 text-sm text-ocheto-coffee-900 hover:text-ocheto-green-700 transition-colors group/phone"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ocheto-coffee-900/5 text-ocheto-coffee-900 group-hover/phone:bg-ocheto-green-700/10 group-hover/phone:text-ocheto-green-700 transition-colors">
            <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
          </span>
          <span className="font-semibold tabular-nums">{location.phone}</span>
        </a>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-sm font-bold shadow-lg shadow-ocheto-green-700/20 hover:bg-ocheto-green-600 hover:shadow-xl hover:shadow-ocheto-green-700/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={2.5} />
            WhatsApp
          </a>
          <a
            href={location.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-ocheto-coffee-900 text-ocheto-cream-50 text-sm font-bold shadow-lg shadow-ocheto-coffee-900/20 hover:bg-ocheto-coffee-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Navigation className="w-4 h-4" strokeWidth={2.5} />
            Cómo llegar
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function MapPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.aside
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={2}
      className="relative overflow-hidden rounded-3xl bg-ocheto-coffee-900 border border-ocheto-cream-50/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] min-h-[420px] lg:min-h-[640px]"
    >
      {/* Top label */}
      <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocheto-cream-50/10 backdrop-blur-md border border-ocheto-cream-50/20">
          <MapPin className="w-3.5 h-3.5 text-ocheto-gold-500" strokeWidth={2.5} />
          <span className="text-[10px] uppercase tracking-[0.22em] text-ocheto-cream-50 font-bold">
            Mapa · La Paz
          </span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-ocheto-cream-50/50 font-semibold hidden sm:block">
          3 tiendas
        </div>
      </div>

      {/* SVG Map */}
      <svg
        viewBox="0 0 400 520"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mapBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a0f08" />
            <stop offset="100%" stopColor="#0d0703" />
          </linearGradient>
          <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3a2415" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1a0f08" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="mountainGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a1810" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0d0703" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8B923" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E8B923" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#FAF7F0"
              strokeOpacity="0.04"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="400" height="520" fill="url(#mapBg)" />
        <rect width="400" height="520" fill="url(#grid)" />

        {/* Dotted "streets" */}
        <g stroke="#FAF7F0" strokeOpacity="0.12" strokeWidth="1" fill="none" strokeDasharray="3 5">
          <path d="M 0 120 Q 100 130 200 140 T 400 150" />
          <path d="M 0 220 Q 120 200 220 240 T 400 220" />
          <path d="M 0 320 Q 100 340 200 320 T 400 340" />
          <path d="M 80 0 Q 90 100 100 200 T 110 520" />
          <path d="M 200 0 Q 210 120 220 240 T 230 520" />
          <path d="M 320 0 Q 310 100 320 220 T 330 520" />
        </g>

        {/* Mountain silhouettes — La Paz topography */}
        <g>
          {/* Far range */}
          <path
            d="M 0 380 L 50 340 L 90 360 L 140 310 L 190 340 L 240 300 L 290 330 L 340 290 L 400 320 L 400 520 L 0 520 Z"
            fill="url(#mountainGrad2)"
          />
          {/* Mid range */}
          <path
            d="M 0 420 L 60 390 L 110 410 L 160 370 L 220 400 L 280 360 L 340 395 L 400 380 L 400 520 L 0 520 Z"
            fill="url(#mountainGrad)"
          />
          {/* Illimani peak (the famous one) */}
          <path
            d="M 240 300 L 270 250 L 290 270 L 310 220 L 330 260 L 350 240 L 380 290 L 400 280 L 400 320 L 240 320 Z"
            fill="url(#mountainGrad)"
            opacity="0.95"
          />
          {/* Snow cap on Illimani */}
          <path
            d="M 310 220 L 318 232 L 322 228 L 326 234 L 330 226 L 330 240 L 310 240 Z"
            fill="#FAF7F0"
            opacity="0.5"
          />
        </g>

        {/* Connection line between pins (drawn on scroll) */}
        <motion.path
          d="M 110 140 Q 100 200 120 260 Q 130 320 140 380"
          fill="none"
          stroke="#E8B923"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.7 } : {}}
          transition={{ duration: 1.8, delay: 0.4, ease: 'easeOut' }}
        />

        {/* Pin 1 — Federico Zuazo */}
        <PinMarker x={110} y={140} label="Zuazo" delay={0.6} isInView={isInView} />

        {/* Pin 2 — Illampu */}
        <PinMarker x={120} y={260} label="Illampu" delay={0.85} isInView={isInView} />

        {/* Pin 3 — Oruro */}
        <PinMarker x={140} y={380} label="Oruro" delay={1.05} isInView={isInView} />

        {/* Compass */}
        <g transform="translate(345 60)" opacity="0.55">
          <circle cx="0" cy="0" r="18" fill="none" stroke="#FAF7F0" strokeOpacity="0.3" strokeWidth="1" />
          <path d="M 0 -14 L 3 0 L 0 14 L -3 0 Z" fill="#FAF7F0" fillOpacity="0.6" />
          <text x="0" y="-22" textAnchor="middle" fontSize="8" fill="#FAF7F0" fillOpacity="0.7" fontFamily="Inter">
            N
          </text>
        </g>
      </svg>

      {/* Bottom label */}
      <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-ocheto-cream-50/70 font-semibold">
          <span className="inline-block w-2 h-2 rounded-full bg-ocheto-gold-500 animate-pulse" />
          3,640 m.s.n.m
        </div>
        <p
          className="text-ocheto-cream-50/85 text-base italic leading-tight text-right"
          style={{ fontFamily: "'Caveat', cursive", fontWeight: 600 }}
        >
          La Paz,
          <br />
          Bolivia
        </p>
      </div>

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </motion.aside>
  );
}

interface PinMarkerProps {
  x: number;
  y: number;
  label: string;
  delay: number;
  isInView: boolean;
}

function PinMarker({ x, y, label, delay, isInView }: PinMarkerProps) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: HEADER_EASE }}
    >
      {/* Glow halo */}
      <motion.circle
        cx={x}
        cy={y}
        r="22"
        fill="url(#pinGlow)"
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay }}
      />
      {/* Pulse ring */}
      <motion.circle
        cx={x}
        cy={y}
        r="12"
        fill="none"
        stroke="#E8B923"
        strokeWidth="1.5"
        animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay }}
      />
      {/* Pin shape */}
      <g transform={`translate(${x} ${y})`}>
        <path
          d="M 0 -14 C -7.7 -14 -14 -8.5 -14 -1 C -14 9 0 18 0 18 C 0 18 14 9 14 -1 C 14 -8.5 7.7 -14 0 -14 Z"
          fill="#E8B923"
          stroke="#2A1810"
          strokeWidth="1"
        />
        <circle cx="0" cy="-2" r="4.5" fill="#2A1810" />
      </g>
      {/* Label background */}
      <rect
        x={x + 18}
        y={y - 11}
        width={label.length * 6.5 + 14}
        height="22"
        rx="11"
        fill="#FAF7F0"
        fillOpacity="0.95"
      />
      {/* Label text */}
      <text
        x={x + 25}
        y={y + 3}
        fontSize="10"
        fill="#2A1810"
        fontFamily="Inter"
        fontWeight="700"
        letterSpacing="0.05em"
      >
        {label.toUpperCase()}
      </text>
    </motion.g>
  );
}

export default function Locations() {
  return (
    <section
      id="locations"
      className={cn(
        'relative w-full overflow-hidden bg-ocheto-green-900 grain-texture section-padding'
      )}
      aria-label="Nuestras ubicaciones en La Paz"
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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUpVariants} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocheto-cream-50/10 backdrop-blur-md border border-ocheto-cream-50/20 text-ocheto-cream-50 text-[11px] font-bold tracking-[0.28em] uppercase">
              <Sparkles className="w-3 h-3 text-ocheto-gold-500" strokeWidth={2.5} />
              Tres tiendas · Una pasión
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={fadeUpVariants}
            className="text-ocheto-cream-50 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight font-black italic max-w-3xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Encuéntranos en el{' '}
            <span className="text-ocheto-gold-500">corazón</span> de La Paz.
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeUpVariants}
            className="mt-5 text-ocheto-cream-50/75 text-base sm:text-lg max-w-2xl leading-relaxed font-light"
          >
            Tres tiendas donde Ocheto te espera con la calidez de siempre. Ven a
            trabajar, leer, o simplemente ser.
          </motion.p>
        </motion.div>

        {/* ===== CARDS + MAP GRID ===== */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cards column (spans 2) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {LOCATIONS.map((location, idx) => (
              <LocationCard key={location.id} location={location} index={idx} />
            ))}
          </div>

          {/* Map column */}
          <div className="lg:col-span-1">
            <MapPreview />
          </div>
        </div>

        {/* ===== BOTTOM NOTE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: HEADER_EASE, delay: 0.2 }}
          className="mt-14 sm:mt-20 flex flex-col items-center text-center gap-3"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-ocheto-cream-50/20 bg-ocheto-cream-50/5 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-ocheto-gold-500" strokeWidth={2.5} />
            <p
              className="text-ocheto-cream-50 text-2xl sm:text-3xl"
              style={{ fontFamily: "'Caveat', cursive", fontWeight: 600 }}
            >
              Te esperamos con cariño
            </p>
            <Sparkles className="w-4 h-4 text-ocheto-gold-500" strokeWidth={2.5} />
          </div>
          <p className="text-ocheto-cream-50/55 text-xs sm:text-sm uppercase tracking-[0.28em] font-semibold">
            Tres tiendas · Una misma pasión
          </p>
        </motion.div>
      </div>
    </section>
  );
}
