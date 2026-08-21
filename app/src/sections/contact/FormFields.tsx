import { EASE } from '@/shared/motion';
import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const formFieldVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.4 + i * 0.08, ease: EASE },
  }),
};

interface FloatingFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
  error?: string | null;
  multiline?: boolean;
  customIndex?: number;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  required?: boolean;
}

export function FloatingField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  error,
  multiline = false,
  customIndex = 0,
  icon: Icon,
  required = false,
}: FloatingFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;
  const hasError = !!error;

  return (
    <motion.div
      custom={customIndex}
      variants={formFieldVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      className="relative"
    >
      {/* Icon */}
      {Icon && (
        <motion.div
          animate={{
            color: hasError
              ? 'hsl(var(--ocheto-berry-500))'
              : isFocused
                ? 'hsl(var(--ocheto-green-700))'
                : 'hsl(var(--ocheto-coffee-700) / 0.5)',
          }}
          transition={{ duration: 0.2 }}
          className={multiline ? 'absolute left-5 top-5' : 'absolute left-5 top-1/2 -translate-y-1/2'}
        >
          <Icon className="w-4 h-4" strokeWidth={2.25} />
        </motion.div>
      )}

      {/* Field wrapper */}
      <div className="relative">
        {multiline ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={5}
            required={required}
            aria-invalid={hasError}
            className="peer w-full resize-none rounded-2xl bg-ocheto-cream-50 border-2 px-12 pt-7 pb-3 text-ocheto-coffee-900 placeholder-transparent focus:outline-none transition-all duration-300 text-base leading-relaxed"
            style={{
              borderColor: hasError
                ? 'hsl(var(--ocheto-berry-500))'
                : isFocused
                  ? 'hsl(var(--ocheto-green-700))'
                  : 'hsl(var(--ocheto-cream-200))',
              boxShadow: isFocused
                ? '0 12px 30px -12px hsl(var(--ocheto-green-700) / 0.25)'
                : 'none',
            }}
            placeholder=" "
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            aria-invalid={hasError}
            className="peer w-full h-16 rounded-2xl bg-ocheto-cream-50 border-2 px-12 text-ocheto-coffee-900 placeholder-transparent focus:outline-none transition-all duration-300 text-base"
            style={{
              borderColor: hasError
                ? 'hsl(var(--ocheto-berry-500))'
                : isFocused
                  ? 'hsl(var(--ocheto-green-700))'
                  : 'hsl(var(--ocheto-cream-200))',
              boxShadow: isFocused
                ? '0 12px 30px -12px hsl(var(--ocheto-green-700) / 0.25)'
                : 'none',
            }}
            placeholder=" "
          />
        )}

        {/* Animated floating label */}
        <motion.label
          htmlFor={id}
          animate={{
            y: isFloating ? (multiline ? -28 : -10) : 0,
            scale: isFloating ? 0.78 : 1,
            color: hasError
              ? 'hsl(var(--ocheto-berry-500))'
              : isFocused
                ? 'hsl(var(--ocheto-green-700))'
                : 'hsl(var(--ocheto-coffee-700) / 0.7)',
          }}
          transition={{ duration: 0.22, ease: EASE }}
          style={{
            transformOrigin: 'left top',
          }}
          className={
            multiline
              ? 'absolute left-12 top-3 pointer-events-none origin-left font-semibold text-sm tracking-wide'
              : 'absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none origin-left font-semibold text-sm tracking-wide'
          }
        >
          {label}
          {required && <span className="text-ocheto-berry-500 ml-1">*</span>}
        </motion.label>

        {/* Animated underline accent */}
        <motion.div
          initial={false}
          animate={{
            scaleX: isFocused ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            transformOrigin: 'left',
          }}
          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-ocheto-green-700 pointer-events-none"
        />
      </div>

      {/* Error message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-1.5 ml-5 text-xs text-ocheto-berry-500 font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface FloatingSelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  customIndex?: number;
  options: { value: string; label: string }[];
  required?: boolean;
}

export function FloatingSelectField({
  id,
  label,
  value,
  onChange,
  error,
  customIndex = 0,
  options,
  required = false,
}: FloatingSelectFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;
  const hasError = !!error;

  return (
    <motion.div
      custom={customIndex}
      variants={formFieldVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      className="relative"
    >
      <div className="relative">
        {/* Native select (invisible but accessible) */}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          aria-invalid={hasError}
          className="peer w-full h-16 appearance-none rounded-2xl bg-ocheto-cream-50 border-2 px-5 pr-12 text-ocheto-coffee-900 focus:outline-none transition-all duration-300 text-base cursor-pointer"
          style={{
            color: hasValue
              ? 'hsl(var(--ocheto-coffee-900))'
              : 'hsl(var(--ocheto-coffee-700) / 0.5)',
            borderColor: hasError
              ? 'hsl(var(--ocheto-berry-500))'
              : isFocused
                ? 'hsl(var(--ocheto-green-700))'
                : 'hsl(var(--ocheto-cream-200))',
            boxShadow: isFocused
              ? '0 12px 30px -12px hsl(var(--ocheto-green-700) / 0.25)'
              : 'none',
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <motion.div
          animate={{
            rotate: isFocused ? 180 : 0,
            color: hasError
              ? 'hsl(var(--ocheto-berry-500))'
              : isFocused
                ? 'hsl(var(--ocheto-green-700))'
                : 'hsl(var(--ocheto-coffee-700) / 0.6)',
          }}
          transition={{ duration: 0.25 }}
          className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
        </motion.div>

        {/* Floating label */}
        <motion.label
          htmlFor={id}
          animate={{
            y: isFloating ? -10 : 0,
            scale: isFloating ? 0.78 : 1,
            color: hasError
              ? 'hsl(var(--ocheto-berry-500))'
              : isFocused
                ? 'hsl(var(--ocheto-green-700))'
                : 'hsl(var(--ocheto-coffee-700) / 0.7)',
          }}
          transition={{ duration: 0.22, ease: EASE }}
          style={{ transformOrigin: 'left top' }}
          className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none origin-left font-semibold text-sm tracking-wide bg-ocheto-cream-50 px-1"
        >
          {label}
          {required && <span className="text-ocheto-berry-500 ml-1">*</span>}
        </motion.label>

        {/* Animated underline accent */}
        <motion.div
          initial={false}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ transformOrigin: 'left' }}
          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-ocheto-green-700 pointer-events-none"
        />
      </div>

      {/* Error */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-1.5 ml-5 text-xs text-ocheto-berry-500 font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
