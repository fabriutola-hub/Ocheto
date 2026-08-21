import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Users, Star, BarChart3, Download, Crown, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAllProducts } from '@/features/products/queries';
import { formatCentsShort } from '@/lib/money';
import { Loading, ErrorBox } from '@/features/admin/ui';
import { resolveSiteImageUrl } from '@/features/siteImages/queries';

type FavoriteRow = { product_id: string; user_id: string; created_at: string };

const CATEGORY_LABELS: Record<string, string> = {
  cafe: 'Café', matcha: 'Matcha', specialty: 'Specialty', frio: 'Frío', panaderia: 'Panadería', beans: 'Granos', merch: 'Merch',
};

export default function FavoritesAnalytics() {
  const { data: products } = useAllProducts();
  const [category, setCategory] = useState<string>('all');

  const favQuery = useQuery({
    queryKey: ['favorites-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase.from('favorites').select('product_id, user_id, created_at');
      if (error) throw error;
      return data as FavoriteRow[];
    },
  });

  const productMap = useMemo(() => new Map((products ?? []).map((p) => [p.id, p])), [products]);

  const stats = useMemo(() => {
    const favs = favQuery.data ?? [];
    const total = favs.length;
    const byProduct = new Map<string, number>();
    const byUser = new Map<string, number>();
    for (const f of favs) {
      byProduct.set(f.product_id, (byProduct.get(f.product_id) ?? 0) + 1);
      byUser.set(f.user_id, (byUser.get(f.user_id) ?? 0) + 1);
    }
    const uniqueProducts = byProduct.size;
    const uniqueUsers = byUser.size;
    const sorted = [...byProduct.entries()]
      .map(([pid, count]) => {
        const prod = productMap.get(pid);
        return {
          product_id: pid,
          count,
          product: prod,
          category: prod?.category ?? 'unknown',
        };
      })
      .filter((x) => category === 'all' || x.category === category)
      .sort((a, b) => b.count - a.count);

    const top = sorted[0];
    const byCategory = new Map<string, number>();
    for (const [pid, c] of byProduct.entries()) {
      const cat = productMap.get(pid)?.category ?? 'unknown';
      byCategory.set(cat, (byCategory.get(cat) ?? 0) + c);
    }

    return { total, uniqueProducts, uniqueUsers, sorted, top, byCategory };
  }, [favQuery.data, productMap, category]);

  const handleExport = () => {
    const rows = [['Producto', 'Categoría', 'Favoritos', 'Precio']];
    for (const r of stats.sorted) {
      rows.push([r.product?.name ?? r.product_id, r.category, String(r.count), r.product ? formatCentsShort(r.product.price) : '']);
    }
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `favoritos-ocheto-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (favQuery.isLoading) return <Loading />;
  if (favQuery.error) return <ErrorBox message="No se pudo cargar favoritos." />;

  const maxCount = Math.max(1, ...stats.sorted.map((s) => s.count));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-3xl">Favoritos de clientes</h1>
          <p className="mt-1 text-sm text-ocheto-coffee-700/70">Qué aman tus clientes. Usa esto para decidir destacados, stock y carta.</p>
        </div>
        <button onClick={handleExport} disabled={stats.sorted.length === 0} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ocheto-coffee-900 text-ocheto-cream-50 text-sm font-semibold hover:bg-ocheto-coffee-800 disabled:opacity-50">
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-ocheto-cream-200 p-5">
          <div className="w-10 h-10 rounded-xl bg-ocheto-berry-600/10 flex items-center justify-center mb-3"><Heart className="w-5 h-5 text-ocheto-berry-600" /></div>
          <p className="text-3xl font-black text-ocheto-coffee-900 tabular-nums">{stats.total}</p>
          <p className="text-xs font-semibold text-ocheto-coffee-700/70">Favoritos totales</p>
        </div>
        <div className="bg-white rounded-2xl border border-ocheto-cream-200 p-5">
          <div className="w-10 h-10 rounded-xl bg-ocheto-green-700/10 flex items-center justify-center mb-3"><BarChart3 className="w-5 h-5 text-ocheto-green-700" /></div>
          <p className="text-3xl font-black text-ocheto-coffee-900 tabular-nums">{stats.uniqueProducts}</p>
          <p className="text-xs font-semibold text-ocheto-coffee-700/70">Productos con fans</p>
        </div>
        <div className="bg-white rounded-2xl border border-ocheto-cream-200 p-5">
          <div className="w-10 h-10 rounded-xl bg-ocheto-caramel-500/15 flex items-center justify-center mb-3"><Users className="w-5 h-5 text-ocheto-caramel-600" /></div>
          <p className="text-3xl font-black text-ocheto-coffee-900 tabular-nums">{stats.uniqueUsers}</p>
          <p className="text-xs font-semibold text-ocheto-coffee-700/70">Clientes que guardaron</p>
        </div>
        <div className="bg-white rounded-2xl border border-ocheto-cream-200 p-5">
          <div className="w-10 h-10 rounded-xl bg-ocheto-gold-500/15 flex items-center justify-center mb-3"><Crown className="w-5 h-5 text-ocheto-gold-600" /></div>
          <p className="text-sm font-bold text-ocheto-coffee-900 truncate">{stats.top?.product?.name ?? '—'}</p>
          <p className="text-xs text-ocheto-coffee-700/60">{stats.top ? `${stats.top.count} favoritos · top 1` : 'Sin datos'}</p>
        </div>
      </div>

      {/* Insights */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-ocheto-green-950 rounded-2xl p-5 sm:p-6 text-ocheto-cream-50">
            <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-ocheto-gold-500 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Insight</p>
            {stats.top ? (
              <p className="mt-2 text-sm leading-relaxed text-ocheto-cream-100/85">
                <span className="font-semibold text-white">{stats.top.product?.name}</span> es el más guardado ({stats.top.count} · {((stats.top.count / stats.total) * 100).toFixed(1)}% del total). 
                {stats.top.category === 'beans' || stats.top.category === 'merch' ? ' Es de tienda: prioriza stock y destácalo en homepage.' : ' Es de carta: úsalo como gancho en “Cada categoría” y considera destacarlo.'}
              </p>
            ) : (
              <p className="mt-2 text-sm text-ocheto-cream-100/70">Aún sin favoritos. Invita a tus clientes a guardar sus productos desde la tienda.</p>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {[...stats.byCategory.entries()].sort((a, b) => b[1] - a[1]).map(([cat, c]) => (
                <span key={cat} className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold">{CATEGORY_LABELS[cat] ?? cat}: {c}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-ocheto-cream-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-ocheto-coffee-700 flex items-center gap-2"><Star className="w-3.5 h-3.5 text-ocheto-gold-500" /> Ranking por categoría</p>
            <div className="mt-3 space-y-2">
              {[...stats.byCategory.entries()].sort((a, b) => b[1] - a[1]).map(([cat, c]) => (
                <div key={cat} className="flex items-center justify-between text-sm">
                  <span className="text-ocheto-coffee-900">{CATEGORY_LABELS[cat] ?? cat}</span>
                  <span className="font-bold text-ocheto-green-700">{c}</span>
                </div>
              ))}
              {stats.byCategory.size === 0 && <p className="text-xs text-ocheto-coffee-700/60">Sin datos por categoría.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Filtro categoría */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
        {['all', 'cafe', 'matcha', 'specialty', 'frio', 'beans', 'merch', 'panaderia'].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${category === c ? 'bg-ocheto-green-700 text-white' : 'bg-white border border-ocheto-cream-200 text-ocheto-coffee-700 hover:bg-ocheto-cream-50'}`}
          >
            {c === 'all' ? 'Todas' : CATEGORY_LABELS[c] ?? c}
          </button>
        ))}
      </div>

      {/* Tabla ranking */}
      <div className="bg-white rounded-2xl border border-ocheto-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-ocheto-coffee-700/60 border-b">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Favoritos</th>
                <th className="px-4 py-3">Popularidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocheto-cream-200/70">
              {stats.sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-6 h-6 text-ocheto-coffee-700/40 mb-2" />
                      <p className="text-sm text-ocheto-coffee-700/70">Nadie ha guardado favoritos aún en esta categoría.</p>
                      <p className="text-xs text-ocheto-coffee-700/60">Comparte la tienda y anima a guardar con el corazón.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                stats.sorted.map((row, idx) => {
                  const prod = row.product;
                  const pct = stats.total ? (row.count / stats.total) * 100 : 0;
                  const bar = (row.count / maxCount) * 100;
                  const img = prod ? resolveSiteImageUrl(prod.image_url) ?? prod.image_url : '';
                  return (
                    <tr key={row.product_id} className="hover:bg-ocheto-cream-50/70">
                      <td className="px-4 py-3 font-bold text-ocheto-coffee-900 tabular-nums">{idx === 0 ? <span className="inline-flex items-center gap-1"><Crown className="w-3.5 h-3.5 text-ocheto-gold-500" />{idx + 1}</span> : idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-ocheto-cream-100 flex items-center justify-center overflow-hidden shrink-0">
                            {prod?.image_url ? <img src={img} alt="" className="w-full h-full object-contain p-1" /> : <Heart className="w-4 h-4 text-ocheto-coffee-700/40" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-ocheto-coffee-900 truncate max-w-[220px]">{prod?.name ?? row.product_id.slice(0, 8)}</p>
                            <p className="text-xs text-ocheto-coffee-700/60">{prod ? formatCentsShort(prod.price) : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ocheto-coffee-700">{CATEGORY_LABELS[row.category] ?? row.category}</td>
                      <td className="px-4 py-3 font-bold text-ocheto-green-700 tabular-nums">{row.count}</td>
                      <td className="px-4 py-3 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-ocheto-cream-200 overflow-hidden">
                            <div className="h-full bg-ocheto-green-700" style={{ width: `${bar}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-ocheto-coffee-700 tabular-nums">{pct.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-ocheto-coffee-700/60">
        Datos en vivo de <code>favorites</code> (RLS admin). No exponemos emails de clientes — solo agregados. Usa el top 3 para alimentar <code>/admin/destacados</code> y reposición de granos/merch.
      </p>
    </motion.div>
  );
}
