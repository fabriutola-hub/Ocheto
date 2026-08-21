import { useRef } from 'react';
import { EASE, useInfiniteAnimation } from '@/shared/motion';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { formatCentsShort } from '@/lib/money';
import type { ProductCardData } from './productCardData';

export function CompactVariant({ d }: { d: ProductCardData }) {
  const { product, tags, baseDelay, softGradient, cartItem, showAddToCart, cardRef, handleCardClick, handleAddToCart, updateQuantity } = d;

  const imgRef = useRef<HTMLImageElement>(null);
  const animateFloat = useInfiniteAnimation(imgRef);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: baseDelay, ease: EASE }}
      whileHover={{ y: -2 }}
      onClick={handleCardClick}
      className="group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white border border-ocheto-cream-200/70 hover:border-ocheto-green-700/30 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${hexToRgba(product.color, 0.06)} 0%, transparent 60%)`,
        }}
      />
      <div
        className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex items-center justify-center"
        style={{ background: softGradient }}
      >
        <motion.img
          ref={imgRef}
          src={product.image}
          alt={product.name}
          draggable={false}
          className="relative z-[2] w-full h-full object-contain p-1.5 drop-shadow-md"
          animate={animateFloat ? { y: [0, -4, 0] } : undefined}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {tags[0] && (
          <div
            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white z-[3] shadow-sm"
            style={{ backgroundColor: tags[0].bg }}
            aria-label={tags[0].label}
          />
        )}
      </div>
      <div className="flex-1 min-w-0 relative z-[2]">
        <h4 className="font-fraunces font-bold text-ocheto-coffee-900 text-base sm:text-lg truncate">
          {product.name}
        </h4>
        {product.origin && (
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ocheto-coffee-700/60 font-semibold mt-0.5 truncate">
            {product.origin}
          </p>
        )}
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <span
            className="font-fraunces font-black text-lg sm:text-xl tabular-nums leading-none"
            style={{ color: 'hsl(var(--ocheto-green-700))' }}
          >
            {formatCentsShort(product.price)}
          </span>
          <div className="flex items-center gap-1.5">
            {cartItem ? (
              <div
                className="flex items-center gap-0.5 rounded-full p-0.5 shadow-sm"
                style={{ backgroundColor: 'hsl(var(--ocheto-green-700))' }}
              >
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, cartItem.quantity - 1);
                  }}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
                  style={{
                    backgroundColor: 'hsla(var(--ocheto-cream-50), 0.15)',
                    color: 'hsl(var(--ocheto-cream-50))',
                  }}
                  aria-label="Reducir cantidad"
                >
                  −
                </motion.button>
                <span
                  className="font-bold text-xs sm:text-sm min-w-[20px] sm:min-w-[22px] text-center tabular-nums"
                  style={{ color: 'hsl(var(--ocheto-cream-50))' }}
                >
                  {cartItem.quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, cartItem.quantity + 1);
                  }}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
                  style={{
                    backgroundColor: 'hsla(var(--ocheto-cream-50), 0.15)',
                    color: 'hsl(var(--ocheto-cream-50))',
                  }}
                  aria-label="Aumentar cantidad"
                >
                  +
                </motion.button>
              </div>
            ) : (
              showAddToCart && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full font-semibold text-xs shadow-md"
                  style={{
                    backgroundColor: 'hsl(var(--ocheto-green-700))',
                    color: 'hsl(var(--ocheto-cream-50))',
                  }}
                  aria-label={`Agregar ${product.name}`}
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                  Agregar
                </motion.button>
              )
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) {
    return `rgba(27, 94, 32, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
