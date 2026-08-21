import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Save } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { formatCentsShort } from '@/lib/money';
import { useAllProducts } from '@/features/products/queries';
import { Loading, ErrorBox } from '@/features/admin/ui';
import type { FeaturedProductRow, ProductRow } from '@/features/products/types';

const SLOTS = [1, 2, 3] as const;

export default function AdminFeatured() {
  const queryClient = useQueryClient();
  const { data: products, isLoading: loadingProducts } = useAllProducts();
  const [slotProducts, setSlotProducts] = useState<Record<number, string>>({});
  const [slotActive, setSlotActive] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);

  const featuredQuery = useQuery({
    queryKey: ['featured-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_products')
        .select('*')
        .order('position');
      if (error) throw error;
      return data as FeaturedProductRow[];
    },
  });

  useEffect(() => {
    if (!featuredQuery.data) return;
    const map: Record<number, string> = {};
    const actives: Record<number, boolean> = {};
    for (const row of featuredQuery.data) {
      map[row.position] = row.product_id;
      actives[row.position] = row.active;
    }
    setSlotProducts(map);
    setSlotActive(actives);
  }, [featuredQuery.data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const slot of SLOTS) {
        const productId = slotProducts[slot];
        if (!productId) continue;
        const { error } = await supabase.from('featured_products').upsert(
          {
            product_id: productId,
            position: slot,
            active: slotActive[slot] ?? true,
          },
          { onConflict: 'position' },
        );
        if (error) throw error;
      }
      toast.success('Destacados guardados');
      void queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      void queryClient.invalidateQueries({ queryKey: ['featured-admin'] });
    } catch {
      toast.error('No se pudieron guardar los destacados');
    } finally {
      setSaving(false);
    }
  };

  if (loadingProducts || featuredQuery.isLoading) return <Loading />;
  if (featuredQuery.error) return <ErrorBox message="No se pudo cargar los destacados." />;

  const activeProducts = (products ?? []).filter((p) => p.active);
  const productById = new Map((products ?? []).map((p: ProductRow) => [p.id, p]));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-3xl">
            Destacados de la homepage
          </h1>
          <p className="mt-1 text-sm text-ocheto-coffee-700/70">
            Elige y reordena los 3 productos del carrusel principal. El slot 1 aparece primero.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-sm font-semibold hover:bg-ocheto-green-600 transition-colors shadow-lg shadow-ocheto-green-700/25 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando…' : 'Guardar destacados'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SLOTS.map((slot, i) => {
          const selected = productById.get(slotProducts[slot] ?? '');
          return (
            <motion.div
              key={slot}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-ocheto-cream-200 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocheto-gold-500/15 text-ocheto-gold-600 text-xs font-bold uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5" />
                  Slot {slot}
                </span>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-ocheto-coffee-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={slotActive[slot] ?? true}
                    onChange={(e) =>
                      setSlotActive((prev) => ({ ...prev, [slot]: e.target.checked }))
                    }
                    className="accent-[hsl(var(--ocheto-green-700))] w-4 h-4"
                  />
                  Activo
                </label>
              </div>

              {selected && (
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${selected.color}22, ${selected.color}10)`,
                    }}
                  >
                    <img src={selected.image_url} alt="" className="w-10 h-10 object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ocheto-coffee-900 text-sm truncate">
                      {selected.name}
                    </p>
                    <p className="text-xs font-bold text-ocheto-green-700">
                      {formatCentsShort(selected.price)}
                    </p>
                  </div>
                </div>
              )}

              <select
                value={slotProducts[slot] ?? ''}
                onChange={(e) =>
                  setSlotProducts((prev) => ({ ...prev, [slot]: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-ocheto-cream-50 border border-ocheto-cream-200 text-ocheto-coffee-900 text-sm focus:outline-none focus:ring-2 focus:ring-ocheto-green-700/40 focus:border-ocheto-green-700 transition-all"
              >
                <option value="">— Seleccionar producto —</option>
                {activeProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {formatCentsShort(p.price)}
                  </option>
                ))}
              </select>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-ocheto-coffee-700/60">
        Si un slot queda sin producto activo, la homepage muestra solo los destacados disponibles sin
        romper el layout.
      </p>
    </motion.div>
  );
}
