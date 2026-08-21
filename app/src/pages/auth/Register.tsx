import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Lock, Mail, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import AuthLayout, { inputClass, labelClass, errorClass, primaryButtonClass } from './AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  const params = new URLSearchParams(location.search);
  const returnTo = params.get('returnTo') || '/perfil';

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(returnTo, { replace: true });
    });
  }, [navigate, returnTo]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => window.clearInterval(t);
  }, [cooldown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!fullName.trim()) {
      setError('Ingresa tu nombre');
      return;
    }
    if (!email.trim()) {
      setError('Ingresa tu correo electrónico');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/login`,
      },
    });
    setSubmitting(false);
    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes('already')) {
        setError('Este correo ya está registrado');
        setInfo(`¿No te llegó el correo? Puedes reenviar la verificación a ${email.trim()}.`);
        setCooldown(5);
      } else if (msg.includes('over_email') || msg.includes('rate limit') || msg.includes('429') || msg.includes('email rate')) {
        setError('Límite de correos del plan gratuito de Supabase (4/hora). Espera una hora o configura un SMTP propio (Resend/Gmail) en Supabase Dashboard → Auth → SMTP para envíos ilimitados a ocheto.com.bo.');
        toast.error('Límite de emails alcanzado. Intenta en una hora.');
      } else {
        setError('No se pudo crear la cuenta. Inténtalo de nuevo.');
        toast.error(signUpError.message);
      }
      return;
    }
    if (data.session) {
      navigate(returnTo, { replace: true });
      return;
    }
    setInfo('Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.');
    setResendCount(0);
    setCooldown(60);
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError('Ingresa tu correo para reenviar');
      return;
    }
    if (cooldown > 0) return;
    setResending(true);
    setError('');
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/login` },
    });
    setResending(false);
    if (resendError) {
      const rmsg = resendError.message.toLowerCase();
      if (rmsg.includes('over_email') || rmsg.includes('rate limit') || rmsg.includes('429') || rmsg.includes('email rate')) {
        setError('Límite de correos del plan gratuito (4/hora). Supabase bloqueó el reenvío. Espera una hora o el admin debe configurar SMTP propio en Supabase para ocheto.com.bo para envíos ilimitados.');
        toast.error('Límite de emails (free plan). Espera 1h.');
        setCooldown(60);
      } else if (rmsg.includes('rate')) {
        setError('Demasiados intentos. Espera 60s y vuelve a intentar.');
        setCooldown(60);
      } else if (rmsg.includes('already confirmed')) {
        setError('Esta cuenta ya está confirmada. Inicia sesión.');
      } else {
        setError('No se pudo reenviar. Inténtalo de nuevo.');
        toast.error(resendError.message);
      }
      return;
    }
    const next = resendCount + 1;
    setResendCount(next);
    setCooldown(60);
    toast.success(`Correo reenviado (${next}) a ${email.trim()}`);
    setInfo(`Correo reenviado (${next}). Revisa tu bandeja y spam en ${email.trim()}.`);
  };

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Únete a la comunidad Ocheto y guarda tus productos favoritos."
      footer={
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link
            to={`/auth/login${location.search}`}
            className="font-semibold text-ocheto-green-700 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Nombre completo
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ocheto-coffee-700/40 pointer-events-none" />
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>
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
        <div>
          <label htmlFor="password" className={labelClass}>
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ocheto-coffee-700/40 pointer-events-none" />
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>
        {error && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className={errorClass}>
            {error}
          </motion.p>
        )}
        {info && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-ocheto-green-700 font-medium bg-ocheto-green-700/8 rounded-xl px-4 py-3 space-y-2"
          >
            <p>{info}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button type="button" onClick={() => void handleResend()} disabled={resending || cooldown > 0} className="px-3.5 py-1.5 rounded-full bg-ocheto-green-700 text-white text-xs font-semibold disabled:opacity-50">
                {resending ? 'Reenviando…' : cooldown > 0 ? `Reenviar en ${cooldown}s` : resendCount > 0 ? `Reenviar de nuevo (${resendCount})` : 'Reenviar correo'}
              </button>
              {resendCount > 0 && <span className="text-xs text-ocheto-coffee-700/60">Enviados: {resendCount + 1} · Revisa spam/promociones</span>}
            </div>
          </motion.div>
        )}
        {!info ? (
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            className={primaryButtonClass}
          >
            {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className={primaryButtonClass + ' flex-1'}
            >
              {submitting ? 'Creando…' : 'Intentar de nuevo'}
            </motion.button>
            <Link to={`/auth/login${location.search}`} className="px-5 py-3 rounded-full border-2 border-ocheto-green-700/15 text-sm font-semibold text-ocheto-green-700 hover:bg-ocheto-green-700/5 flex items-center justify-center">
              Ir a login
            </Link>
          </div>
        )}
      </form>
    </AuthLayout>
  );
}
