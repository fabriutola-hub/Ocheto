import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '@/data';

const formatDate = (iso: string): string => {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ];
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

function Stars({ rating, size = 16, gap = 'gap-0.5' }: { rating: number; size?: number; gap?: string }) {
  return (
    <div className={`flex items-center ${gap}`} aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            delay: i * 0.05,
            type: 'spring',
            stiffness: 380,
            damping: 18,
          }}
        >
          <Star
            size={size}
            className={
              i < rating
                ? 'fill-ocheto-gold-500 text-ocheto-gold-500'
                : 'fill-ocheto-cream-200 text-ocheto-cream-200'
            }
            strokeWidth={1.5}
          />
        </motion.span>
      ))}
    </div>
  );
}

const textFadeVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
};

interface TestimonialCardProps {
  testimonial: (typeof TESTIMONIALS)[number];
  isActive: boolean;
}

export default function TestimonialCard({ testimonial, isActive }: TestimonialCardProps) {
  return (
    <div
      className={[
        'flex flex-col h-full bg-white rounded-2xl shadow-md',
        'p-6 sm:p-8 md:p-10',
        'transition-[border,box-shadow] duration-500',
        isActive
          ? 'border border-ocheto-green-700/20 shadow-[0_30px_80px_-20px_hsla(var(--ocheto-green-900),0.25)]'
          : 'border border-ocheto-cream-200 shadow-md',
      ].join(' ')}
    >
      {/* Quote icon */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div
          className={[
            'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center',
            'bg-ocheto-green-700/10 text-ocheto-green-700',
            'transition-transform duration-500',
            isActive ? 'scale-100 rotate-0' : 'scale-90 -rotate-6',
          ].join(' ')}
        >
          <Quote size={20} className="sm:hidden" strokeWidth={2.25} fill="currentColor" />
          <Quote size={24} className="hidden sm:block" strokeWidth={2.25} fill="currentColor" />
        </div>
        <Stars rating={testimonial.rating} size={isActive ? 16 : 14} />
      </div>

      {/* Text */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={testimonial.id + '-text'}
            variants={textFadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={[
              'text-ocheto-coffee-900 leading-relaxed',
              isActive
                ? 'text-base sm:text-lg md:text-xl font-medium'
                : 'text-sm sm:text-base font-normal line-clamp-4',
            ].join(' ')}
          >
            “{testimonial.text}”
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {/* Author */}
      <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-ocheto-cream-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={[
              'relative shrink-0 rounded-full overflow-hidden ring-2 ring-offset-2',
              isActive ? 'ring-ocheto-green-700/40 ring-offset-white' : 'ring-ocheto-cream-200 ring-offset-white',
              'transition-all duration-500',
              isActive ? 'w-11 h-11 sm:w-12 sm:h-12' : 'w-9 h-9 sm:w-10 sm:h-10',
            ].join(' ')}
          >
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              loading="lazy"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div
              className="font-bold text-ocheto-coffee-900 truncate"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {testimonial.name}
            </div>
            <div className="text-xs sm:text-sm text-ocheto-coffee-700/70 truncate">
              {testimonial.role}
            </div>
          </div>
        </div>
        <div className="text-[10px] sm:text-xs text-ocheto-coffee-700/50 text-right shrink-0">
          {formatDate(testimonial.date)}
        </div>
      </div>
    </div>
  );
}
