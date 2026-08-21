import { EASE } from '@/shared/motion';
import { motion, type Variants } from 'framer-motion';
import { Check } from 'lucide-react';

export const successVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

export default function FormSuccess() {
  return (
    <motion.div
      key="success"
      variants={successVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="relative flex flex-col items-center text-center px-6 py-14 sm:py-20 rounded-3xl overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, hsl(var(--ocheto-green-900)) 0%, hsl(var(--ocheto-green-800)) 100%)',
        boxShadow:
          '0 30px 70px -20px hsl(var(--ocheto-green-950) / 0.5)',
      }}
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-gold-500) / 0.25) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.55,
          ease: EASE,
          delay: 0.15,
        }}
        className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6"
        style={{
          background:
            'linear-gradient(135deg, hsl(var(--ocheto-gold-500)) 0%, hsl(var(--ocheto-caramel-500)) 100%)',
          boxShadow:
            '0 12px 32px hsl(var(--ocheto-gold-500) / 0.4)',
        }}
      >
        <Check
          className="w-10 h-10 sm:w-12 sm:h-12"
          strokeWidth={3}
          style={{ color: 'hsl(var(--ocheto-coffee-900))' }}
        />
      </motion.div>

      <h3
        className="font-fraunces italic font-black text-ocheto-cream-50 leading-[1.05] tracking-tight"
        style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontVariationSettings: '"opsz" 144, "SOFT" 60',
        }}
      >
        ¡Gracias por escribirte!
      </h3>
      <p className="mt-3 text-ocheto-cream-100/85 text-base sm:text-lg max-w-md leading-relaxed">
        Te respondemos pronto. Mientras tanto, sírvete otro café.{' '}
        <span className="inline-block">💚</span>
      </p>

      <div
        className="mt-6 font-caveat text-2xl sm:text-3xl"
        style={{ color: 'hsl(var(--ocheto-gold-500))' }}
      >
        — El equipo de Ocheto
      </div>
    </motion.div>
  );
}
