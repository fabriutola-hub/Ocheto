import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-[101] w-full sm:w-[440px] bg-[hsl(var(--ocheto-cream-50))] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[hsl(var(--ocheto-green-700)/0.1)] bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[hsl(var(--ocheto-green-700))]" strokeWidth={1.8} />
                <h2 className="font-display text-xl font-bold text-[hsl(var(--ocheto-coffee-900))]">
                  Tu Pedido
                </h2>
                {totalItems > 0 && (
                  <span className="text-xs font-semibold text-white bg-[hsl(var(--ocheto-green-700))] rounded-full px-2.5 py-0.5">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-[hsl(var(--ocheto-cream-100))] transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-24 h-24 rounded-full bg-[hsl(var(--ocheto-cream-100))] flex items-center justify-center mb-5"
                  >
                    <ShoppingBag className="w-10 h-10 text-[hsl(var(--ocheto-green-700)/0.5)]" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="font-display text-xl font-bold text-[hsl(var(--ocheto-coffee-900))] mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-sm text-[hsl(var(--ocheto-coffee-700))]/70 max-w-xs">
                    Explora nuestro menú o tienda y agrega tus favoritos.
                  </p>
                  <Link
                    to="/menu"
                    onClick={() => setIsOpen(false)}
                    className="mt-6 btn-primary text-sm"
                  >
                    Ver Menú
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50, height: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-[hsl(var(--ocheto-cream-200))]"
                      >
                        <div className="flex gap-3">
                          <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${item.color}22, ${item.color}10)` }}
                          >
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-display font-bold text-[hsl(var(--ocheto-coffee-900))] text-sm leading-tight">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-1 hover:bg-[hsl(var(--ocheto-cream-100))] rounded transition-colors"
                                aria-label="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-[hsl(var(--ocheto-coffee-700)/0.5)]" />
                              </button>
                            </div>
                            <p className="text-xs text-[hsl(var(--ocheto-coffee-700)/0.7)] line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 bg-[hsl(var(--ocheto-cream-100))] rounded-full p-0.5">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
                                  aria-label="Restar"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-bold w-5 text-center tabular-nums">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-full bg-[hsl(var(--ocheto-green-700))] text-white shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
                                  aria-label="Sumar"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="font-display font-bold text-[hsl(var(--ocheto-green-700))] tabular-nums">
                                Bs {item.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-t border-[hsl(var(--ocheto-green-700)/0.1)] px-6 py-5 bg-white/80 backdrop-blur-sm space-y-3"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--ocheto-coffee-700)/0.7)]">Subtotal</span>
                  <span className="font-bold tabular-nums">Bs {totalPrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-[hsl(var(--ocheto-coffee-900))]">Total</span>
                  <span className="font-display text-2xl font-bold text-[hsl(var(--ocheto-green-700))] tabular-nums">
                    Bs {totalPrice}
                  </span>
                </div>
                <button className="w-full btn-primary py-4">
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-xs text-[hsl(var(--ocheto-coffee-700)/0.6)] hover:text-[hsl(var(--ocheto-berry-600))] transition-colors"
                >
                  Vaciar carrito
                </button>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
