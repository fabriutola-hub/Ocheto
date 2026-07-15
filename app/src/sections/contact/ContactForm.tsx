import { useState, type FormEvent } from 'react';
import {
  motion,
  AnimatePresence,
  type Variants,
} from 'framer-motion';
import {
  Send,
  Mail,
  MessageCircle,
  Instagram,
  Check,
  ArrowUpRight,
  Sparkles,
  User,
  AtSign,
  MessageSquareText,
  ChevronDown,
  Heart,
} from 'lucide-react';
import { SOCIAL_LINKS } from '@/data';

const HEADER_EASE = [0.16, 1, 0.3, 1] as const;

type FormFields = {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
};

const ASUNTO_OPTIONS = [
  { value: '', label: 'Elige un tema' },
  { value: 'consulta', label: 'Consulta general' },
  { value: 'catering', label: 'Catering' },
  { value: 'eventos', label: 'Eventos & catas' },
  { value: 'suscripcion', label: 'Suscripción' },
  { value: 'otro', label: 'Otro' },
];

const headerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: HEADER_EASE },
  },
};

const formFieldVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.4 + i * 0.08, ease: HEADER_EASE },
  }),
};

const altContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.55 },
  },
};

const altItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: HEADER_EASE },
  },
};

const successVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: HEADER_EASE },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
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

function FloatingField({
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
          transition={{ duration: 0.22, ease: HEADER_EASE }}
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
          transition={{ duration: 0.4, ease: HEADER_EASE }}
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

function FloatingSelectField({
  id,
  label,
  value,
  onChange,
  error,
  customIndex = 0,
  options,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  customIndex?: number;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
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
          transition={{ duration: 0.22, ease: HEADER_EASE }}
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
          transition={{ duration: 0.4, ease: HEADER_EASE }}
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

export default function ContactForm() {
  const [fields, setFields] = useState<FormFields>({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const validate = (): boolean => {
    const next: Partial<FormFields> = {};
    if (!fields.nombre.trim()) next.nombre = 'Tu nombre, por favor.';
    if (!fields.email.trim()) {
      next.email = 'Necesitamos tu correo.';
    } else if (!validateEmail(fields.email)) {
      next.email = 'Ese correo no se ve bien.';
    }
    if (!fields.asunto) next.asunto = 'Elige un tema.';
    if (!fields.mensaje.trim() || fields.mensaje.trim().length < 8) {
      next.mensaje = 'Cuéntanos un poco más.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;
    if (!validate()) return;

    setIsSubmitting(true);

    window.setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Contact form submission:', fields);
      setIsSubmitting(false);
      setIsSuccess(true);

      window.setTimeout(() => {
        setIsSuccess(false);
        setFields({ nombre: '', email: '', asunto: '', mensaje: '' });
        setErrors({});
      }, 3000);
    }, 650);
  };

  const updateField = (key: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <section
      id="contact-form"
      className="relative w-full overflow-hidden bg-ocheto-cream-50 dots-bg section-padding"
      aria-label="Formulario de contacto"
    >
      {/* ===== Background decorative ===== */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.06]"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-green-700)) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full pointer-events-none opacity-[0.05]"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-caramel-500)) 0%, transparent 70%)',
        }}
      />

      {/* Floating handwritten note */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.85,
          delay: 0.5,
          ease: HEADER_EASE,
          type: 'spring',
          stiffness: 140,
          damping: 14,
        }}
        className="absolute top-16 right-[6%] lg:right-[10%] z-20 pointer-events-none hidden md:block"
        style={{ transformOrigin: 'center' }}
      >
        <motion.div
          animate={{ rotate: [-6, -2, -6], y: [0, -4, 0] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5,
          }}
          className="relative px-4 py-2 rounded-lg"
          style={{
            background: 'hsl(var(--ocheto-cream-50) / 0.95)',
            boxShadow: '0 12px 32px -10px hsl(var(--ocheto-coffee-900) / 0.3)',
            border: '1px solid hsl(var(--ocheto-cream-200))',
          }}
        >
          <span
            className="font-caveat text-3xl sm:text-4xl leading-none block whitespace-nowrap"
            style={{ color: 'hsl(var(--ocheto-gold-500))' }}
          >
            Te leemos ✦
          </span>
          {/* Tape */}
          <span
            aria-hidden
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 rounded-sm -rotate-3"
            style={{ background: 'hsl(var(--ocheto-gold-500) / 0.55)' }}
          />
        </motion.div>
      </motion.div>

      {/* ===== Container ===== */}
      <div className="relative z-10 container-ocheto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* ============================================ */}
          {/* LEFT — Form                                   */}
          {/* ============================================ */}
          <div className="lg:col-span-7">
            <motion.div
              variants={headerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="max-w-2xl"
            >
              {/* Eyebrow */}
              <motion.div variants={fadeUp} className="mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocheto-green-700/10 border border-ocheto-green-700/20 text-ocheto-green-700 text-[11px] font-bold tracking-[0.28em] uppercase">
                  <Mail className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Escríbenos
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                variants={fadeUp}
                className="font-fraunces italic font-black text-ocheto-coffee-900 leading-[1.02] tracking-tight"
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
                  fontVariationSettings: '"opsz" 144, "SOFT" 60',
                }}
              >
                Cuéntanos qué tienes en{' '}
                <span className="text-ocheto-green-700">mente.</span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-4 text-ocheto-coffee-700/80 text-base sm:text-lg max-w-xl leading-relaxed"
              >
                Respondemos cada mensaje. A veces toma unas horas porque estamos
                sirviendo café, pero siempre volvemos.
              </motion.p>
            </motion.div>

            {/* ===== Form ===== */}
            <div className="mt-10 max-w-2xl">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                    noValidate
                  >
                    <FloatingField
                      id="nombre"
                      label="Tu nombre"
                      value={fields.nombre}
                      onChange={(v) => updateField('nombre', v)}
                      error={errors.nombre}
                      customIndex={0}
                      icon={User}
                      required
                    />

                    <FloatingField
                      id="email"
                      label="Tu correo electrónico"
                      type="email"
                      value={fields.email}
                      onChange={(v) => updateField('email', v)}
                      error={errors.email}
                      customIndex={1}
                      icon={AtSign}
                      required
                    />

                    <FloatingSelectField
                      id="asunto"
                      label="Asunto"
                      value={fields.asunto}
                      onChange={(v) => updateField('asunto', v)}
                      error={errors.asunto}
                      customIndex={2}
                      options={ASUNTO_OPTIONS}
                      required
                    />

                    <FloatingField
                      id="mensaje"
                      label="Tu mensaje"
                      value={fields.mensaje}
                      onChange={(v) => updateField('mensaje', v)}
                      error={errors.mensaje}
                      multiline
                      customIndex={3}
                      icon={MessageSquareText}
                      required
                    />

                    {/* Submit */}
                    <motion.div
                      custom={4}
                      variants={formFieldVariants}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: '-50px' }}
                      className="pt-2"
                    >
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-base sm:text-lg overflow-hidden disabled:opacity-80"
                        style={{
                          background:
                            'linear-gradient(135deg, hsl(var(--ocheto-green-700)) 0%, hsl(var(--ocheto-green-600)) 100%)',
                          color: 'hsl(var(--ocheto-cream-50))',
                          boxShadow:
                            '0 12px 30px -8px hsl(var(--ocheto-green-700) / 0.4), inset 0 1px 0 hsl(var(--ocheto-cream-50) / 0.2)',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {/* Shine effect */}
                        <span
                          aria-hidden
                          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                          style={{
                            background:
                              'linear-gradient(90deg, transparent, hsl(var(--ocheto-cream-50) / 0.4), transparent)',
                          }}
                        />
                        <span className="relative">
                          {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
                        </span>
                        {isSubmitting ? (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                            className="relative w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                          />
                        ) : (
                          <Send
                            className="relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                            strokeWidth={2.5}
                          />
                        )}
                      </motion.button>

                      {/* Reassurance */}
                      <p className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-ocheto-coffee-700/60">
                        <span
                          aria-hidden
                          className="block w-1.5 h-1.5 rounded-full bg-ocheto-green-400"
                        />
                        Te respondemos en menos de 24 horas.
                      </p>
                    </motion.div>
                  </motion.form>
                ) : (
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
                        ease: HEADER_EASE,
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
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ============================================ */}
          {/* RIGHT — Alternative contacts                  */}
          {/* ============================================ */}
          <div className="lg:col-span-5">
            <motion.div
              variants={headerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="lg:sticky lg:top-28"
            >
              <motion.div variants={fadeUp} className="mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocheto-caramel-500/10 border border-ocheto-caramel-500/25 text-ocheto-caramel-600 text-[11px] font-bold tracking-[0.28em] uppercase">
                  <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                  O escríbenos directo
                </span>
              </motion.div>

              <motion.h3
                variants={fadeUp}
                className="font-fraunces italic font-black text-ocheto-coffee-900 leading-[1.05] tracking-tight"
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  fontVariationSettings: '"opsz" 144, "SOFT" 50',
                }}
              >
                Si prefieres <span className="text-ocheto-caramel-600">vías rápidas.</span>
              </motion.h3>

              <motion.p
                variants={fadeUp}
                className="mt-3 text-ocheto-coffee-700/75 text-sm sm:text-base leading-relaxed"
              >
                Elige el canal que te sea más cómodo. Contestamos todos.
              </motion.p>

              {/* Alt contact cards */}
              <motion.ul
                variants={altContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
                className="mt-8 space-y-3"
              >
                {/* Email */}
                <motion.li variants={altItem}>
                  <a
                    href="mailto:hola@ocheto.coffee"
                    className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-ocheto-cream-50 border border-ocheto-cream-200 hover:border-ocheto-green-700/40 hover:shadow-[0_18px_40px_-15px_hsl(var(--ocheto-green-900)/0.18)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span
                      className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl"
                      style={{
                        background:
                          'linear-gradient(135deg, hsl(var(--ocheto-green-700) / 0.12) 0%, hsl(var(--ocheto-green-700) / 0.05) 100%)',
                        border:
                          '1px solid hsl(var(--ocheto-green-700) / 0.2)',
                      }}
                    >
                      <Mail
                        className="w-5 h-5 text-ocheto-green-700"
                        strokeWidth={2.25}
                      />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-ocheto-coffee-700/60 font-bold">
                        Email
                      </div>
                      <div className="text-ocheto-coffee-900 font-semibold text-sm sm:text-base truncate group-hover:text-ocheto-green-700 transition-colors">
                        hola@ocheto.coffee
                      </div>
                    </div>
                    <ArrowUpRight
                      className="w-4 h-4 text-ocheto-coffee-700/50 group-hover:text-ocheto-green-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                      strokeWidth={2.5}
                    />
                  </a>
                </motion.li>

                {/* WhatsApp */}
                <motion.li variants={altItem}>
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-ocheto-cream-50 border border-ocheto-cream-200 hover:border-[#25D366]/40 hover:shadow-[0_18px_40px_-15px_rgba(37,211,102,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span
                      className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(37,211,102,0.12) 0%, rgba(37,211,102,0.05) 100%)',
                        border: '1px solid rgba(37,211,102,0.25)',
                      }}
                    >
                      <MessageCircle
                        className="w-5 h-5"
                        style={{ color: '#25D366' }}
                        strokeWidth={2.25}
                      />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-ocheto-coffee-700/60 font-bold">
                        WhatsApp
                      </div>
                      <div className="text-ocheto-coffee-900 font-semibold text-sm sm:text-base group-hover:text-[#1da851] transition-colors">
                        +591 70123456
                      </div>
                    </div>
                    <ArrowUpRight
                      className="w-4 h-4 text-ocheto-coffee-700/50 group-hover:text-[#25D366] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                      strokeWidth={2.5}
                    />
                  </a>
                </motion.li>

                {/* Instagram */}
                <motion.li variants={altItem}>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-ocheto-cream-50 border border-ocheto-cream-200 hover:border-[#E1306C]/40 hover:shadow-[0_18px_40px_-15px_rgba(225,48,108,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span
                      className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(225,48,108,0.12) 0%, rgba(253,29,29,0.05) 100%)',
                        border: '1px solid rgba(225,48,108,0.25)',
                      }}
                    >
                      <Instagram
                        className="w-5 h-5"
                        style={{ color: '#E1306C' }}
                        strokeWidth={2.25}
                      />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-ocheto-coffee-700/60 font-bold">
                        Instagram DM
                      </div>
                      <div className="text-ocheto-coffee-900 font-semibold text-sm sm:text-base group-hover:text-[#E1306C] transition-colors">
                        @ocheto2020
                      </div>
                    </div>
                    <ArrowUpRight
                      className="w-4 h-4 text-ocheto-coffee-700/50 group-hover:text-[#E1306C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                      strokeWidth={2.5}
                    />
                  </a>
                </motion.li>
              </motion.ul>

              {/* Handwritten note */}
              <motion.div
                variants={fadeUp}
                className="mt-10 flex items-start gap-3 p-5 rounded-2xl bg-ocheto-coffee-900/5 border border-ocheto-coffee-900/10"
              >
                <Heart
                  className="w-4 h-4 mt-1 text-ocheto-berry-500 shrink-0"
                  strokeWidth={2.5}
                  fill="hsl(var(--ocheto-berry-500))"
                />
                <div>
                  <p
                    className="font-caveat text-xl sm:text-2xl text-ocheto-coffee-900 leading-tight"
                    style={{ fontVariationSettings: '"opsz" 144' }}
                  >
                    Prometemos contestar con cariño.
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-ocheto-coffee-700/70 leading-snug">
                    Detrás de cada mensaje hay una persona real leyendo.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
