import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Lock, Mail, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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
      },
    });
    setSubmitting(false);
    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('already')) {
        setError('Este correo ya está registrado');
      } else {
        setError('No se pudo crear la cuenta. Inténtalo de nuevo.');
      }
      return;
    }
    if (data.session) {
      navigate(returnTo, { replace: true });
      return;
    }
    setInfo('Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.');
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
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-ocheto-green-700 font-medium bg-ocheto-green-700/8 rounded-xl px-4 py-3"
          >
            {info}
          </motion.p>
        )}
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          className={primaryButtonClass}
        >
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </motion.button>
      </form>
    </AuthLayout>
  );
}
