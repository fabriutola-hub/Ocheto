import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Package, MapPin, Star, Heart } from 'lucide-react';
import { useAllProducts } from '@/features/products/queries';
import { useAllBranchMenus } from '@/features/menu/queries';
import { useFeaturedProducts } from '@/features/featured/queries';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Loading, ErrorBox } from '@/features/admin/ui';

export default function AdminDashboard() {
  const { data: products, isLoading: loadingProducts, error: productsError } = useAllProducts();
  const { data: menus, isLoading: loadingMenus } = useAllBranchMenus();
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts();
  const favoritesCount = useQuery({
    queryKey: ['favorites-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  if (loadingProducts || loadingMenus || loadingFeatured) return <Loading />;
  if (productsError) return <ErrorBox message="No se pudo cargar el dashboard." />;

  const activeProducts = (products ?? []).filter((p) => p.active).length;
  const inactiveProducts = (products ?? []).length - activeProducts;

  const stats = [
    {
      label: 'Productos activos',
      value: activeProducts,
      sub: `${inactiveProducts} inactivos`,
      icon: Package,
      to: '/admin/productos',
      accent: 'bg-ocheto-green-700/10 text-ocheto-green-700',
    },
    {
      label: 'Ítems de menú',
      value: (menus ?? []).length,
      sub: '2 sucursales',
      icon: MapPin,
      to: '/admin/sucursales',
      accent: 'bg-ocheto-caramel-500/15 text-ocheto-caramel-600',
    },
    {
      label: 'Destacados',
      value: (featured ?? []).length,
      sub: 'en la homepage',
      icon: Star,
      to: '/admin/destacados',
      accent: 'bg-ocheto-gold-500/15 text-ocheto-gold-600',
    },
    {
      label: 'Favoritos totales',
      value: favoritesCount.data ?? 0,
      sub: 'ver ranking →',
      icon: Heart,
      to: '/admin/favoritos',
      accent: 'bg-ocheto-berry-600/10 text-ocheto-berry-600',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-3xl mb-1">
        Dashboard
      </h1>
      <p className="text-sm text-ocheto-coffee-700/70 mb-7">
        Resumen de tu tienda y accesos a los CRUDs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          const content = (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-ocheto-cream-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.accent}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-ocheto-coffee-900 tabular-nums">{s.value}</p>
              <p className="text-sm font-semibold text-ocheto-coffee-900 mt-0.5">{s.label}</p>
              <p className="text-xs text-ocheto-coffee-700/60 mt-0.5">{s.sub}</p>
            </motion.div>
          );
          return (
            <Link key={s.label} to={s.to}>
              {content}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/productos"
          className="group bg-ocheto-green-950 rounded-3xl p-6 sm:p-7 text-ocheto-cream-50 hover:bg-ocheto-green-900 transition-colors"
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-ocheto-gold-500 mb-2">
            Catálogo
          </p>
          <h3 className="font-fraunces italic font-medium text-2xl">Gestionar productos</h3>
          <p className="mt-2 text-sm text-ocheto-cream-100/70 leading-relaxed">
            Crear, editar, inactivar o eliminar productos de la tienda. Los cambios se reflejan al
            instante en el sitio público.
          </p>
        </Link>
        <Link
          to="/admin/sucursales"
          className="group bg-ocheto-coffee-900 rounded-3xl p-6 sm:p-7 text-ocheto-cream-50 hover:bg-ocheto-coffee-800 transition-colors"
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-ocheto-gold-500 mb-2">
            Menús
          </p>
          <h3 className="font-fraunces italic font-medium text-2xl">Menús de sucursal</h3>
          <p className="mt-2 text-sm text-ocheto-cream-100/70 leading-relaxed">
            Administra los ítems y precios del menú de Federico Suazo y Oruro & Illampu.
          </p>
        </Link>
      </div>
    </motion.div>
  );
}
