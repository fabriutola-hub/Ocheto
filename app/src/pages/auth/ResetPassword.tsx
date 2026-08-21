import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { authStore } from '@/features/auth/store';
import AuthLayout, { inputClass, labelClass, errorClass, primaryButtonClass } from './AuthLayout';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const forced = new URLSearchParams(location.search).get('forced') === '1';

  useEffect(() => {
    if (forced) return;
    void supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/auth/login', { replace: true });
      }
    });
  }, [navigate, forced]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (!updateError && forced) {
      await supabase
        .from('profiles')
        .update({ must_change_password: false })
        .eq('id', authStore.session?.user.id ?? '');
      await authStore.refreshProfile();
    }
    setSubmitting(false);
    if (updateError) {
      setError('No se pudo cambiar la contraseña. Inténtalo de nuevo.');
      return;
    }
    toast.success('Contraseña actualizada correctamente');
    navigate(forced ? '/admin' : '/perfil', { replace: true });
  };

  return (
    <AuthLayout
      title={forced ? 'Primer inicio: cambia tu contraseña' : 'Nueva contraseña'}
      subtitle={
        forced
          ? 'Por seguridad, debes cambiar la contraseña inicial antes de acceder al panel.'
          : 'Elige una contraseña nueva para tu cuenta.'
      }
      footer={
        <p>
          ¿Ya no la necesitas?{' '}
          <Link to="/auth/login" className="font-semibold text-ocheto-green-700 hover:underline">
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className={labelClass}>
            Nueva contraseña
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
        <div>
          <label htmlFor="confirm" className={labelClass}>
            Confirmar contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ocheto-coffee-700/40 pointer-events-none" />
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repite la contraseña"
              className={`${inputClass} pl-10`}
            />
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
          {submitting ? 'Guardando…' : 'Guardar contraseña'}
        </motion.button>
      </form>
    </AuthLayout>
  );
}
