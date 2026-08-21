import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from './store';
import { toast } from '@/lib/toast';

/** Requiere sesión. Redirige a /auth/login con returnTo. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-ocheto-cream-50" />;
  }
  if (!session) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/login?returnTo=${returnTo}`} replace />;
  }
  return <>{children}</>;
}

/** Requiere rol admin. Redirige a / con toast de acceso denegado. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { session, profile, loading, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || (session && profileLoading)) {
    return <div className="min-h-screen bg-ocheto-cream-50" />;
  }
  if (!session) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/login?returnTo=${returnTo}`} replace />;
  }
  if (profile?.role !== 'admin') {
    return <AccessDeniedRedirect />;
  }
  if (profile.must_change_password) {
    return <Navigate to="/auth/reset-password?forced=1" replace />;
  }
  return <>{children}</>;
}

function AccessDeniedRedirect() {
  useEffect(() => {
    toast.error('No tienes permisos para acceder al panel de administración');
  }, []);
  return <Navigate to="/" replace />;
}
