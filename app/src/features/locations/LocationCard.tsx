import { motion, type Variants } from 'framer-motion';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Navigation,
  ArrowUpRight,
  Wifi,
  Sun,
  Users,
  Coffee,
  PawPrint,
  Briefcase,
  CalendarHeart,
  type LucideIcon,
} from 'lucide-react';
import type { Location } from '@/types';
import { EASE } from '@/shared/motion';
import { getWhatsAppUrl } from '@/shared/constants';

export const FEATURE_ICONS: Record<string, LucideIcon> = {
  Wifi,
  'Para llevar': Coffee,
  Terraza: Sun,
  Eventos: CalendarHeart,
  Coworking: Briefcase,
  Catering: Users,
  'Pet-friendly': PawPrint,
};

export type LocationCardVariant = 'home' | 'contact';

const homeCardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: 0.2 + idx * 0.15, ease: EASE },
  }),
};

const contactCardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

const homeBadgeVariants: Variants = {
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

const contactBadgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4, y: -8 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 18,
      delay: 0.5 + i * 0.07,
    },
  }),
};

const homeHourRowVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: (idx: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.6 + idx * 0.08, ease: EASE },
  }),
};

const contactHourRowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.55 + i * 0.07, ease: EASE },
  }),
};

interface LocationCardProps {
  location: Location;
  index: number;
  variant: LocationCardVariant;
}

export function LocationCard({ location, index, variant }: LocationCardProps) {
  const whatsAppUrl = getWhatsAppUrl(location.whatsapp);
  const isFirst = index === 0;
  const isHome = variant === 'home';

  const cardVariants = isHome ? homeCardVariants : contactCardVariants;
  const badgeVariants = isHome ? homeBadgeVariants : contactBadgeVariants;
  const hourRowVariants = isHome ? homeHourRowVariants : contactHourRowVariants;

  return (
    <motion.article
      custom={isHome ? index : undefined}
      variants={cardVariants}
      initial={isHome ? 'hidden' : undefined}
      whileInView={isHome ? 'visible' : undefined}
      viewport={isHome ? { once: true, amount: 0.2 } : undefined}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-ocheto-cream-50 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] border border-ocheto-cream-200/60${isHome ? '' : ' hover-lift'}`}
    >
      {/* ===== IMAGE HEADER ===== */}
      <div className={`relative ${isHome ? 'h-64 sm:h-72' : 'h-56 sm:h-64'} overflow-hidden`}>
        <motion.img
          src={location.image}
          alt={`Interior de ${location.name}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          whileHover={{ scale: isHome ? 1.05 : 1.06 }}
          transition={{ duration: 0.9, ease: EASE }}
        />

        {location.image !== '/assets/wallaper_2.webp' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isHome
                ? 'linear-gradient(180deg, rgba(8,36,14,0.25) 0%, rgba(8,36,14,0.05) 40%, rgba(8,36,14,0.85) 100%)'
                : 'linear-gradient(180deg, rgba(8,36,14,0.3) 0%, rgba(8,36,14,0.05) 40%, rgba(8,36,14,0.88) 100%)',
            }}
          />
        )}

        {/* Decorative number stamp */}
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ocheto-cream-50/95 text-ocheto-green-900 font-black text-sm shadow-lg"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            0{index + 1}
          </span>
          <span className="text-[10px] uppercase tracking-[0.28em] text-ocheto-cream-50/90 font-semibold">
            {isFirst ? 'Original' : 'Nuevo'}
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
                initial={isHome ? 'hidden' : undefined}
                whileInView={isHome ? 'visible' : undefined}
                viewport={isHome ? { once: true, amount: 0.5 } : undefined}
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
                initial={isHome ? 'hidden' : undefined}
                whileInView={isHome ? 'visible' : undefined}
                viewport={isHome ? { once: true, amount: 0.5 } : undefined}
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
