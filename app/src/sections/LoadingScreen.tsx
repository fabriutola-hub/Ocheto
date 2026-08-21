import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

type Phase = 'brewing' | 'pouring' | 'served' | 'exiting';

const PHASES = [
  { key: 'tostando', label: 'Tostando grano a grano' },
  { key: 'moliendo', label: 'Moliendo en lotes pequeños' },
  { key: 'extrayendo', label: 'Extrayendo el ritual' },
  { key: 'sirviendo', label: 'Sirviendo con calidez' },
];

const RING_TEXT =
  'OCHETO · INGREDIENTES DE CALIDAD · HECHO CON CARIÑO · LA PAZ · BOLIVIA · ';

/* ----- motion variants ----- */
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 28, rotateX: -55, filter: 'blur(8px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: 0.3 + i * 0.18, ease: [0.16, 1, 0.3, 1] },
  }),
};

const phaseVariants: Variants = {
  initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.3, ease: 'easeIn' } },
};

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>('brewing');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [pct, setPct] = useState(0);
  const reduceMotion = useReducedMotion();

  const count = useMotionValue(0);

  useEffect(() => {
    const duration = reduceMotion ? 0.6 : 2.5;

    const controls = animate(count, 100, {
      duration,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        setPct(Math.round(v));
        if (v < 25) setPhaseIndex(0);
        else if (v < 55) setPhaseIndex(1);
        else if (v < 85) setPhaseIndex(2);
        else setPhaseIndex(3);
      },
    });

    const pouring = setTimeout(() => setPhase('pouring'), 900);
    const served = setTimeout(() => setPhase('served'), 2200);
    const exiting = setTimeout(() => setPhase('exiting'), 2700);
    const done = setTimeout(() => onComplete(), 3300);

    return () => {
      controls.stop();
      clearTimeout(pouring);
      clearTimeout(served);
      clearTimeout(exiting);
      clearTimeout(done);
    };
  }, [onComplete, count, reduceMotion]);

  const isExiting = phase === 'exiting';

  /* ----- liquid geometry (driven by pct) ----- */
  // cup interior: top y=150, bottom y=262
  const liquidTopY = 262 - (pct / 100) * 112; // 262 (empty) → 150 (full)
  const surfaceRx = 60 - ((liquidTopY - 150) / 112) * 18; // taper with cup

  /* ----- floating beans ----- */
  const beans = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: 8 + (i * 15.5) % 84,
        size: 7 + ((i * 7) % 8),
        delay: (i * 0.5) % 2.8,
        duration: 7 + ((i * 13) % 5),
        sway: (i % 2 === 0 ? 1 : -1) * (8 + (i * 3) % 12),
        opacity: 0.12 + ((i * 5) % 8) / 100,
      })),
    []
  );

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-ocheto-green-950"
      initial={{ opacity: 1 }}
      animate={
        isExiting
          ? { opacity: 0, scale: 1.06, filter: 'blur(14px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* ===== ATMOSPHERE: radial gradient ===== */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, hsl(123 58% 22%) 0%, hsl(122 38% 14%) 45%, hsl(116 32% 8%) 100%)',
          backgroundSize: '200% 200%',
        }}
        animate={
          isExiting
            ? { backgroundPosition: '50% 50%' }
            : { backgroundPosition: ['50% 50%', '60% 40%', '40% 60%', '50% 50%'] }
        }
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ===== AURORA MESH ===== */}
      <div
        aria-hidden
        className="absolute inset-0 aurora-mesh opacity-60 mix-blend-screen pointer-events-none"
      />

      {/* ===== SLOW CONIC AURORA GLOW ===== */}
      <motion.div
        aria-hidden
        animate={isExiting ? { opacity: 0 } : { rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[900px] max-h-[900px] conic-aurora opacity-50 pointer-events-none rounded-full"
      />

      {/* ===== GRAIN ===== */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: 'url(/assets/grain.png)',
          backgroundSize: '300px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* ===== FLOATING BEANS ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {beans.map((bean) => (
          <motion.div
            key={bean.id}
            className="absolute"
            style={{ left: `${bean.left}%`, bottom: '-40px' }}
            initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
            animate={
              isExiting
                ? { y: -50, opacity: 0 }
                : {
                    y: [-20, -(window.innerHeight + 60)],
                    x: [0, bean.sway, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, bean.opacity, bean.opacity, 0],
                  }
            }
            transition={{ duration: bean.duration, delay: bean.delay, repeat: Infinity, ease: 'linear' }}
          >
            <svg width={bean.size} height={bean.size * 1.4} viewBox="0 0 20 28" fill="none">
              <ellipse cx="10" cy="14" rx="8" ry="13" fill="hsl(39 47% 96%)" opacity="0.85" />
              <path
                d="M 10 3 Q 13 14 10 25"
                stroke="hsl(116 32% 18%)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ===== CENTER STAGE ===== */}
      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-md">
        {/* ----- Cup + ring composition ----- */}
        <motion.div
          className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={isExiting ? { opacity: 0, scale: 0.88 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Rotating brand ring */}
          <motion.div
            className="absolute inset-0"
            animate={isExiting ? { opacity: 0 } : { rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          >
            <svg viewBox="0 0 320 320" className="w-full h-full">
              <defs>
                <path
                  id="ringPath"
                  d="M 160,160 m -132,0 a 132,132 0 1,1 264,0 a 132,132 0 1,1 -264,0"
                />
              </defs>
              <circle cx="160" cy="160" r="132" fill="none" stroke="hsl(39 47% 96%)" strokeOpacity="0.08" strokeWidth="1" />
              <circle cx="160" cy="160" r="150" fill="none" stroke="hsl(42 82% 52%)" strokeOpacity="0.12" strokeWidth="0.5" strokeDasharray="2 6" />
              <text
                fill="hsl(39 47% 96%)"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.38em', fontWeight: 500 }}
                opacity="0.55"
              >
                <textPath href="#ringPath" startOffset="0%">
                  {RING_TEXT}
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Inner radial glow */}
          <motion.div
            className="absolute inset-10 rounded-full"
            style={{ background: 'radial-gradient(circle, hsla(123, 58%, 30%, 0.4) 0%, transparent 70%)' }}
            animate={isExiting ? { opacity: 0 } : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ====== CENTERPIECE: pour-over cup ====== */}
          <motion.div
            className="relative flex flex-col items-center"
            animate={isExiting ? { scale: 0.85, opacity: 0 } : { scale: [1, 1.03, 1], y: [0, -4, 0] }}
            transition={isExiting ? { duration: 0.5 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="200" height="260" viewBox="0 0 220 280" fill="none" className="relative z-10">
              <defs>
                <clipPath id="cupInterior">
                  <path d="M 50 150 L 170 150 L 158 250 Q 156 262 144 262 L 76 262 Q 64 262 62 250 Z" />
                </clipPath>
                <linearGradient id="coffeeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(32 55% 40%)" />
                  <stop offset="55%" stopColor="hsl(24 52% 24%)" />
                  <stop offset="100%" stopColor="hsl(18 48% 12%)" />
                </linearGradient>
                <radialGradient id="cremaGrad" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="hsl(34 62% 56%)" />
                  <stop offset="70%" stopColor="hsl(30 55% 42%)" />
                  <stop offset="100%" stopColor="hsl(26 50% 30%)" />
                </radialGradient>
                <linearGradient id="dropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(42 85% 62%)" />
                  <stop offset="100%" stopColor="hsl(28 70% 40%)" />
                </linearGradient>
              </defs>

              {/* ===== STEAM (rises from cup) ===== */}
              <g opacity="0.5">
                {[0, 1, 2].map((i) => (
                  <motion.path
                    key={i}
                    d={`M ${88 + i * 22} 145 Q ${82 + i * 22} 100 ${92 + i * 22} 60 T ${86 + i * 22} 10`}
                    stroke="hsl(39 47% 96%)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                      isExiting
                        ? { opacity: 0 }
                        : { pathLength: [0, 1, 1], opacity: [0, 0.45, 0], y: [0, -16, -32] }
                    }
                    transition={{ duration: 3, delay: i * 0.6, repeat: Infinity, ease: 'easeOut' }}
                  />
                ))}
              </g>

              {/* ===== FALLING DROP ===== */}
              <motion.ellipse
                cx="110"
                cy="60"
                rx="4"
                ry="7"
                fill="url(#dropGrad)"
                initial={{ opacity: 0 }}
                animate={
                  isExiting
                    ? { opacity: 0 }
                    : {
                        cy: [60, liquidTopY > 150 ? 150 : liquidTopY],
                        opacity: [0, 1, 1, 0],
                        scaleY: [1, 1.3, 0.7],
                      }
                }
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeIn', repeatDelay: 0.3 }}
                style={{ transformOrigin: 'center' }}
              />

              {/* ===== CUP OUTLINE ===== */}
              <path
                d="M 50 150 L 170 150 L 158 250 Q 156 262 144 262 L 76 262 Q 64 262 62 250 Z"
                fill="hsl(39 47% 96%)"
                opacity="0.06"
                stroke="hsl(39 47% 96%)"
                strokeWidth="1.5"
                strokeOpacity="0.4"
              />
              {/* Rim ellipse */}
              <ellipse cx="110" cy="150" rx="60" ry="7" fill="hsl(39 47% 96%)" opacity="0.12" stroke="hsl(39 47% 96%)" strokeOpacity="0.35" strokeWidth="1.5" />

              {/* ===== LIQUID (clipped) ===== */}
              <g clipPath="url(#cupInterior)">
                <rect x="50" width="120" y={liquidTopY} height={262 - liquidTopY} fill="url(#coffeeGrad)" />
                {/* crema surface */}
                {pct > 0 && (
                  <ellipse cx="110" cy={liquidTopY} rx={surfaceRx} ry={5} fill="url(#cremaGrad)" opacity="0.92" />
                )}
                {/* ripples */}
                {pct > 5 &&
                  [0, 1].map((i) => (
                    <motion.ellipse
                      key={i}
                      cx="110"
                      cy={liquidTopY}
                      rx={surfaceRx}
                      ry={5}
                      fill="none"
                      stroke="hsl(34 60% 56%)"
                      strokeWidth="1"
                      initial={{ opacity: 0.6, scale: 0.3 }}
                      animate={{ opacity: [0.6, 0], scale: [0.3, 1] }}
                      transition={{ duration: 1.6, delay: i * 0.8, repeat: Infinity, ease: 'easeOut' }}
                      style={{ transformOrigin: `110px ${liquidTopY}px` }}
                    />
                  ))}
              </g>

              {/* ===== CUP HANDLE ===== */}
              <path
                d="M 170 175 Q 202 185 202 212 Q 202 240 168 248"
                stroke="hsl(39 47% 96%)"
                strokeWidth="2.5"
                fill="none"
                opacity="0.4"
                strokeLinecap="round"
              />

              {/* ===== SAUCER SHADOW ===== */}
              <ellipse cx="110" cy="268" rx="58" ry="4" fill="hsl(0 0% 0%)" opacity="0.3" />
            </svg>

            {/* Logo beneath cup */}
            <motion.img
              src="/assets/logo-ocheto.png"
              alt="Ocheto Coffee"
              className="h-12 sm:h-14 w-auto object-contain -mt-6 relative z-20"
              style={{ filter: 'brightness(0) invert(1) drop-shadow(0 4px 14px rgba(0,0,0,0.5))' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            />
          </motion.div>
        </motion.div>

        {/* ===== HEADLINE — word reveal ===== */}
        <motion.div
          className="flex flex-col items-center mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isExiting ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ perspective: '800px' }}
        >
          <h1
            className="text-ocheto-cream-50 text-3xl sm:text-4xl md:text-5xl tracking-tight text-center flex items-baseline gap-2"
            style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 500 }}
          >
            <motion.span custom={0} variants={wordVariants} initial="hidden" animate="show" className="inline-block">
              Ocheto
            </motion.span>
            <motion.span
              custom={1}
              variants={wordVariants}
              initial="hidden"
              animate="show"
              className="inline-block text-gold-gradient"
              style={{ fontWeight: 600 }}
            >
              Coffee
            </motion.span>
          </h1>

          <motion.p
            className="mt-1 text-ocheto-cream-100/70 text-lg sm:text-xl text-center"
            style={{ fontFamily: "'Caveat', cursive", fontWeight: 500 }}
            initial={{ opacity: 0 }}
            animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Preparando el ritual…
          </motion.p>
        </motion.div>

        {/* ===== EDITORIAL PERCENTAGE COUNTER ===== */}
        <motion.div
          className="mt-5 flex items-baseline gap-1"
          initial={{ opacity: 0, y: 10 }}
          animate={isExiting ? { opacity: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span
            className="editorial-num text-ocheto-cream-50 text-5xl sm:text-6xl tabular-nums"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60' }}
          >
            {pct}
          </span>
          <span className="editorial-num text-ocheto-gold-500 text-2xl sm:text-3xl">%</span>
        </motion.div>

        {/* ===== PHASE PILLS (crossfade) ===== */}
        <div className="h-7 mt-3 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={phaseIndex}
              variants={phaseVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-ocheto-cream-50/75 text-[11px] sm:text-xs tracking-[0.3em] uppercase font-medium flex items-center gap-2"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-ocheto-gold-500 animate-pulse" />
              {PHASES[phaseIndex].label}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ===== REFINED PROGRESS BAR ===== */}
        <motion.div
          className="mt-5 w-60 sm:w-72"
          initial={{ opacity: 0 }}
          animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="relative h-[3px] bg-ocheto-cream-50/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, hsl(39 47% 96%) 0%, hsl(42 85% 62%) 100%)',
                boxShadow: '0 0 12px hsla(42, 85%, 62%, 0.6)',
              }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 w-12 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, hsla(42, 85%, 70%, 0.7), transparent)',
                filter: 'blur(2px)',
              }}
              animate={isExiting ? { opacity: 0 } : { x: ['0px', '230px'], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />
          </div>
        </motion.div>

        {/* ===== LOCATION TAG ===== */}
        <motion.p
          className="mt-7 text-ocheto-cream-50/30 text-[10px] tracking-[0.4em] uppercase"
          initial={{ opacity: 0 }}
          animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          La Paz · Bolivia · 3 tiendas
        </motion.p>
      </div>

      {/* ===== CORNER FRAMES (gold-touched) ===== */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-ocheto-cream-50/15">
        <span className="absolute top-0 left-0 w-3 h-px bg-ocheto-gold-500/50" />
        <span className="absolute top-0 left-0 h-3 w-px bg-ocheto-gold-500/50" />
      </div>
      <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-ocheto-cream-50/15">
        <span className="absolute top-0 right-0 w-3 h-px bg-ocheto-gold-500/50" />
        <span className="absolute top-0 right-0 h-3 w-px bg-ocheto-gold-500/50" />
      </div>
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-ocheto-cream-50/15">
        <span className="absolute bottom-0 left-0 w-3 h-px bg-ocheto-gold-500/50" />
        <span className="absolute bottom-0 left-0 h-3 w-px bg-ocheto-gold-500/50" />
      </div>
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-ocheto-cream-50/15">
        <span className="absolute bottom-0 right-0 w-3 h-px bg-ocheto-gold-500/50" />
        <span className="absolute bottom-0 right-0 h-3 w-px bg-ocheto-gold-500/50" />
      </div>
    </motion.div>
  );
}
