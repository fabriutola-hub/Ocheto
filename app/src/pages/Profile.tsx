import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, LogOut, Store, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { useAuth } from '@/features/auth/store';
import { useProducts } from '@/features/products/queries';
import { useFavoriteIds, favoritesStore } from '@/features/favorites/store';
import { formatCentsShort } from '@/lib/money';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { FavoriteRow } from '@/features/products/types';

type Tab = 'favoritos' | 'cuenta';

const tabs: { key: Tab; label: string; icon: typeof Heart }[] = [
  { key: 'favoritos', label: 'Favoritos', icon: Heart },
  { key: 'cuenta', label: 'Mi cuenta', icon: User },
];

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, profile } = useAuth();
  const [tab, setTab] = useState<Tab>('favoritos');
  const { data: products } = useProducts();
  const { ids } = useFavoriteIds();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const favoritesQuery = useQuery({
    queryKey: ['favorites-rows', session?.user.id],
    enabled: Boolean(session?.user.id),
    queryFn: async () => {
      const { data, error } = await supabase.from('favorites').select('*');
      if (error) throw error;
      return data as FavoriteRow[];
    },
  });

  const favoriteProducts = useMemo(() => {
    if (!products || !favoritesQuery.data) return [];
    const favoriteProductIds = new Set(favoritesQuery.data.map((f) => f.product_id));
    return products.filter((p) => favoriteProductIds.has(p.id));
  }, [products, favoritesQuery.data]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sesión cerrada. ¡Hasta pronto!');
    navigate('/', { replace: true });
  };

  const handleRemoveFavorite = async (productId: string) => {
    setRemovingId(productId);
    const ok = await favoritesStore.toggle(productId);
    setRemovingId(null);
    if (ok) {
      void queryClient.invalidateQueries({ queryKey: ['favorites-rows'] });
      toast.success('Producto eliminado de favoritos');
    } else {
      toast.error('No se pudo eliminar el favorito');
    }
  };

  const isAdmin = profile?.role === 'admin';
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('es-BO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="pt-24 min-h-screen bg-ocheto-cream-50"
    >
      <div className="container-ocheto py-10 sm:py-14">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 sm:mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-ocheto-green-700 mb-2">
              Tu espacio Ocheto
            </p>
            <h1 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-4xl sm:text-5xl leading-tight">
              Hola, {profile?.full_name ?? 'café lover'} ☕
            </h1>
            <p className="mt-2 text-sm text-ocheto-coffee-700/70">
              {profile?.email} · Miembro desde {memberSince}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ocheto-coffee-900 text-ocheto-cream-50 text-sm font-semibold hover:bg-ocheto-coffee-800 transition-colors"
              >
                <Store className="w-4 h-4" />
                Panel admin
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-ocheto-coffee-900/20 text-ocheto-coffee-900 text-sm font-semibold hover:border-ocheto-berry-600 hover:text-ocheto-berry-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-ocheto-coffee-900/10 mb-8">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`relative px-5 py-3 text-sm font-semibold inline-flex items-center gap-2 transition-colors ${
                  isActive ? 'text-ocheto-green-700' : 'text-ocheto-coffee-700/60 hover:text-ocheto-coffee-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {isActive && (
                  <motion.span
                    layoutId="profile-tab"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-ocheto-green-700"
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'favoritos' ? (
            <motion.div
              key="favoritos"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {favoriteProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {favoriteProducts.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-ocheto-cream-200 p-4 flex gap-4"
                    >
                      <div
                        className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${p.color}22, ${p.color}10)`,
                        }}
                      >
                        <img src={p.image} alt={p.name} className="w-14 h-14 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-fraunces font-bold text-ocheto-coffee-900 leading-tight">
                          {p.name}
                        </h3>
                        <p className="mt-1 text-sm font-bold text-ocheto-green-700">
                          {formatCentsShort(p.price)}
                        </p>
                        <div className="mt-2.5 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => navigate('/tienda')}
                            className="text-xs font-semibold text-ocheto-green-700 hover:underline"
                          >
                            Ver en tienda
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleRemoveFavorite(p.id)}
                            disabled={removingId === p.id}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-ocheto-berry-600 hover:underline disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            {removingId === p.id ? 'Eliminando…' : 'Remover'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="max-w-md mx-auto text-center py-16">
                  <div className="w-16 h-16 mx-auto rounded-full bg-ocheto-cream-100 flex items-center justify-center mb-4">
                    <Heart className="w-7 h-7 text-ocheto-coffee-700/50" />
                  </div>
                  <h3 className="font-fraunces italic text-2xl text-ocheto-coffee-900">
                    Aún no tienes productos favoritos
                  </h3>
                  <p className="mt-2 text-sm text-ocheto-coffee-700/70">
                    Marca el corazón de los productos que amas para verlos aquí.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/tienda')}
                    className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-sm font-semibold hover:bg-ocheto-green-600 transition-colors shadow-lg shadow-ocheto-green-700/25"
                  >
                    Explorar tienda
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="cuenta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg"
            >
              <div className="bg-white rounded-2xl border border-ocheto-cream-200 divide-y divide-ocheto-cream-200/70">
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm text-ocheto-coffee-700/70">Nombre</span>
                  <span className="text-sm font-semibold text-ocheto-coffee-900">
                    {profile?.full_name ?? '—'}
                  </span>
                </div>
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm text-ocheto-coffee-700/70">Correo</span>
                  <span className="text-sm font-semibold text-ocheto-coffee-900">
                    {profile?.email ?? '—'}
                  </span>
                </div>
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm text-ocheto-coffee-700/70">Registro</span>
                  <span className="text-sm font-semibold text-ocheto-coffee-900">{memberSince}</span>
                </div>
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-sm text-ocheto-coffee-700/70">Favoritos guardados</span>
                  <span className="text-sm font-semibold text-ocheto-coffee-900">{ids.size}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-ocheto-coffee-700/60">
                Los datos de tu cuenta se gestionan de forma segura con Supabase Auth.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
