import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Trash2, Check, Clock } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { Loading, ErrorBox } from '@/features/admin/ui';

export default function ContactMessages() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [working, setWorking] = useState<string | null>(null);

  const toggleRead = async (id: string, read: boolean) => {
    setWorking(id);
    const { error } = await supabase.from('contact_messages').update({ read: !read }).eq('id', id);
    setWorking(null);
    if (error) toast.error('No se pudo actualizar');
    else void qc.invalidateQueries({ queryKey: ['contact-messages'] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar mensaje?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) toast.error('No se pudo eliminar');
    else {
      toast.success('Eliminado');
      void qc.invalidateQueries({ queryKey: ['contact-messages'] });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox message="No se pudo cargar mensajes." />;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-fraunces italic text-ocheto-coffee-900 text-3xl">Mensajes — Contacto</h1>
      <p className="text-sm text-ocheto-coffee-700/70 mt-1">Formulario envía a <span className="font-semibold">ochetocoffe@gmail.com</span> y guarda aquí. {(data ?? []).length} mensajes.</p>
      <div className="mt-6 space-y-3">
        {(data ?? []).length === 0 && <div className="text-center py-12 text-ocheto-coffee-700/60">Sin mensajes todavía.</div>}
        {(data ?? []).map((m: any) => (
          <div key={m.id} className={`bg-white rounded-2xl border p-4 sm:p-5 flex gap-4 ${m.read ? 'border-ocheto-cream-200 opacity-80' : 'border-ocheto-green-700/20 shadow-sm'}`}>
            <div className="w-10 h-10 rounded-full bg-ocheto-green-700/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-ocheto-green-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ocheto-coffee-900 text-sm">{m.nombre}</span>
                <span className="text-xs text-ocheto-coffee-700/60">{m.email}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-ocheto-cream-100">{m.asunto}</span>
                {m.read ? <span className="text-[10px] flex items-center gap-1 text-ocheto-green-700"><Check className="w-3 h-3" /> Leído</span> : <span className="text-[10px] flex items-center gap-1 text-ocheto-gold-600"><Clock className="w-3 h-3" /> Nuevo</span>}
              </div>
              <p className="text-sm text-ocheto-coffee-700/85 mt-2 whitespace-pre-wrap">{m.mensaje}</p>
              <p className="text-[11px] text-ocheto-coffee-700/60 mt-2">{new Date(m.created_at).toLocaleString('es-BO')}</p>
              <div className="mt-3 flex gap-2">
                <button disabled={working===m.id} onClick={()=>void toggleRead(m.id, m.read)} className="text-xs px-3 py-1.5 rounded-full border hover:bg-ocheto-cream-50">{m.read ? 'Marcar no leído' : 'Marcar leído'}</button>
                <a href={`mailto:${m.email}?subject=Re: ${m.asunto}`} className="text-xs px-3 py-1.5 rounded-full bg-ocheto-green-700 text-white">Responder</a>
                <button onClick={()=>void handleDelete(m.id)} className="text-xs px-3 py-1.5 rounded-full hover:bg-ocheto-berry-600/10 text-ocheto-berry-600 ml-auto"><Trash2 className="w-3 h-3 inline" /> Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
