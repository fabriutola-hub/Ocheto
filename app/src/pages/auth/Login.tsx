import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import AuthLayout, { inputClass, labelClass, errorClass, primaryButtonClass } from './AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const params = new URLSearchParams(location.search);
  const returnTo = params.get('returnTo') || '/perfil';

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(returnTo, { replace: true });
    });
  }, [navigate, returnTo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña');
      return;
    }
    setSubmitting(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (signInError) {
      setError('Correo o contraseña incorrectos');
      return;
    }
    toast.success('¡Bienvenido de nuevo!');
    navigate(returnTo, { replace: true });
    void data;
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Accede a tu perfil, guarda tus favoritos y sigue tu próxima taza."
      footer={
        <p>
          ¿Aún no tienes cuenta?{' '}
          <Link
            to={`/auth/register${location.search}`}
            className="font-semibold text-ocheto-green-700 hover:underline"
          >
            Regístrate
          </Link>
        </p>
      }
    >
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
        <div>
          <label htmlFor="password" className={labelClass}>
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ocheto-coffee-700/40 pointer-events-none" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputClass} pl-10`}
            />
          </div>
          <div className="mt-2 text-right">
            <Link
              to="/auth/recover"
              className="text-xs font-semibold text-ocheto-green-700 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
        {error && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className={errorClass}>
            {error}
          </motion.p>
        )}
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          className={primaryButtonClass}
        >
          {submitting ? 'Ingresando…' : 'Entrar'}
        </motion.button>
      </form>
    </AuthLayout>
  );
}
