import { useRef, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, ImagePlus } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { formatCentsShort } from '@/lib/money';
import type { ProductRow } from '@/features/products/types';
import type { ProductCategory } from '@/types';

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'cafe', label: 'Café de Especialidad' },
  { value: 'matcha', label: 'Matcha & Té' },
  { value: 'specialty', label: 'Specialty Drinks' },
  { value: 'frio', label: 'Bebidas Frías' },
  { value: 'panaderia', label: 'Panadería' },
  { value: 'beans', label: 'Granos' },
  { value: 'merch', label: 'Merch' },
];

const ROAST_OPTIONS = ['light', 'medium', 'medium-dark', 'dark'] as const;
const CAFFEINE_OPTIONS = ['normal', 'high', 'low', 'none'] as const;
const TEMPERATURE_OPTIONS = ['hot', 'iced', 'both'] as const;

export const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  category: z.enum(['cafe', 'matcha', 'specialty', 'frio', 'panaderia', 'beans', 'merch']),
  description: z.string().min(2, 'Agrega una descripción corta'),
  long_description: z.string().optional(),
  priceBs: z.number({ message: 'Ingresa el precio' }).min(0, 'El precio no puede ser negativo'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Formato hex inválido (ej: #8B6914)'),
  tags: z.string().optional(),
  origin: z.string().optional(),
  roast: z.enum(ROAST_OPTIONS).nullable().optional(),
  notes: z.string().optional(),
  caffeine: z.enum(CAFFEINE_OPTIONS).nullable().optional(),
  temperature: z.enum(TEMPERATURE_OPTIONS).nullable().optional(),
  bestseller: z.boolean(),
  new: z.boolean(),
  vegan: z.boolean(),
  active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export interface ProductFormState {
  name: string;
  category: ProductCategory;
  description: string;
  long_description: string;
  priceBs: string;
  color: string;
  tags: string;
  origin: string;
  roast: string;
  notes: string;
  caffeine: string;
  temperature: string;
  bestseller: boolean;
  new: boolean;
  vegan: boolean;
  active: boolean;
}

export function productToFormState(row: ProductRow | null): ProductFormState {
  if (!row) {
    return {
      name: '',
      category: 'cafe',
      description: '',
      long_description: '',
      priceBs: '',
      color: '#8B6914',
      tags: '',
      origin: '',
      roast: '',
      notes: '',
      caffeine: '',
      temperature: '',
      bestseller: false,
      new: false,
      vegan: false,
      active: true,
    };
  }
  return {
    name: row.name,
    category: row.category,
    description: row.description,
    long_description: row.long_description ?? '',
    priceBs: String(row.price / 100),
    color: row.color,
    tags: (row.tags ?? []).join(', '),
    origin: row.origin ?? '',
    roast: row.roast ?? '',
    notes: (row.notes ?? []).join(', '),
    caffeine: row.caffeine ?? '',
    temperature: row.temperature ?? '',
    bestseller: row.bestseller,
    new: row.new,
    vegan: row.vegan,
    active: row.active,
  };
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-white border border-ocheto-cream-200 text-ocheto-coffee-900 text-sm placeholder:text-ocheto-coffee-700/40 focus:outline-none focus:ring-2 focus:ring-ocheto-green-700/40 focus:border-ocheto-green-700 transition-all';

const labelClass = 'block text-[11px] font-bold uppercase tracking-[0.14em] text-ocheto-coffee-700/80 mb-1.5';

interface ProductFormProps {
  product: ProductRow | null;
  onSaved: () => void;
  onClose: () => void;
}

export default function ProductForm({ product, onSaved, onClose }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormState>(() => productToFormState(product));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(() => {
    const raw = product?.image_url ?? '';
    if (!raw || raw.startsWith('http') || raw.startsWith('/assets') || raw.startsWith('/') || raw.startsWith('data:')) return raw;
    const path = raw.startsWith('product-images/') ? raw.replace('product-images/', '') : raw;
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl || raw;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = Boolean(product);

  const set = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = productSchema.safeParse({
      ...form,
      priceBs: Number(form.priceBs),
      roast: form.roast || null,
      caffeine: form.caffeine || null,
      temperature: form.temperature || null,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? 'form';
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const file = fileInputRef.current?.files?.[0];

      let imageUrl = imagePreview;
      // Si el preview es un data URL (preview local), no guardarlo; esperar upload
      const isDataUrl = imageUrl.startsWith('data:');
      if (isDataUrl) imageUrl = '';
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, { upsert: false });
        if (uploadError) throw uploadError;
        // Guardar relativo para portabilidad (S-02); toProduct resuelve a publicUrl
        imageUrl = `product-images/${fileName}`;
      } else if (imageUrl.startsWith('http') && imageUrl.includes('/storage/v1/object/public/product-images/')) {
        // Normalizar absoluta legacy a relativa
        imageUrl = `product-images/${imageUrl.split('/product-images/').pop()}`;
      }

      const payload = {
        name: parsed.data.name.trim(),
        slug: slugify(parsed.data.name),
        category: parsed.data.category,
        description: parsed.data.description.trim(),
        long_description: parsed.data.long_description?.trim() || null,
        price: Math.round(parsed.data.priceBs * 100),
        image_url: imageUrl || '/assets/cup-with-shadow.webp',
        color: parsed.data.color,
        tags: splitList(parsed.data.tags ?? ''),
        origin: parsed.data.origin?.trim() || null,
        roast: parsed.data.roast ?? null,
        notes: parsed.data.notes ? splitList(parsed.data.notes) : null,
        caffeine: parsed.data.caffeine ?? null,
        temperature: parsed.data.temperature ?? null,
        bestseller: parsed.data.bestseller,
        new: parsed.data.new,
        vegan: parsed.data.vegan,
        active: parsed.data.active,
      };

      if (isEdit && product) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id);
        if (error) throw error;
        toast.success('Producto actualizado');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) {
          if (error.message.includes('duplicate')) {
            toast.error('Ya existe un producto con ese nombre');
            return;
          }
          throw error;
        }
        toast.success('Producto creado');
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-3xl bg-ocheto-cream-50 rounded-3xl shadow-2xl my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ocheto-cream-200">
          <h3 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-2xl">
            {isEdit ? `Editar: ${product?.name}` : 'Nuevo producto'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-ocheto-cream-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-ocheto-coffee-700" />
          </button>
        </div>

        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Imagen */}
          <div className="md:col-span-2 flex items-center gap-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-28 h-28 rounded-2xl border-2 border-dashed border-ocheto-coffee-900/20 bg-white flex items-center justify-center overflow-hidden hover:border-ocheto-green-700 transition-colors shrink-0"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa" className="w-full h-full object-contain p-2" />
              ) : (
                <ImagePlus className="w-7 h-7 text-ocheto-coffee-700/40" />
              )}
            </button>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-sm font-semibold hover:bg-ocheto-green-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {imagePreview ? 'Cambiar imagen' : 'Subir imagen'}
              </button>
              <p className="mt-2 text-xs text-ocheto-coffee-700/60">
                Se guarda en Supabase Storage (bucket product-images).
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => void handleFileChange(e)}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Nombre *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={inputClass}
              placeholder="Café Helado"
            />
            {errors.name && <p className="mt-1 text-xs text-ocheto-berry-600">{errors.name}</p>}
          </div>

          <div>
            <label className={labelClass}>Categoría *</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value as ProductCategory)}
              className={inputClass}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-ocheto-berry-600">{errors.category}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Descripción corta *</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className={inputClass}
              placeholder="Espresso doble con hielo y leche cremosa paceña"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-ocheto-berry-600">{errors.description}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Descripción larga</label>
            <textarea
              value={form.long_description}
              onChange={(e) => set('long_description', e.target.value)}
              className={`${inputClass} min-h-[90px] resize-y`}
              placeholder="Historia y detalles del producto…"
            />
          </div>

          <div>
            <label className={labelClass}>Precio (Bs) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.priceBs}
              onChange={(e) => set('priceBs', e.target.value)}
              className={inputClass}
              placeholder="28.00"
            />
            {errors.priceBs && <p className="mt-1 text-xs text-ocheto-berry-600">{errors.priceBs}</p>}
            {form.priceBs && !Number.isNaN(Number(form.priceBs)) && (
              <p className="mt-1 text-xs text-ocheto-green-700">
                Se guarda como {formatCentsShort(Math.round(Number(form.priceBs) * 100))}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Color (hex)</label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={form.color}
                onChange={(e) => set('color', e.target.value)}
                className="w-10 h-10 rounded-lg border border-ocheto-cream-200 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={form.color}
                onChange={(e) => set('color', e.target.value)}
                className={inputClass}
                placeholder="#8B6914"
              />
            </div>
            {errors.color && <p className="mt-1 text-xs text-ocheto-berry-600">{errors.color}</p>}
          </div>

          <div>
            <label className={labelClass}>Tags (separados por coma)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              className={inputClass}
              placeholder="helado, clásico, favorito"
            />
          </div>

          <div>
            <label className={labelClass}>Origen</label>
            <input
              type="text"
              value={form.origin}
              onChange={(e) => set('origin', e.target.value)}
              className={inputClass}
              placeholder="Caranavi, Bolivia"
            />
          </div>

          <div>
            <label className={labelClass}>Tueste</label>
            <select
              value={form.roast}
              onChange={(e) => set('roast', e.target.value)}
              className={inputClass}
            >
              <option value="">—</option>
              {ROAST_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Notas (separadas por coma)</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className={inputClass}
              placeholder="Caramelo, Chocolate, Nuez"
            />
          </div>

          <div>
            <label className={labelClass}>Cafeína</label>
            <select
              value={form.caffeine}
              onChange={(e) => set('caffeine', e.target.value)}
              className={inputClass}
            >
              <option value="">—</option>
              {CAFFEINE_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Temperatura</label>
            <select
              value={form.temperature}
              onChange={(e) => set('temperature', e.target.value)}
              className={inputClass}
            >
              <option value="">—</option>
              {TEMPERATURE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Flags */}
          <div className="md:col-span-2 flex flex-wrap gap-2.5">
            {(
              [
                ['bestseller', 'Bestseller'],
                ['new', 'Nuevo'],
                ['vegan', 'Vegano'],
                ['active', 'Activo (visible en la tienda)'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-semibold cursor-pointer transition-colors ${
                  form[key]
                    ? 'border-ocheto-green-700 bg-ocheto-green-700/10 text-ocheto-green-700'
                    : 'border-ocheto-cream-200 bg-white text-ocheto-coffee-700/70 hover:border-ocheto-green-700/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => set(key, e.target.checked)}
                  className="accent-[hsl(var(--ocheto-green-700))] w-4 h-4"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-ocheto-cream-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-ocheto-coffee-700 hover:bg-ocheto-cream-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-sm font-semibold hover:bg-ocheto-green-600 transition-colors shadow-lg shadow-ocheto-green-700/25 disabled:opacity-60"
          >
            {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
