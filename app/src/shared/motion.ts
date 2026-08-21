import { useInView, useReducedMotion } from 'framer-motion';
import type { RefObject } from 'react';
import type { Variants } from 'framer-motion';

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Devuelve `true` solo cuando el elemento está (o está a punto de estar)
 * visible en el viewport y el usuario no prefiere movimiento reducido.
 * Sirve para pausar animaciones `repeat: Infinity` fuera de pantalla
 * sin cambiar el diseño.
 */
export function useInfiniteAnimation(ref: RefObject<Element | null>) {
  const inView = useInView(ref, { margin: '120px' });
  const reduced = useReducedMotion();
  return inView && !reduced;
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

export const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const pageTransition = {
  duration: 0.5,
  ease: EASE,
} as const;
