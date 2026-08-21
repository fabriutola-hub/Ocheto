import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, EyeOff, Eye, Trash2, Package } from 'lucide-react';
import { useAllProducts } from '@/features/products/queries';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { formatCentsShort } from '@/lib/money';
import { Badge, Loading, ErrorBox } from '@/features/admin/ui';
import ConfirmDialog from '@/features/admin/ConfirmDialog';
import ProductForm from '@/features/admin/ProductForm';
import type { ProductRow } from '@/features/products/types';

const CATEGORY_LABELS: Record<string, string> = {
  cafe: 'Café',
  matcha: 'Matcha',
  specialty: 'Specialty',
  frio: 'Bebidas Frías',
  panaderia: 'Panadería',
  beans: 'Granos',
  merch: 'Merch',
};

type ConfirmState =
  | { kind: 'toggle'; product: ProductRow }
  | { kind: 'delete'; product: ProductRow }
  | null;

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { data: products, isLoading, error } = useAllProducts();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [working, setWorking] = useState(false);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['products'] });
    void queryClient.invalidateQueries({ queryKey: ['featured-products'] });
  };

  const handleToggleActive = async () => {
    if (!confirm || confirm.kind !== 'toggle') return;
    setWorking(true);
    const { error: updateError } = await supabase
      .from('products')
      .update({ active: !confirm.product.active })
      .eq('id', confirm.product.id);
    setWorking(false);
    if (updateError) {
      toast.error('No se pudo actualizar el producto');
      return;
    }
    toast.success(confirm.product.active ? 'Producto inactivado' : 'Producto reactivado');
    setConfirm(null);
    invalidate();
  };

  const handleDelete = async () => {
    if (!confirm || confirm.kind !== 'delete') return;
    setWorking(true);
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', confirm.product.id);
    setWorking(false);
    if (deleteError) {
      toast.error('No se pudo eliminar el producto');
      return;
    }
    toast.success('Producto eliminado definitivamente');
    setConfirm(null);
    invalidate();
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox message="No se pudo cargar los productos." />;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-3xl">
            Productos de tienda
          </h1>
          <p className="mt-1 text-sm text-ocheto-coffee-700/70">
            {(products ?? []).length} productos · activos e inactivos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ocheto-green-700 text-ocheto-cream-50 text-sm font-semibold hover:bg-ocheto-green-600 transition-colors shadow-lg shadow-ocheto-green-700/25"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Nuevo producto
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-ocheto-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-ocheto-coffee-700/60 border-b border-ocheto-cream-200">
                <th className="px-5 py-3.5 font-bold">Producto</th>
                <th className="px-5 py-3.5 font-bold">Categoría</th>
                <th className="px-5 py-3.5 font-bold">Precio</th>
                <th className="px-5 py-3.5 font-bold">Estado</th>
                <th className="px-5 py-3.5 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocheto-cream-200/70">
              {(products ?? []).map((p) => (
                <tr key={p.id} className="hover:bg-ocheto-cream-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `linear-gradient(135deg, ${p.color}22, ${p.color}10)` }}
                      >
                        <img src={p.image_url} alt="" className="w-7 h-7 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-ocheto-coffee-900 truncate max-w-[220px]">
                          {p.name}
                        </p>
                        {p.bestseller && (
                          <p className="text-[10px] font-bold uppercase tracking-wider text-ocheto-gold-600">
                            Bestseller
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ocheto-coffee-700">
                    {CATEGORY_LABELS[p.category] ?? p.category}
                  </td>
                  <td className="px-5 py-3 font-bold text-ocheto-green-700 tabular-nums">
                    {formatCentsShort(p.price)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge active={p.active} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(p);
                          setFormOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-ocheto-cream-100 transition-colors"
                        aria-label={`Editar ${p.name}`}
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4 text-ocheto-coffee-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirm({ kind: 'toggle', product: p })}
                        className="p-2 rounded-lg hover:bg-ocheto-cream-100 transition-colors"
                        aria-label={p.active ? `Inactivar ${p.name}` : `Reactivar ${p.name}`}
                        title={p.active ? 'Inactivar' : 'Reactivar'}
                      >
                        {p.active ? (
                          <EyeOff className="w-4 h-4 text-ocheto-caramel-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-ocheto-green-700" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirm({ kind: 'delete', product: p })}
                        className="p-2 rounded-lg hover:bg-ocheto-berry-600/10 transition-colors"
                        aria-label={`Eliminar ${p.name}`}
                        title="Eliminar definitivamente"
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

        {(products ?? []).length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-8 h-8 text-ocheto-coffee-700/40 mx-auto mb-3" />
            <p className="text-sm text-ocheto-coffee-700/70">No hay productos todavía.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {formOpen && (
          <ProductForm
            key={editing?.id ?? 'new'}
            product={editing}
            onSaved={() => {
              setFormOpen(false);
              invalidate();
            }}
            onClose={() => setFormOpen(false)}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirm?.kind === 'toggle'}
        title={confirm?.kind === 'toggle' && !confirm.product.active ? 'Reactivar producto' : 'Inactivar producto'}
        message={
          confirm?.kind === 'toggle'
            ? confirm.product.active
              ? `"${confirm.product.name}" dejará de aparecer en la tienda y el menú, pero conservará sus favoritos. Podrás reactivarlo cuando quieras.`
              : `"${confirm.product.name}" volverá a aparecer en la tienda y el menú.`
            : ''
        }
        confirmLabel={working ? 'Guardando…' : confirm?.kind === 'toggle' && confirm.product.active ? 'Inactivar' : 'Reactivar'}
        onConfirm={() => void handleToggleActive()}
        onCancel={() => setConfirm(null)}
      />

      <ConfirmDialog
        open={confirm?.kind === 'delete'}
        title="Eliminar producto"
        message={
          confirm?.kind === 'delete'
            ? `"${confirm.product.name}" se borrará físicamente de la base de datos y sus favoritos asociados se eliminarán. Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel={working ? 'Eliminando…' : 'Eliminar definitivamente'}
        danger
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirm(null)}
      />
    </motion.div>
  );
}
