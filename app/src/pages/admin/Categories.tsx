import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Coffee, Leaf, Sparkles, Snowflake, ShoppingBag } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { useCategoryRows, resolveSiteImageUrl } from '@/features/siteImages/queries';
import { Loading, ErrorBox } from '@/features/admin/ui';
import type { LucideIcon } from 'lucide-react';

const CATEGORY_META: Record<string, { label: string; icon: LucideIcon }> = {
  cafe: { label: 'Café de Especialidad', icon: Coffee },
  matcha: { label: 'Matcha & Té', icon: Leaf },
  specialty: { label: 'Specialty Drinks', icon: Sparkles },
  frio: { label: 'Bebidas Frías', icon: Snowflake },
  beans: { label: 'Granos & Merch', icon: ShoppingBag },
};

const ORDER: string[] = ['cafe', 'matcha', 'specialty', 'frio', 'beans'];

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const { data: rows, isLoading, error } = useCategoryRows();
  const [uploading, setUploading] = useState<string | null>(null);

  const map = new Map((rows ?? []).map((r) => [r.category, r.image_url]));
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['category-images'] });
    void queryClient.invalidateQueries({ queryKey: ['category-rows'] });
  };

  const handleFile = async (category: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(category);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
      const fileName = `categories/${category}-${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('site-images').upload(fileName, file, { upsert: false });
      if (uploadError) throw uploadError;
      const imageUrl = `site-images/${fileName}`;
      const { error: upsertError } = await supabase.from('category_images').upsert({ category, image_url: imageUrl }, { onConflict: 'category' });
      if (upsertError) throw upsertError;
      toast.success('Imagen de categoría actualizada');
      invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al subir imagen');
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox message="No se pudo cargar categorías." />;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-7">
        <h1 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-3xl">Categorías — Homepage</h1>
        <p className="mt-1 text-sm text-ocheto-coffee-700/70">Sección “Cada categoría, un universo de sabor.” — 5 imágenes. Solo imágenes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ORDER.map((cat, i) => {
          const meta = CATEGORY_META[cat];
          const Icon = meta.icon;
          const raw = map.get(cat) ?? '';
          const src = raw ? resolveSiteImageUrl(raw) : '';
          const inputId = `cat-file-${cat}`;
          return (
            <motion.div key={cat} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-white rounded-2xl border border-ocheto-cream-200 overflow-hidden">
              <div className="relative aspect-[4/3] bg-ocheto-cream-50 flex items-center justify-center overflow-hidden">
                {src ? (
                  <img src={src} alt={meta.label} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-ocheto-coffee-700/40" />
                )}
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-[10px] font-bold uppercase tracking-wider">
                  <Icon className="w-3 h-3" /> {cat}
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-ocheto-coffee-900 text-sm">{meta.label}</p>
                <p className="text-xs text-ocheto-coffee-700/60 mt-0.5 truncate">{raw || '—'}</p>
                <label htmlFor={inputId} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-xs font-semibold hover:bg-ocheto-green-600 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5" /> {uploading === cat ? 'Subiendo…' : 'Cambiar imagen'}
                </label>
                <input id={inputId} type="file" accept="image/*" className="hidden" onChange={(e) => void handleFile(cat, e)} disabled={uploading === cat} />
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-ocheto-coffee-700/60">Las imágenes se guardan en bucket <code>site-images/categories/</code> y se resuelven con fallback a <code>/assets</code> si falta fila.</p>
    </motion.div>
  );
}
