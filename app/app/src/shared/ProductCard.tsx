import { useState, useRef, useCallback } from 'react';
import type { MouseEvent } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Plus, Heart, Eye, Coffee, Flame, Leaf } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'featured' | 'compact';
  showAddToCart?: boolean;
  onClick?: () => void;
  index?: number;
}

type TagKey = 'bestseller' | 'new' | 'vegan';

interface TagDef {
  key: TagKey;
  label: string;
  icon: LucideIcon;
  bg: string;
  text: string;
}

const TAG_DEFS: Record<TagKey, TagDef> = {
  bestseller: {
    key: 'bestseller',
    label: 'Bestseller',
    icon: Flame,
    bg: '#E8B923',
    text: '#1a1a1a',
  },
  new: {
    key: 'new',
    label: 'Nuevo',
    icon: Coffee,
    bg: '#4F9B3F',
    text: '#FAF7F0',
  },
  vegan: {
    key: 'vegan',
    label: 'Vegano',
    icon: Leaf,
    bg: '#82C46D',
    text: '#1a1a1a',
  },
};

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

function getProductTags(product: Product): TagDef[] {
  const tags: TagDef[] = [];
  if (product.bestseller) tags.push(TAG_DEFS.bestseller);
  if (product.new) tags.push(TAG_DEFS.new);
  if (product.vegan) tags.push(TAG_DEFS.vegan);
  return tags;
}

function getNoteList(product: Product): string[] {
  if (product.notes && product.notes.length > 0) return product.notes.slice(0, 3);
  if (product.tags && product.tags.length > 0) return product.tags.slice(0, 3);
  return [];
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function ProductCard({
  product,
  variant = 'grid',
  showAddToCart = true,
  onClick,
  index = 0,
}: ProductCardProps) {
  const { addItem, items, updateQuantity } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // ===== 3D tilt =====
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-8, 8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [8, -8]), springConfig);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleAddToCart = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
      addItem({ ...product, quantity: 1 });
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1400);
    },
    [addItem, product],
  );

  const handleToggleFavorite = useCallback((e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorite((prev) => !prev);
  }, []);

  const handleCardClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const cartItem = items.find((i) => i.id === product.id);
  const tags = getProductTags(product);
  const notes = getNoteList(product);
  const baseDelay = index * 0.05;
  const softGradient = `linear-gradient(135deg, ${hexToRgba(product.color, 0.12)} 0%, ${hexToRgba(product.color, 0.04)} 50%, ${hexToRgba(product.color, 0.18)} 100%)`;
  const glowGradient = `radial-gradient(circle at 50% 60%, ${hexToRgba(product.color, 0.35)} 0%, transparent 65%)`;
  const berryColor = 'hsl(var(--ocheto-berry-600))';
  const goldColor = 'hsl(var(--ocheto-gold-500))';

  // ============================================================
  // COMPACT VARIANT
  // ============================================================
  if (variant === 'compact') {
    return (
      <motion.article
        ref={cardRef}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: baseDelay, ease: EASE_OUT_EXPO }}
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
            src={product.image}
            alt={product.name}
            draggable={false}
            className="relative z-[2] w-full h-full object-contain p-1.5 drop-shadow-md"
            animate={{ y: [0, -4, 0] }}
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
              Bs {product.price}
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

  // ============================================================
  // FEATURED VARIANT
  // ============================================================
  if (variant === 'featured') {
    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, delay: baseDelay, ease: EASE_OUT_EXPO }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
        className="relative w-full"
      >
        <motion.article
          onClick={handleCardClick}
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="group relative grid grid-cols-1 md:grid-cols-5 gap-0 rounded-3xl bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer border border-ocheto-cream-200/60"
        >
          <div
            className="relative md:col-span-3 h-72 sm:h-96 md:h-[520px] overflow-hidden flex items-center justify-center"
            style={{ background: softGradient }}
          >
            <div
              className="absolute inset-0 opacity-60 pointer-events-none transition-opacity duration-500 group-hover:opacity-90"
              style={{ background: glowGradient }}
            />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none dots-bg" />

            <div className="absolute top-4 sm:top-5 left-4 sm:left-5 flex flex-col gap-2 z-10">
              {tags.map((tag, i) => {
                const Icon = tag.icon;
                return (
                  <motion.div
                    key={tag.key}
                    initial={{ opacity: 0, scale: 0.4, x: -20, rotate: -15 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0, rotate: -4 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: baseDelay + 0.2 + i * 0.08,
                      type: 'spring',
                      stiffness: 320,
                      damping: 22,
                    }}
                    className="px-3 sm:px-4 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] shadow-lg"
                    style={{ backgroundColor: tag.bg, color: tag.text }}
                  >
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />
                    {tag.label}
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg z-10"
              aria-label="Favorito"
            >
              <Heart
                className={cn(
                  'w-5 h-5 transition-colors',
                  isFavorite ? '' : 'text-ocheto-coffee-700',
                )}
                style={isFavorite ? { fill: berryColor, color: berryColor } : undefined}
              />
            </motion.button>

            <motion.img
              src={product.image}
              alt={product.name}
              draggable={false}
              animate={{ y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-[2] w-56 sm:w-72 md:w-80 lg:w-96 h-auto object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.45)] transition-transform duration-700 group-hover:scale-[1.06]"
            />
          </div>

          <div className="md:col-span-2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-ocheto-cream-50 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 right-0 h-1 origin-left"
              style={{ backgroundColor: product.color }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: baseDelay + 0.4, duration: 0.8, ease: EASE_OUT_EXPO }}
            />
            {product.origin && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: baseDelay + 0.15, duration: 0.4 }}
                className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-ocheto-coffee-700/70 font-semibold mb-3 flex items-center gap-2"
              >
                <span className="inline-block w-6 h-px bg-ocheto-coffee-700/40" />
                {product.origin}
              </motion.p>
            )}
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: baseDelay + 0.2, duration: 0.5 }}
              className="font-fraunces font-black italic text-ocheto-coffee-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95]"
            >
              {product.name}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: baseDelay + 0.3, duration: 0.4 }}
              className="mt-4 text-ocheto-coffee-700/80 text-sm sm:text-base leading-relaxed"
            >
              {product.description}
            </motion.p>
            {notes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: baseDelay + 0.35, duration: 0.4 }}
                className="mt-5 flex flex-wrap gap-2"
              >
                {notes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 rounded-full bg-ocheto-cream-100 text-ocheto-coffee-900 text-xs font-medium border border-ocheto-cream-200"
                  >
                    {note}
                  </span>
                ))}
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: baseDelay + 0.4, duration: 0.5 }}
              className="mt-7 flex items-center justify-between gap-4 flex-wrap"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-ocheto-coffee-700/60 font-semibold">
                  Desde
                </span>
                <span
                  className="font-fraunces font-black text-3xl sm:text-4xl tabular-nums"
                  style={{ color: 'hsl(var(--ocheto-green-700))' }}
                >
                  Bs {product.price}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-ocheto-green-700 text-ocheto-green-700 font-semibold text-sm hover:bg-ocheto-green-700 hover:text-ocheto-cream-50 transition-colors duration-300"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalles
                </motion.button>
                {showAddToCart && (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="relative inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg overflow-hidden min-w-[120px]"
                    style={{
                      backgroundColor: 'hsl(var(--ocheto-green-700))',
                      color: 'hsl(var(--ocheto-cream-50))',
                      boxShadow: '0 8px 24px hsla(var(--ocheto-green-700), 0.35)',
                    }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {justAdded ? (
                        <motion.span
                          key="added"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="inline-flex items-center gap-1"
                        >
                          ¡Listo!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="inline-flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" strokeWidth={3} />
                          Agregar
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.article>
      </motion.div>
    );
  }

  // ============================================================
  // GRID VARIANT (default)
  // ============================================================
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: baseDelay, ease: EASE_OUT_EXPO }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className="relative h-full"
    >
      <motion.article
        onClick={handleCardClick}
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative h-full rounded-2xl bg-white border border-ocheto-cream-200/60 shadow-sm hover:shadow-2xl transition-shadow duration-500 overflow-hidden cursor-pointer flex flex-col"
      >
        <div
          className="relative aspect-[4/3] overflow-hidden flex items-center justify-center"
          style={{ background: softGradient }}
        >
          <div
            className="absolute inset-0 opacity-50 pointer-events-none transition-opacity duration-500 group-hover:opacity-80"
            style={{ background: glowGradient }}
          />
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none dots-bg" />

          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
            {tags.map((tag, i) => {
              const Icon = tag.icon;
              return (
                <motion.div
                  key={tag.key}
                  initial={{ opacity: 0, scale: 0.4, x: 20, rotate: 15 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0, rotate: -6 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: baseDelay + 0.15 + i * 0.07,
                    type: 'spring',
                    stiffness: 320,
                    damping: 20,
                  }}
                  className="px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] shadow-md"
                  style={{ backgroundColor: tag.bg, color: tag.text }}
                >
                  <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} />
                  {tag.label}
                </motion.div>
              );
            })}
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleToggleFavorite}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              aria-label="Agregar a favoritos"
            >
              <Heart
                className={cn(
                  'w-4 h-4 transition-all',
                  isFavorite ? '' : 'text-ocheto-coffee-700',
                )}
                style={isFavorite ? { fill: berryColor, color: berryColor } : undefined}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75"
              aria-label="Ver detalles"
            >
              <Eye className="w-4 h-4 text-ocheto-coffee-700" />
            </motion.button>
          </div>

          <motion.img
            src={product.image}
            alt={product.name}
            draggable={false}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-[2] w-3/5 sm:w-2/3 h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-[1.08]"
          />

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 origin-left"
            style={{ backgroundColor: product.color }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: baseDelay + 0.3, duration: 0.7, ease: EASE_OUT_EXPO }}
          />
        </div>

        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          {product.origin && (
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-ocheto-coffee-700/60 font-semibold mb-1.5">
              · {product.origin} ·
            </p>
          )}
          <h3 className="font-fraunces font-black text-ocheto-coffee-900 text-lg sm:text-xl leading-tight">
            {product.name}
          </h3>
          <p className="mt-1.5 text-ocheto-coffee-700/75 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>
          {notes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {notes.map((note) => (
                <span
                  key={note}
                  className="px-2 py-0.5 rounded-full bg-ocheto-cream-100 text-ocheto-coffee-700 text-[10px] sm:text-[11px] font-medium border border-ocheto-cream-200/70"
                >
                  {note}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-4 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <span
                className="font-fraunces font-black text-2xl sm:text-[1.7rem] tabular-nums leading-none"
                style={{ color: 'hsl(var(--ocheto-green-700))' }}
              >
                Bs {product.price}
              </span>
            </div>
            {showAddToCart && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAddToCart}
                className="relative inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                style={{
                  backgroundColor: 'hsl(var(--ocheto-green-700))',
                  color: 'hsl(var(--ocheto-cream-50))',
                }}
                aria-label={`Agregar ${product.name} al carrito`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {justAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex items-center gap-1"
                    >
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-black"
                        style={{
                          backgroundColor: goldColor,
                          color: 'hsl(var(--ocheto-coffee-900))',
                        }}
                      >
                        +1
                      </motion.span>
                      ¡Listo!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                      Agregar
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default ProductCard;
