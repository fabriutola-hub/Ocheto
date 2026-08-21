import { EASE } from '@/shared/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

type Phase = 'brewing' | 'pouring' | 'served' | 'exiting';

const BREWING_STAGES = ['Tostando...', 'Preparando...', 'Sirviendo...'];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>('brewing');
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const brewing = setTimeout(() => setPhase('pouring'), 1000);
    const serving = setTimeout(() => setPhase('served'), 2200);
    const exiting = setTimeout(() => setPhase('exiting'), 2500);
    const done = setTimeout(() => onComplete(), 3000);

    const stage1 = setTimeout(() => setStageIndex(1), 1100);
    const stage2 = setTimeout(() => setStageIndex(2), 1700);

    return () => {
      clearTimeout(brewing);
      clearTimeout(serving);
      clearTimeout(exiting);
      clearTimeout(done);
      clearTimeout(stage1);
      clearTimeout(stage2);
    };
  }, [onComplete]);

  const isExiting = phase === 'exiting';
  const cupFill = phase === 'brewing' ? 0.3 : phase === 'pouring' ? 0.75 : 1;

  const beans = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: 5 + (i * 11.7) % 90,
        size: 8 + ((i * 7) % 10),
        delay: (i * 0.35) % 2.5,
        duration: 6 + ((i * 13) % 5),
        sway: (i % 2 === 0 ? 1 : -1) * (10 + (i * 3) % 14),
        opacity: 0.18 + ((i * 5) % 10) / 100,
      })),
    []
  );

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-ocheto-green-950"
      initial={{ y: 0 }}
      animate={isExiting ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, hsl(var(--ocheto-green-700)) 0%, hsl(var(--ocheto-green-900)) 45%, hsl(var(--ocheto-green-950)) 100%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['50% 50%', '60% 40%', '40% 60%', '50% 50%'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: 'url(/assets/grain.webp)',
          backgroundSize: '300px',
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {beans.map((bean) => (
          <motion.div
            key={bean.id}
            className="absolute"
            style={{
              left: `${bean.left}%`,
              bottom: '-40px',
            }}
            initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
            animate={
              isExiting
                ? { y: -50, opacity: 0 }
                : {
                    y: [-20, -window.innerHeight - 60],
                    x: [0, bean.sway, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, bean.opacity, bean.opacity, 0],
                  }
            }
            transition={{
              duration: bean.duration,
              delay: bean.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg
              width={bean.size}
              height={bean.size * 1.4}
              viewBox="0 0 20 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse
                cx="10"
                cy="14"
                rx="8"
                ry="13"
                fill="hsl(39 47% 96%)"
                opacity="0.85"
              />
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

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute bottom-1/3 left-1/2 -translate-x-1/2 opacity-30"
          width="200"
          height="80"
          viewBox="0 0 200 80"
          fill="none"
        >
          {[0, 1, 2].map((i) => (
            <motion.path
              key={i}
              d={`M ${70 + i * 30} 80 Q ${65 + i * 30} 50 ${75 + i * 30} 20 T ${80 + i * 30} -10`}
              stroke="hsl(39 47% 96%)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isExiting
                  ? { opacity: 0 }
                  : {
                      pathLength: [0, 1, 1],
                      opacity: [0, 0.4, 0],
                      y: [0, -20, -40],
                    }
              }
              transition={{
                duration: 3,
                delay: i * 0.6,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-md">
        <motion.div
          className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={isExiting ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <path
                  id="circularPath"
                  d="M 150,150 m -120,0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0"
                />
              </defs>
              <text
                fill="hsl(39 47% 96%)"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.4em', fontWeight: 500 }}
                opacity="0.55"
              >
                <textPath href="#circularPath" startOffset="0%">
                  OCHETO · CAFÉ DE ESPECIALIDAD · TOSTADO ARTESANAL · LA PAZ · BOLIVIA ·
                </textPath>
              </text>
            </svg>
          </motion.div>

          <motion.div
            className="absolute inset-8 rounded-full"
            style={{
              background:
                'radial-gradient(circle, hsla(123, 58%, 30%, 0.4) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="relative flex flex-col items-center"
            animate={
              isExiting
                ? { scale: 0.85, opacity: 0 }
                : { scale: [1, 1.04, 1], y: [0, -4, 0] }
            }
            transition={
              isExiting
                ? { duration: 0.5 }
                : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-2"
            >
              <defs>
                <clipPath id="cupClip">
                  <path d="M 20 45 L 100 45 L 92 105 Q 90 112 83 112 L 37 112 Q 30 112 28 105 Z" />
                </clipPath>
                <linearGradient id="coffeeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(28 70% 32%)" />
                  <stop offset="100%" stopColor="hsl(18 50% 18%)" />
                </linearGradient>
              </defs>

              <ellipse
                cx="60"
                cy="45"
                rx="40"
                ry="6"
                fill="hsl(39 47% 96%)"
                opacity="0.15"
              />

              <path
                d="M 20 45 L 100 45 L 92 105 Q 90 112 83 112 L 37 112 Q 30 112 28 105 Z"
                fill="hsl(39 47% 96%)"
                opacity="0.08"
                stroke="hsl(39 47% 96%)"
                strokeWidth="1.5"
                strokeOpacity="0.4"
              />

              <g clipPath="url(#cupClip)">
                <motion.rect
                  x="20"
                  y={45 - (cupFill * 60) + 60}
                  width="80"
                  height={cupFill * 65}
                  fill="url(#coffeeGrad)"
                  initial={{ y: 60 }}
                  animate={{ y: 60 - cupFill * 65 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
                <motion.ellipse
                  cx="60"
                  cy={45 - (cupFill * 60) + 60}
                  rx="40"
                  ry="4"
                  fill="hsl(28 60% 38%)"
                  opacity="0.9"
                  initial={{ cy: 60 }}
                  animate={{ cy: 60 - cupFill * 65 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </g>

              <path
                d="M 100 55 Q 118 60 118 78 Q 118 95 100 95"
                stroke="hsl(39 47% 96%)"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
                strokeLinecap="round"
              />

              <ellipse
                cx="60"
                cy="115"
                rx="30"
                ry="3"
                fill="hsl(0 0% 0%)"
                opacity="0.25"
              />
            </svg>

            <motion.img
              src="/assets/logo-ocheto.webp"
              alt="Ocheto Coffee"
              className="h-14 sm:h-16 w-auto object-contain -mt-12 relative z-10"
              style={{
                filter:
                  'brightness(0) invert(1) drop-shadow(0 4px 14px rgba(0,0,0,0.5))',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isExiting ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h1
            className="text-ocheto-cream-50 text-3xl sm:text-4xl md:text-5xl tracking-tight text-center"
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: 'italic',
              fontWeight: 500,
              fontVariationSettings: '"SOFT" 50, "WONK" 1',
            }}
          >
            Ocheto <span className="text-ocheto-gold-500">Coffee</span>
          </h1>

          <p
            className="mt-1 text-ocheto-cream-100/70 text-lg sm:text-xl text-center"
            style={{ fontFamily: "'Caveat', cursive", fontWeight: 500 }}
          >
            Preparando el ritual...
          </p>
        </motion.div>

        <div className="h-8 mt-4 flex items-center justify-center overflow-hidden w-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={stageIndex}
              className="text-ocheto-cream-50/80 text-xs sm:text-sm tracking-[0.3em] uppercase font-medium"
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {BREWING_STAGES[stageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.div
          className="mt-6 w-56 sm:w-64 md:w-72"
          initial={{ opacity: 0 }}
          animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="relative h-[3px] bg-ocheto-cream-50/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, hsl(39 47% 96%) 0%, hsl(42 85% 65%) 100%)',
                boxShadow: '0 0 12px hsla(42, 85%, 65%, 0.6)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 w-12 rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, hsla(42, 85%, 70%, 0.7), transparent)',
                filter: 'blur(2px)',
              }}
              initial={{ x: '-50px', opacity: 0 }}
              animate={{ x: '260px', opacity: [0, 1, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.4,
              }}
            />
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block w-1.5 h-1.5 rounded-full bg-ocheto-cream-50"
                animate={{
                  opacity: [0.25, 1, 0.25],
                  scale: [0.7, 1.3, 0.7],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.22,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.p
          className="mt-8 text-ocheto-cream-50/30 text-[10px] tracking-[0.4em] uppercase"
          initial={{ opacity: 0 }}
          animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          La Paz · Bolivia
        </motion.p>
      </div>

      <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-ocheto-cream-50/15" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-ocheto-cream-50/15" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-ocheto-cream-50/15" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-ocheto-cream-50/15" />
    </motion.div>
  );
}
