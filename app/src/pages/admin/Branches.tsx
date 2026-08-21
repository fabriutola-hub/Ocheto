import { useState, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, MapPin, Upload, ImagePlus } from 'lucide-react';
import { resolveSiteImageUrl } from '@/features/siteImages/queries';
import { useAllBranchMenus } from '@/features/menu/queries';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { formatCentsShort } from '@/lib/money';
import { Badge, Loading, ErrorBox } from '@/features/admin/ui';
import ConfirmDialog from '@/features/admin/ConfirmDialog';
import type { BranchMenuItemRow } from '@/features/products/types';

const branchMenuSchema = z.object({
  branch_id: z.enum(['loc1', 'loc3'], { message: 'Selecciona una sucursal válida' }),
  section_title: z.string().min(2, 'La sección debe tener al menos 2 caracteres'),
  section_subtitle: z.string().optional(),
  item_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  item_description: z.string().optional(),
  price_regular: z.number({ message: 'Ingresa el precio regular' }).min(0, 'El precio no puede ser negativo'),
  price_grande: z.number().min(0, 'El precio no puede ser negativo').nullable().optional(),
  active: z.boolean(),
});

const BRANCHES = [
  { id: 'loc3', name: 'Federico Suazo' },
  { id: 'loc1', name: 'Oruro & Illampu' },
];

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-white border border-ocheto-cream-200 text-ocheto-coffee-900 text-sm placeholder:text-ocheto-coffee-700/40 focus:outline-none focus:ring-2 focus:ring-ocheto-green-700/40 focus:border-ocheto-green-700 transition-all';

const labelClass = 'block text-[11px] font-bold uppercase tracking-[0.14em] text-ocheto-coffee-700/80 mb-1.5';

interface MenuFormState {
  branch_id: string;
  section_title: string;
  section_subtitle: string;
  item_name: string;
  item_description: string;
  price_regular: string;
  price_grande: string;
  active: boolean;
}

const emptyForm: MenuFormState = {
  branch_id: 'loc3',
  section_title: '',
  section_subtitle: '',
  item_name: '',
  item_description: '',
  price_regular: '',
  price_grande: '',
  active: true,
};

function rowToForm(row: BranchMenuItemRow): MenuFormState {
  return {
    branch_id: row.branch_id,
    section_title: row.section_title,
    section_subtitle: row.section_subtitle ?? '',
    item_name: row.item_name,
    item_description: row.item_description ?? '',
    price_regular: String(row.price_regular / 100),
    price_grande: row.price_grande !== null ? String(row.price_grande / 100) : '',
    active: row.active,
  };
}

function priceLabel(row: BranchMenuItemRow): string {
  if (row.price_grande !== null) {
    return `${formatCentsShort(row.price_regular)} / ${formatCentsShort(row.price_grande)}`;
  }
  return formatCentsShort(row.price_regular);
}

export default function AdminBranches() {
  const queryClient = useQueryClient();
  const { data: items, isLoading, error } = useAllBranchMenus();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BranchMenuItemRow | null>(null);
  const [form, setForm] = useState<MenuFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<BranchMenuItemRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['branch-menus'] });
  };

  const resolvePreview = (raw?: string | null) => {
    if (!raw) return '';
    if (raw.startsWith('http') || raw.startsWith('/assets') || raw.startsWith('/') || raw.startsWith('data:')) return raw;
    return resolveSiteImageUrl(raw);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormOpen(true);
  };

  const openEdit = (row: BranchMenuItemRow) => {
    setEditing(row);
    setForm(rowToForm(row));
    setErrors({});
    setImagePreview(resolvePreview((row as any).image_url));
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormOpen(true);
  };

  const set = <K extends keyof MenuFormState>(key: K, value: MenuFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = branchMenuSchema.safeParse({
      branch_id: form.branch_id,
      section_title: form.section_title.trim(),
      section_subtitle: form.section_subtitle.trim() || undefined,
      item_name: form.item_name.trim(),
      item_description: form.item_description.trim() || undefined,
      price_regular: Number(form.price_regular),
      price_grande:
        form.price_grande.trim() === '' ? null : Number(form.price_grande),
      active: form.active,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? 'form';
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const priceRegular = Math.round(parsed.data.price_regular * 100);
    const priceGrande =
      parsed.data.price_grande === null || parsed.data.price_grande === undefined
        ? null
        : Math.round(parsed.data.price_grande * 100);

    // manejo de imagen
    let imageUrl = (editing as any)?.image_url ?? '/assets/vaso-cafe.webp';
    const file = fileInputRef.current?.files?.[0];
    const isDataUrl = imagePreview.startsWith('data:');
    const previewCleared = imagePreview === '' && !file;
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
      const fileName = `branch-menus/${parsed.data.branch_id}-${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('site-images').upload(fileName, file, { upsert: false });
      if (uploadError) {
        toast.error('No se pudo subir la imagen');
        setSubmitting(false);
        return;
      }
      imageUrl = `site-images/${fileName}`;
    } else if (previewCleared) {
      imageUrl = '/assets/vaso-cafe.webp';
    } else if (!isDataUrl && imagePreview) {
      // si no hay archivo nuevo pero preview es http//assets, normalizar si era absoluta legacy
      if (imagePreview.includes('/storage/v1/object/public/site-images/')) {
        imageUrl = `site-images/${imagePreview.split('/site-images/').pop()}`;
      } else if (imagePreview.startsWith('/assets') || imagePreview.startsWith('site-images/')) {
        imageUrl = imagePreview;
      }
    } else if (isDataUrl && !file) {
      // preview data sin archivo (no debería pasar) mantener existente
      imageUrl = (editing as any)?.image_url ?? '/assets/vaso-cafe.webp';
    }

    const payload = {
      branch_id: parsed.data.branch_id,
      section_title: parsed.data.section_title.trim(),
      section_subtitle: parsed.data.section_subtitle?.trim() || null,
      item_name: parsed.data.item_name.trim(),
      item_description: parsed.data.item_description?.trim() || null,
      price_regular: priceRegular,
      price_grande: priceGrande,
      image_url: imageUrl,
      active: parsed.data.active,
    };

    setSubmitting(true);
    if (editing) {
      const { error: updateError } = await supabase
        .from('branch_menus')
        .update(payload)
        .eq('id', editing.id);
      setSubmitting(false);
      if (updateError) {
        toast.error('No se pudo actualizar el ítem');
        return;
      }
      toast.success('Ítem actualizado');
    } else {
      const { error: insertError } = await supabase.from('branch_menus').insert(payload);
      setSubmitting(false);
      if (insertError) {
        toast.error('No se pudo crear el ítem');
        return;
      }
      toast.success('Ítem creado');
    }
    setFormOpen(false);
    invalidate();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    const { error: deleteError } = await supabase
      .from('branch_menus')
      .delete()
      .eq('id', confirmDelete.id);
    setDeleting(false);
    if (deleteError) {
      toast.error('No se pudo eliminar el ítem');
      return;
    }
    toast.success('Ítem eliminado');
    setConfirmDelete(null);
    invalidate();
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox message="No se pudo cargar los menús de sucursal." />;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-3xl">
            Menús de sucursal
          </h1>
          <p className="mt-1 text-sm text-ocheto-coffee-700/70">
            {(items ?? []).length} ítems en total.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-sm font-semibold hover:bg-ocheto-green-600 transition-colors shadow-lg shadow-ocheto-green-700/25"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Nuevo ítem
        </button>
      </div>

      {BRANCHES.map((branch) => {
        const branchItems = (items ?? []).filter((i) => i.branch_id === branch.id);
        return (
          <div key={branch.id} className="mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-ocheto-caramel-500/15 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-ocheto-caramel-600" />
              </span>
              <h2 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-xl">
                {branch.name}
              </h2>
              <span className="text-xs text-ocheto-coffee-700/60 font-semibold">
                {branchItems.length} ítems
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-ocheto-cream-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-ocheto-coffee-700/60 border-b border-ocheto-cream-200">
                      <th className="px-5 py-3.5 font-bold">Sección</th>
                      <th className="px-5 py-3.5 font-bold">Ítem</th>
                      <th className="px-5 py-3.5 font-bold">Imagen</th>
                      <th className="px-5 py-3.5 font-bold">Precios</th>
                      <th className="px-5 py-3.5 font-bold">Estado</th>
                      <th className="px-5 py-3.5 font-bold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ocheto-cream-200/70">
                    {branchItems.map((row) => (
                      <tr key={row.id} className="hover:bg-ocheto-cream-50 transition-colors">
                        <td className="px-5 py-3 text-ocheto-coffee-700 max-w-[200px]">
                          <p className="font-semibold text-ocheto-coffee-900 truncate">
                            {row.section_title}
                          </p>
                          {row.section_subtitle && (
                            <p className="text-xs text-ocheto-coffee-700/60 truncate">
                              {row.section_subtitle}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <p className="font-semibold text-ocheto-coffee-900">{row.item_name}</p>
                          {row.item_description && (
                            <p className="text-xs text-ocheto-coffee-700/60">{row.item_description}</p>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="w-10 h-10 rounded-lg bg-ocheto-cream-50 border border-ocheto-cream-200 flex items-center justify-center overflow-hidden">
                            <img src={resolvePreview((row as any).image_url)} alt="" className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-5 py-3 font-bold text-ocheto-green-700 tabular-nums whitespace-nowrap">
                          {priceLabel(row)}
                        </td>
                        <td className="px-5 py-3">
                          <Badge active={row.active} />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEdit(row)}
                              className="p-2 rounded-lg hover:bg-ocheto-cream-100 transition-colors"
                              aria-label={`Editar ${row.item_name}`}
                            >
                              <Pencil className="w-4 h-4 text-ocheto-coffee-700" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(row)}
                              className="p-2 rounded-lg hover:bg-ocheto-berry-600/10 transition-colors"
                              aria-label={`Eliminar ${row.item_name}`}
                            >
                              <Trash2 className="w-4 h-4 text-ocheto-berry-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {branchItems.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-sm text-ocheto-coffee-700/70">Sin ítems para esta sucursal.</p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Formulario */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFormOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.form
              onSubmit={(e) => void handleSubmit(e)}
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl bg-ocheto-cream-50 rounded-3xl shadow-2xl my-6"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-ocheto-cream-200">
                <h3 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-2xl">
                  {editing ? `Editar: ${editing.item_name}` : 'Nuevo ítem de menú'}
                </h3>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="p-2 rounded-full hover:bg-ocheto-cream-100 transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-ocheto-coffee-700" />
                </button>
              </div>

              <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Imagen */}
                <div className="sm:col-span-2 flex items-center gap-5 bg-white rounded-xl border border-ocheto-cream-200 p-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-20 h-20 rounded-xl border-2 border-dashed border-ocheto-coffee-900/20 flex items-center justify-center overflow-hidden shrink-0 bg-ocheto-cream-50 hover:border-ocheto-green-700 transition-colors"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus className="w-6 h-6 text-ocheto-coffee-700/40" />
                    )}
                  </button>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-sm font-semibold hover:bg-ocheto-green-600"
                    >
                      <Upload className="w-4 h-4" /> {imagePreview ? 'Cambiar imagen' : 'Subir imagen'}
                    </button>
                    <p className="mt-2 text-xs text-ocheto-coffee-700/60">Opcional. Se guarda en site-images/branch-menus/. Vacío usa imagen por defecto.</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    {imagePreview && (
                      <button type="button" onClick={() => { setImagePreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="mt-1 text-xs text-ocheto-berry-600 hover:underline">
                        Quitar imagen (usar por defecto)
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Sucursal *</label>
                  <select
                    value={form.branch_id}
                    onChange={(e) => set('branch_id', e.target.value)}
                    className={inputClass}
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Sección *</label>
                  <input
                    type="text"
                    value={form.section_title}
                    onChange={(e) => set('section_title', e.target.value)}
                    className={inputClass}
                    placeholder="Bebidas Calientes"
                  />
                  {errors.section_title && <p className="mt-1 text-xs text-ocheto-berry-600">{errors.section_title}</p>}
                </div>
                <div>
                  <label className={labelClass}>Subtítulo de sección</label>
                  <input
                    type="text"
                    value={form.section_subtitle}
                    onChange={(e) => set('section_subtitle', e.target.value)}
                    className={inputClass}
                    placeholder="Con Café (Regular / Grande)"
                  />
                </div>
                <div>
                  <label className={labelClass}>Nombre del ítem *</label>
                  <input
                    type="text"
                    value={form.item_name}
                    onChange={(e) => set('item_name', e.target.value)}
                    className={inputClass}
                    placeholder="Latte Ocheto"
                  />
                  {errors.item_name && <p className="mt-1 text-xs text-ocheto-berry-600">{errors.item_name}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Descripción</label>
                  <input
                    type="text"
                    value={form.item_description}
                    onChange={(e) => set('item_description', e.target.value)}
                    className={inputClass}
                    placeholder="con Dulce de Leche"
                  />
                </div>
                <div>
                  <label className={labelClass}>Precio regular (Bs) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price_regular}
                    onChange={(e) => set('price_regular', e.target.value)}
                    className={inputClass}
                    placeholder="24.00"
                  />
                  {errors.price_regular && <p className="mt-1 text-xs text-ocheto-berry-600">{errors.price_regular}</p>}
                </div>
                <div>
                  <label className={labelClass}>Precio grande (Bs) — vacío si no aplica</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price_grande}
                    onChange={(e) => set('price_grande', e.target.value)}
                    className={inputClass}
                    placeholder="—"
                  />
                  {errors.price_grande && <p className="mt-1 text-xs text-ocheto-berry-600">{errors.price_grande}</p>}
                </div>
                <label className="sm:col-span-2 inline-flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 border-ocheto-cream-200 bg-white text-sm font-semibold text-ocheto-coffee-900 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => set('active', e.target.checked)}
                    className="accent-[hsl(var(--ocheto-green-700))] w-4 h-4"
                  />
                  Activo (visible en el menú público)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-ocheto-cream-200">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-ocheto-coffee-700 hover:bg-ocheto-cream-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-sm font-semibold hover:bg-ocheto-green-600 transition-colors shadow-lg shadow-ocheto-green-700/25 disabled:opacity-60"
                >
                  {submitting ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear ítem'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Eliminar ítem de menú"
        message={
          confirmDelete
            ? `"${confirmDelete.item_name}" se eliminará del menú de la sucursal. Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel={deleting ? 'Eliminando…' : 'Eliminar'}
        danger
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmDelete(null)}
      />
    </motion.div>
  );
}
