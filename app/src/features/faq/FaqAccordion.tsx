import { useState, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { EASE } from '@/shared/motion';
import { cn } from '@/lib/utils';

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

export type FaqVariant = 'dark' | 'light';

const darkListItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

interface FaqAccordionProps {
  items: FaqItem[];
  variant?: FaqVariant;
  defaultOpenIndex?: number;
}

export function FaqAccordion({
  items,
  variant = 'dark',
  defaultOpenIndex = 0,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggle = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  }, []);

  const isDark = variant === 'dark';

  if (isDark) {
    return (
      <>
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={item.id ?? item.question}
              variants={darkListItem}
              className="border-b border-ocheto-cream-50/10 last:border-b-0"
            >
              <motion.button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="group relative w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left focus:outline-none"
              >
                {/* Question text */}
                <span
                  className="font-fraunces italic font-bold text-ocheto-cream-50 text-lg sm:text-xl lg:text-2xl leading-snug transition-colors duration-300 group-hover:text-ocheto-gold-500"
                  style={{
                    fontVariationSettings: '"opsz" 144, "SOFT" 50',
                  }}
                >
                  {item.question}
                </span>

                {/* Animated chevron */}
                <motion.span
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    backgroundColor: isOpen
                      ? 'hsl(var(--ocheto-gold-500))'
                      : 'hsl(var(--ocheto-cream-50) / 0.08)',
                    borderColor: isOpen
                      ? 'hsl(var(--ocheto-gold-500))'
                      : 'hsl(var(--ocheto-cream-50) / 0.2)',
                  }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="shrink-0 inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border"
                >
                  <motion.span
                    animate={{
                      color: isOpen
                        ? 'hsl(var(--ocheto-coffee-900))'
                        : 'hsl(var(--ocheto-cream-50))',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.75} />
                  </motion.span>
                </motion.span>

                {/* Hover underline */}
                <motion.span
                  initial={false}
                  animate={{ scaleX: isOpen ? 0 : 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ transformOrigin: 'left' }}
                  className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-ocheto-gold-500/0 via-ocheto-gold-500/40 to-ocheto-gold-500/0 pointer-events-none"
                  aria-hidden
                />
              </motion.button>

              {/* Animated content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: { duration: 0.5, ease: EASE },
                        opacity: { duration: 0.4, delay: 0.1 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.4, ease: 'easeInOut' },
                        opacity: { duration: 0.2 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: -8 }}
                      animate={{ y: 0 }}
                      exit={{ y: -8 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="pb-6 sm:pb-7 pr-12 sm:pr-16"
                    >
                      <div className="flex items-start gap-4">
                        {/* Decorative bar */}
                        <motion.span
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                          style={{ transformOrigin: 'top' }}
                          className="shrink-0 w-0.5 self-stretch bg-gradient-to-b from-ocheto-gold-500 via-ocheto-caramel-500/60 to-transparent rounded-full"
                        />
                        <p className="text-white/90 text-base sm:text-lg leading-relaxed font-light">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </>
    );
  }

  // Light variant (ShopShipping style)
  return (
    <>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const isLast = index === items.length - 1;
        return (
          <div
            key={item.id ?? item.question}
            className={cn(!isLast && 'border-b border-ocheto-cream-200/70')}
          >
            <motion.button
              type="button"
              onClick={() => toggle(index)}
              whileHover={{ x: isOpen ? 0 : 2 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 text-left group"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
            >
              <span
                className={cn(
                  'font-fraunces font-bold text-base sm:text-lg leading-snug transition-colors duration-300',
                  isOpen
                    ? 'text-ocheto-green-700'
                    : 'text-ocheto-coffee-900 group-hover:text-ocheto-green-700',
                )}
              >
                {item.question}
              </span>
              <motion.span
                animate={{
                  rotate: isOpen ? 180 : 0,
                  backgroundColor: isOpen
                    ? 'hsl(var(--ocheto-green-700))'
                    : 'hsl(var(--ocheto-cream-100))',
                }}
                transition={{
                  duration: 0.35,
                  ease: EASE,
                }}
                className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full"
              >
                {isOpen ? (
                  <Minus
                    className="w-4 h-4 text-ocheto-cream-50"
                    strokeWidth={3}
                  />
                ) : (
                  <Plus
                    className="w-4 h-4 text-ocheto-coffee-900"
                    strokeWidth={3}
                  />
                )}
              </motion.span>
            </motion.button>

            {/* Collapsible content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${index}`}
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                    transition: {
                      height: {
                        duration: 0.4,
                        ease: EASE,
                      },
                      opacity: {
                        duration: 0.25,
                        delay: 0.1,
                      },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: {
                        duration: 0.3,
                        ease: EASE,
                      },
                      opacity: { duration: 0.15 },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-6 pb-5 pt-0 text-ocheto-coffee-700/85 text-sm sm:text-[15px] leading-relaxed font-light">
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-ocheto-gold-500 flex-shrink-0"
                      />
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
}
