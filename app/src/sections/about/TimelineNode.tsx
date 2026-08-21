import { EASE } from '@/shared/motion';
import { motion } from 'framer-motion';
import { MapPin, Quote, Sparkles } from 'lucide-react';

export interface Milestone {
  year: string;
  title: string;
  place: string;
  description: string;
  image: string;
  alt: string;
}

export const MILESTONES: Milestone[] = [
  {
    year: 'Inicio',
    title: 'Alfajores de cacao',
    place: 'Un apodo · Una idea',
    description:
      'Lo que empezó como un pequeño emprendimiento de alfajores, con dedicación y cariño, tomó forma poco a poco. El nombre Ocheto nació de un apodo y creció con nosotros.',
    image: '/assets/vaso-cafe.webp',
    alt: 'Alfajores Ocheto',
  },
  {
    year: 'Primera barra',
    title: 'Una barra hacia la calle',
    place: 'Pequeña · Cálida · Cercana',
    description:
      'La primera cafetería: sin grandes instalaciones, con una barra hacia la calle y la ilusión de ofrecer productos de calidad. Luego llegaron las primeras mesas y más personas a la comunidad.',
    image: '/assets/wallaper_2.webp',
    alt: 'Primera barra Ocheto',
  },
  {
    year: 'Hoy',
    title: 'Tres tiendas y ositos',
    place: 'Equipo · Comunidad',
    description:
      'Hoy contamos con tres tiendas y un equipo sólido que comparte valores y pasión por el servicio. Los ositos nos acompañan en promociones y coleccionables: calidez, cercanía y alegría.',
    image: '/assets/grain.webp',
    alt: 'Tres tiendas Ocheto',
  },
];

const MILESTONE_ICONS = [Sparkles, MapPin, Quote];

export function TimelineNode({
  milestone,
  index,
  align,
}: {
  milestone: Milestone;
  index: number;
  align: 'left' | 'right';
}) {
  const Icon = MILESTONE_ICONS[index % MILESTONE_ICONS.length];
  const isLeft = align === 'left';

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: 0.25 + index * 0.12, ease: EASE }}
      className={`relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
        isLeft ? '' : 'lg:[direction:rtl]'
      }`}
    >
      {/* Text */}
      <div className="lg:col-span-7 lg:[direction:ltr]">
        <div className="relative inline-flex items-center gap-2 mb-4">
          <span
            aria-hidden
            className="block w-1.5 h-1.5 rounded-full bg-ocheto-caramel-500"
          />
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-ocheto-green-700">
            {milestone.year} · {milestone.place}
          </span>
        </div>
        <h3
          className="font-fraunces italic font-medium text-ocheto-coffee-900 leading-[1.02]"
          style={{
            fontSize: 'clamp(1.75rem, 3.4vw, 2.6rem)',
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
          }}
        >
          {milestone.title}
        </h3>
        <p className="mt-4 text-base sm:text-lg text-ocheto-coffee-700/85 leading-relaxed max-w-xl">
          {milestone.description}
        </p>
      </div>

      {/* Visual */}
      <div className="lg:col-span-5 lg:[direction:ltr] relative">
        <motion.div
          whileHover={{ y: -6, rotate: isLeft ? 1 : -1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="relative aspect-[5/4] rounded-3xl overflow-hidden shadow-[0_24px_60px_-20px_hsl(var(--ocheto-coffee-900)/0.3)] bg-gradient-to-br from-ocheto-cream-100 to-ocheto-cream-200"
        >
          <img
            src={milestone.image}
            alt={milestone.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Floating year badge */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocheto-cream-50/95 backdrop-blur-sm shadow-md">
            <Icon className="w-3.5 h-3.5 text-ocheto-green-700" strokeWidth={2.5} />
            <span className="text-[10px] font-bold tracking-[0.22em] text-ocheto-green-700 uppercase">
              {milestone.year}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
