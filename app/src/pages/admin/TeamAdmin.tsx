import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { useTeamRows, resolveSiteImageUrl } from '@/features/about/queries';
import { Loading, ErrorBox } from '@/features/admin/ui';
import ConfirmDialog from '@/features/admin/ConfirmDialog';

const schema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  bio: z.string().min(10),
  favorite: z.string().optional(),
});

export default function TeamAdmin() {
  const qc = useQueryClient();
  const { data: rows, isLoading, error } = useTeamRows();
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', role: '', bio: '', favorite: '' });
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<any | null>(null);

  const openEdit = (row: any) => {
    setEditing(row);
    setForm({ name: row.name, role: row.role, bio: row.bio, favorite: row.favorite ?? '' });
    setPreview(resolveSiteImageUrl(row.avatar_url));
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
    const parsed = schema.safeParse({ ...form, favorite: form.favorite || undefined });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const iss of parsed.error.issues) fe[iss.path[0]!.toString()] = iss.message;
      setErrors(fe);
      return;
    }
    setSubmitting(true);
    try {
      let avatarUrl = editing.avatar_url;
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
        const fileName = `team/${editing.position}-${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('site-images').upload(fileName, file, { upsert: false });
        if (upErr) throw upErr;
        avatarUrl = `site-images/${fileName}`;
      }
      const { error } = await supabase.from('team_members').update({
        name: parsed.data.name.trim(),
        role: parsed.data.role.trim(),
        bio: parsed.data.bio.trim(),
        favorite: parsed.data.favorite?.trim() || null,
        avatar_url: avatarUrl,
      }).eq('id', editing.id);
      if (error) throw error;
      toast.success('Miembro actualizado');
      close();
      void qc.invalidateQueries({ queryKey: ['team-members'] });
      void qc.invalidateQueries({ queryKey: ['team-rows'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    const { error } = await supabase.from('team_members').delete().eq('id', confirm.id);
    if (error) toast.error('No se pudo eliminar');
    else {
      toast.success('Eliminado');
      void qc.invalidateQueries({ queryKey: ['team-rows'] });
      void qc.invalidateQueries({ queryKey: ['team-members'] });
    }
    setConfirm(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox message="No se pudo cargar equipo." />;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-fraunces italic text-ocheto-coffee-900 text-3xl">Equipo — Personas detrás del café</h1>
      <p className="text-sm text-ocheto-coffee-700/70 mt-1">Edita nombre, rol, bio, favorito y foto.</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {(rows ?? []).sort((a,b)=>a.position-b.position).map((row, i) => (
          <motion.div key={row.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-ocheto-cream-200 overflow-hidden flex flex-col">
            <div className="h-48 bg-ocheto-cream-50 flex items-center justify-center">
              <img src={resolveSiteImageUrl(row.avatar_url)} alt={row.name} className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow" />
            </div>
            <div className="p-4 flex-1">
              <p className="font-semibold text-ocheto-coffee-900 text-sm">{row.name}</p>
              <p className="text-[11px] uppercase tracking-wider text-ocheto-green-700 font-bold">{row.role}</p>
              <p className="text-xs text-ocheto-coffee-700/70 mt-2 line-clamp-3">{row.bio}</p>
              {row.favorite && <p className="text-xs mt-2">Fav: <span className="font-semibold text-ocheto-green-700">{row.favorite}</span></p>}
            </div>
            <div className="p-3 flex gap-2 border-t border-ocheto-cream-200">
              <button onClick={()=>openEdit(row)} className="flex-1 py-2 rounded-full bg-ocheto-green-700 text-white text-xs font-semibold"><Pencil className="w-3 h-3 inline mr-1" />Editar</button>
              <button onClick={()=>setConfirm(row)} className="p-2 rounded-full hover:bg-ocheto-berry-600/10"><Trash2 className="w-4 h-4 text-ocheto-berry-600" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.form onSubmit={(e)=>void handleSubmit(e)} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-ocheto-cream-50 rounded-3xl p-6 my-6 space-y-4">
              <div className="flex justify-between"><h3 className="font-semibold">Editar — {editing.name}</h3><button type="button" onClick={close}><X className="w-5 h-5" /></button></div>
              <div className="flex gap-4 items-center">
                <button type="button" onClick={()=>document.getElementById('team-file')?.click()} className="w-24 h-24 rounded-full overflow-hidden bg-white border-2 border-dashed flex items-center justify-center">
                  {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6" />}
                </button>
                <button type="button" onClick={()=>document.getElementById('team-file')?.click()} className="px-4 py-2 rounded-full bg-ocheto-green-700 text-white text-sm"><Upload className="w-4 h-4 inline mr-1" /> Cambiar foto</button>
                <input id="team-file" type="file" accept="image/*" className="hidden" onChange={onFile} />
              </div>
              <div><label className="text-xs font-bold">Nombre</label><input value={form.name} onChange={(e)=>setForm(p=>({...p,name:e.target.value}))} className="w-full px-3.5 py-2.5 rounded-xl border bg-white" />{errors.name && <p className="text-xs text-red-600">{errors.name}</p>}</div>
              <div><label className="text-xs font-bold">Rol</label><input value={form.role} onChange={(e)=>setForm(p=>({...p,role:e.target.value}))} className="w-full px-3.5 py-2.5 rounded-xl border bg-white" />{errors.role && <p className="text-xs text-red-600">{errors.role}</p>}</div>
              <div><label className="text-xs font-bold">Bio</label><textarea value={form.bio} onChange={(e)=>setForm(p=>({...p,bio:e.target.value}))} className="w-full px-3.5 py-2.5 rounded-xl border bg-white min-h-[90px]" />{errors.bio && <p className="text-xs text-red-600">{errors.bio}</p>}</div>
              <div><label className="text-xs font-bold">Favorito</label><input value={form.favorite} onChange={(e)=>setForm(p=>({...p,favorite:e.target.value}))} className="w-full px-3.5 py-2.5 rounded-xl border bg-white" /></div>
              <div className="flex justify-end gap-3"><button type="button" onClick={close} className="px-5 py-2.5 rounded-full text-sm">Cancelar</button><button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full bg-ocheto-green-700 text-white text-sm disabled:opacity-60">{submitting ? 'Guardando…' : 'Guardar'}</button></div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
      <ConfirmDialog open={!!confirm} title="Eliminar miembro" message={confirm ? `"${confirm.name}" se eliminará.` : ''} danger confirmLabel="Eliminar" onConfirm={()=>void handleDelete()} onCancel={()=>setConfirm(null)} />
    </motion.div>
  );
}
