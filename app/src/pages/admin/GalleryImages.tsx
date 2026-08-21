import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { useGalleryRows, resolveSiteImageUrl } from '@/features/siteImages/queries';
import { Loading, ErrorBox } from '@/features/admin/ui';

const SPANS = [
  'lg:col-span-2 lg:row-span-2',
  'lg:col-span-1 lg:row-span-1',
  'lg:col-span-1 lg:row-span-1',
  'lg:col-span-1 lg:row-span-1',
  'lg:col-span-1 lg:row-span-2',
  'lg:col-span-1 lg:row-span-1',
  'lg:col-span-1 lg:row-span-1',
  'lg:col-span-2 lg:row-span-1',
];

export default function AdminGalleryImages() {
  const queryClient = useQueryClient();
  const { data: rows, isLoading, error } = useGalleryRows();
  const [uploading, setUploading] = useState<number | null>(null);

  const byPos = new Map((rows ?? []).map((r) => [r.position, r]));
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
    void queryClient.invalidateQueries({ queryKey: ['gallery-rows'] });
  };

  const handleFile = async (position: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(position);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
      const fileName = `gallery/pos-${position}-${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('site-images').upload(fileName, file, { upsert: false });
      if (uploadError) throw uploadError;
      const imageUrl = `site-images/${fileName}`;
      const existing = byPos.get(position);
      if (existing) {
        const { error: upd } = await supabase.from('gallery_images').update({ image_url: imageUrl }).eq('position', position);
        if (upd) throw upd;
      } else {
        const { error: ins } = await supabase.from('gallery_images').insert({ position, image_url: imageUrl, active: true });
        if (ins) throw ins;
      }
      toast.success(`Imagen galería posición ${position + 1} actualizada`);
      invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al subir imagen');
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox message="No se pudo cargar galería." />;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-7">
        <h1 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-3xl">Galería — Momentos Ocheto</h1>
        <p className="mt-1 text-sm text-ocheto-coffee-700/70">8 imágenes de la grilla masonry. Solo imágenes — captions y layout se mantienen.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, pos) => {
          const row = byPos.get(pos);
          const raw = row?.image_url ?? '';
          const src = raw ? resolveSiteImageUrl(raw) : '';
          const inputId = `gal-file-${pos}`;
          return (
            <motion.div key={pos} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pos * 0.04 }} className="bg-white rounded-2xl border border-ocheto-cream-200 overflow-hidden">
              <div className="relative aspect-square bg-ocheto-cream-50 flex items-center justify-center overflow-hidden">
                {src ? <img src={src} alt={`Galería ${pos + 1}`} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-ocheto-coffee-700/40" />}
                <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-[10px] font-bold">#{pos + 1} • pos {pos}</span>
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[8px] hidden lg:block">{SPANS[pos]}</span>
              </div>
              <div className="p-3">
                <p className="text-[11px] text-ocheto-coffee-700/60 truncate">{raw || '—'}</p>
                <label htmlFor={inputId} className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-xs font-semibold hover:bg-ocheto-green-600 cursor-pointer">
                  <Upload className="w-3 h-3" /> {uploading === pos ? 'Subiendo…' : 'Cambiar'}
                </label>
                <input id={inputId} type="file" accept="image/*" className="hidden" onChange={(e) => void handleFile(pos, e)} disabled={uploading === pos} />
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-ocheto-coffee-700/60">Bucket <code>site-images/gallery/</code> · fallback a <code>/assets</code> si fila vacía. No se edita caption/span por pedido.</p>
    </motion.div>
  );
}
