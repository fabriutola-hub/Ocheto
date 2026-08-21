import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AuthLayout, { inputClass, labelClass, primaryButtonClass } from './AuthLayout';

const GENERIC_MESSAGE =
  'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.';

export default function Recover() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setSubmitting(false);
    setSent(true);
  };

  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace por correo para restablecerla."
      footer={
        <p>
          ¿Recordaste tu contraseña?{' '}
          <Link to="/auth/login" className="font-semibold text-ocheto-green-700 hover:underline">
            Inicia sesión
          </Link>
        </p>
      }
    >
      {sent ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-ocheto-green-700/10 flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-ocheto-green-700" />
          </div>
          <p className="text-sm text-ocheto-coffee-700/80 leading-relaxed">{GENERIC_MESSAGE}</p>
          <p className="mt-3 text-xs text-ocheto-coffee-700/60">
            Revisa también tu carpeta de spam.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ocheto-coffee-700/40 pointer-events-none" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={submitting || !email.trim()}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            className={primaryButtonClass}
          >
            {submitting ? 'Enviando…' : 'Enviar enlace'}
          </motion.button>
        </form>
      )}
    </AuthLayout>
  );
}
