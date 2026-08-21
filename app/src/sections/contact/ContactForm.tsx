import { EASE, useInfiniteAnimation } from '@/shared/motion';
import { useState, useRef, useEffect, type FormEvent } from 'react';
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
  ArrowUpRight,
  Sparkles,
  User,
  AtSign,
  MessageSquareText,
  Heart,
} from 'lucide-react';
import { SOCIAL_LINKS } from '@/data';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { FloatingField, FloatingSelectField, formFieldVariants } from './FormFields';
import FormSuccess from './FormSuccess';

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
    transition: { duration: 0.75, ease: EASE },
  },
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
    transition: { duration: 0.55, ease: EASE },
  },
};

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
  const timers = useRef<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const animateInfinite = useInfiniteAnimation(sectionRef);

  useEffect(() => {
    const current = timers.current;
    return () => current.forEach((t) => window.clearTimeout(t));
  }, []);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        nombre: fields.nombre.trim(),
        email: fields.email.trim(),
        asunto: fields.asunto,
        mensaje: fields.mensaje.trim(),
      });
      if (error) throw error;

      // Intento de envío por Edge Function (si está desplegada y con SMTP/Resend). No bloquea el flujo.
      try {
        await supabase.functions.invoke('send-contact-email', {
          body: {
            nombre: fields.nombre.trim(),
            email: fields.email.trim(),
            asunto: fields.asunto,
            mensaje: fields.mensaje.trim(),
            to: 'ochetocoffe@gmail.com',
          },
        });
      } catch {
        // silenciado: el mensaje ya quedó guardado en contact_messages
      }

      setIsSuccess(true);
      toast.success('Mensaje enviado a Ocheto');
      timers.current.push(
        window.setTimeout(() => {
          setIsSuccess(false);
          setFields({ nombre: '', email: '', asunto: '', mensaje: '' });
          setErrors({});
        }, 3000),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo enviar el mensaje');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (key: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <section
      ref={sectionRef}
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
          ease: EASE,
          type: 'spring',
          stiffness: 140,
          damping: 14,
        }}
        className="absolute top-16 right-[6%] lg:right-[10%] z-20 pointer-events-none hidden md:block"
        style={{ transformOrigin: 'center' }}
      >
        <motion.div
          animate={
            animateInfinite
              ? { rotate: [-6, -2, -6], y: [0, -4, 0] }
              : undefined
          }
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
                Respondemos en el día. Si estamos en barra, te contestamos entre
                servicios.
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
                  <FormSuccess />
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
                    href="mailto:ochetocoffe@gmail.com"
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
                        ochetocoffe@gmail.com
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
