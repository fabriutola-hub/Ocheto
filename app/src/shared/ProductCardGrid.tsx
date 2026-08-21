import { useRef } from 'react';
import { EASE, useInfiniteAnimation } from '@/shared/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, Plus, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCentsShort } from '@/lib/money';
import type { ProductCardData } from './productCardData';

export function GridVariant({ d }: { d: ProductCardData }) {
  const {
    product, tags, notes, baseDelay, softGradient, glowGradient,
    berryColor, goldColor, isFavorite, favoriteBusy, justAdded,
    showAddToCart, buyMode, cardRef,
    rotateX, rotateY, handleCardClick, handleAddToCart,
    handleBuyWhatsApp, handleToggleFavorite, handleMouseMove, handleMouseLeave,
  } = d;

  const imgRef = useRef<HTMLImageElement>(null);
  const animateFloat = useInfiniteAnimation(imgRef);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: baseDelay, ease: EASE }}
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
              disabled={favoriteBusy}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 disabled:opacity-60"
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
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
            ref={imgRef}
            src={product.image}
            alt={product.name}
            draggable={false}
            animate={animateFloat ? { y: [0, -8, 0] } : undefined}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-[2] w-3/5 sm:w-2/3 h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-[1.08]"
          />

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 origin-left"
            style={{ backgroundColor: product.color }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: baseDelay + 0.3, duration: 0.7, ease: EASE }}
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
            <div className="flex flex-col">
              {product.priceGrande != null ? (
                <>
                  <span className="font-fraunces font-black text-[1.35rem] sm:text-[1.45rem] tabular-nums leading-none" style={{ color: 'hsl(var(--ocheto-green-700))' }}>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-ocheto-coffee-700/60 mr-1">Regular</span>
                    {formatCentsShort(product.price)}
                  </span>
                  <span className="font-fraunces font-black text-[1.35rem] sm:text-[1.45rem] tabular-nums leading-none" style={{ color: 'hsl(var(--ocheto-green-700))' }}>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-ocheto-coffee-700/60 mr-1">Grande</span>
                    {formatCentsShort(product.priceGrande)}
                  </span>
                </>
              ) : (
                <span
                  className="font-fraunces font-black text-2xl sm:text-[1.7rem] tabular-nums leading-none"
                  style={{ color: 'hsl(var(--ocheto-green-700))' }}
                >
                  {formatCentsShort(product.price)}
                </span>
              )}
            </div>
            {buyMode ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleBuyWhatsApp}
                className="relative inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                style={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                }}
                aria-label={`Comprar ${product.name} por WhatsApp`}
              >
                <MessageCircle className="w-3.5 h-3.5" strokeWidth={2.4} />
                Comprar
              </motion.button>
            ) : (
              showAddToCart && (
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
              )
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
