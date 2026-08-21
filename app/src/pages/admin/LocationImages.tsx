import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Upload, MapPin } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { useLocationRows, resolveSiteImageUrl } from '@/features/siteImages/queries';
import { Loading, ErrorBox } from '@/features/admin/ui';

const BRANCH_META: Record<string, string> = {
  loc1: 'Oruro & Illampu (loc1)',
  loc2: 'Oruro solo (loc2)',
  loc3: 'Federico Suazo (loc3)',
};

const ORDER = ['loc1', 'loc2', 'loc3'] as const;

export default function AdminLocationImages() {
  const queryClient = useQueryClient();
  const { data: rows, isLoading, error } = useLocationRows();
  const [uploading, setUploading] = useState<string | null>(null);

  const map = new Map((rows ?? []).map((r) => [r.branch_id, r.image_url]));
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['location-images'] });
    void queryClient.invalidateQueries({ queryKey: ['location-rows'] });
  };

  const handleFile = async (branchId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(branchId);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
      const fileName = `locations/${branchId}-${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('site-images').upload(fileName, file, { upsert: false });
      if (uploadError) throw uploadError;
      const imageUrl = `site-images/${fileName}`;
      const { error: upsertError } = await supabase.from('location_images').upsert({ branch_id: branchId, image_url: imageUrl }, { onConflict: 'branch_id' });
      if (upsertError) throw upsertError;
      toast.success('Imagen de sucursal actualizada');
      invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al subir imagen');
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox message="No se pudo cargar imágenes de sucursales." />;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-7">
        <h1 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-3xl">Sucursales — Imágenes</h1>
        <p className="mt-1 text-sm text-ocheto-coffee-700/70">3 tarjetas de la homepage y sección contacto. Solo imágenes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {ORDER.map((bid, i) => {
          const raw = map.get(bid) ?? '';
          const src = raw ? resolveSiteImageUrl(raw) : '';
          const inputId = `loc-file-${bid}`;
          return (
            <motion.div key={bid} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-white rounded-2xl border border-ocheto-cream-200 overflow-hidden">
              <div className="relative aspect-[4/3] bg-ocheto-cream-50 flex items-center justify-center overflow-hidden">
                {src ? <img src={src} alt={BRANCH_META[bid]} className="w-full h-full object-cover" /> : <div className="text-ocheto-coffee-700/40 text-sm">Sin imagen</div>}
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-[10px] font-bold">
                  <MapPin className="w-3 h-3" /> {bid}
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-ocheto-coffee-900 text-sm">{BRANCH_META[bid]}</p>
                <p className="text-xs text-ocheto-coffee-700/60 truncate mt-0.5">{raw || '—'}</p>
                <label htmlFor={inputId} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-xs font-semibold hover:bg-ocheto-green-600 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" /> {uploading === bid ? 'Subiendo…' : 'Cambiar imagen'}
                </label>
                <input id={inputId} type="file" accept="image/*" className="hidden" onChange={(e) => void handleFile(bid, e)} disabled={uploading === bid} />
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-ocheto-coffee-700/60">Bucket <code>site-images/locations/</code> · se usa en homepage “Visítanos” y contacto, con fallback a <code>/assets/wallaper_*.webp</code>.</p>
    </motion.div>
  );
}
