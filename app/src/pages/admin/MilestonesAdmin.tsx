import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, X, Upload, Image as ImageIcon } from 'lucide-react';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { useMilestoneRows, resolveSiteImageUrl } from '@/features/about/queries';
import { Loading, ErrorBox } from '@/features/admin/ui';

const schema = z.object({
  year: z.string().min(1, 'Año requerido'),
  title: z.string().min(2, 'Título mínimo 2'),
  place: z.string().min(2),
  description: z.string().min(10),
  alt: z.string().optional(),
});

export default function MilestonesAdmin() {
  const qc = useQueryClient();
  const { data: rows, isLoading, error } = useMilestoneRows();
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ year: '', title: '', place: '', description: '', alt: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const openEdit = (row: any) => {
    setEditing(row);
    setForm({ year: row.year, title: row.title, place: row.place, description: row.description, alt: row.alt ?? '' });
    setPreview(resolveSiteImageUrl(row.image_url));
    setFile(null);
    setErrors({});
  };
  const close = () => { setEditing(null); setPreview(''); setFile(null); setErrors({}); };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = () => setPreview(String(r.result));
    r.readAsDataURL(f);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ ...form, alt: form.alt || undefined });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const iss of parsed.error.issues) fe[iss.path[0]!.toString()] = iss.message;
      setErrors(fe);
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl = editing.image_url;
      const isData = preview.startsWith('data:');
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
        const fileName = `milestones/${editing.position}-${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('site-images').upload(fileName, file, { upsert: false });
        if (upErr) throw upErr;
        imageUrl = `site-images/${fileName}`;
      } else if (isData) {
        imageUrl = editing.image_url; // keep old if preview is data but no file (should not happen)
      }
      const { error } = await supabase.from('milestones').update({
        year: parsed.data.year.trim(),
        title: parsed.data.title.trim(),
        place: parsed.data.place.trim(),
        description: parsed.data.description.trim(),
        alt: parsed.data.alt?.trim() || parsed.data.title.trim(),
        image_url: imageUrl,
      }).eq('id', editing.id);
      if (error) throw error;
      toast.success('Hito actualizado');
      close();
      void qc.invalidateQueries({ queryKey: ['milestones'] });
      void qc.invalidateQueries({ queryKey: ['milestones-all'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally { setSubmitting(false); }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox message="No se pudo cargar historia." />;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-fraunces italic text-ocheto-coffee-900 text-3xl">Historia — Línea de tiempo</h1>
      <p className="text-sm text-ocheto-coffee-700/70 mt-1">3 hitos de “Nosotros”. Solo imágenes y datos; cambios se reflejan en homepage.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {(rows ?? []).sort((a,b)=>a.position-b.position).map((row, i) => (
          <motion.div key={row.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-white rounded-2xl border border-ocheto-cream-200 overflow-hidden">
            <div className="aspect-[5/4] bg-ocheto-cream-50 relative">
              <img src={resolveSiteImageUrl(row.image_url)} alt={row.alt} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-ocheto-green-700 text-white text-[10px] font-bold">{row.year}</span>
            </div>
            <div className="p-4">
              <p className="font-semibold text-ocheto-coffee-900 text-sm">{row.title}</p>
              <p className="text-xs text-ocheto-coffee-700/60">{row.place}</p>
              <p className="text-xs text-ocheto-coffee-700/80 mt-2 line-clamp-3">{row.description}</p>
              <button onClick={() => openEdit(row)} className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ocheto-green-700 text-white text-xs font-semibold"><Pencil className="w-3 h-3" /> Editar</button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.form onSubmit={(e)=>void handleSubmit(e)} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-ocheto-cream-50 rounded-3xl p-6 my-6 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-semibold">Editar hito — {editing.year}</h3><button type="button" onClick={close} className="p-2 rounded-full hover:bg-ocheto-cream-100"><X className="w-5 h-5" /></button></div>
              <button type="button" onClick={()=>document.getElementById('mil-file')?.click()} className="w-32 h-32 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden bg-white">
                {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-ocheto-coffee-700/40" />}
              </button>
              <input id="mil-file" type="file" accept="image/*" className="hidden" onChange={onFile} />
              <button type="button" onClick={()=>document.getElementById('mil-file')?.click()} className="inline-flex gap-2 px-4 py-2 rounded-full bg-ocheto-green-700 text-white text-sm"><Upload className="w-4 h-4" /> Cambiar imagen</button>
              <div><label className="text-xs font-bold">Año</label><input value={form.year} onChange={(e)=>setForm(p=>({...p,year:e.target.value}))} className="w-full px-3.5 py-2.5 rounded-xl border bg-white" />{errors.year && <p className="text-xs text-red-600">{errors.year}</p>}</div>
              <div><label className="text-xs font-bold">Título</label><input value={form.title} onChange={(e)=>setForm(p=>({...p,title:e.target.value}))} className="w-full px-3.5 py-2.5 rounded-xl border bg-white" />{errors.title && <p className="text-xs text-red-600">{errors.title}</p>}</div>
              <div><label className="text-xs font-bold">Lugar</label><input value={form.place} onChange={(e)=>setForm(p=>({...p,place:e.target.value}))} className="w-full px-3.5 py-2.5 rounded-xl border bg-white" /></div>
              <div><label className="text-xs font-bold">Descripción</label><textarea value={form.description} onChange={(e)=>setForm(p=>({...p,description:e.target.value}))} className="w-full px-3.5 py-2.5 rounded-xl border bg-white min-h-[90px]" /></div>
              <div><label className="text-xs font-bold">Alt</label><input value={form.alt} onChange={(e)=>setForm(p=>({...p,alt:e.target.value}))} className="w-full px-3.5 py-2.5 rounded-xl border bg-white" /></div>
              <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={close} className="px-5 py-2.5 rounded-full text-sm">Cancelar</button><button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full bg-ocheto-green-700 text-white text-sm disabled:opacity-60">{submitting ? 'Guardando…' : 'Guardar'}</button></div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
