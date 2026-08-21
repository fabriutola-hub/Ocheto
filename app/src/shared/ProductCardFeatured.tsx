import { useRef } from 'react';
import { EASE, useInfiniteAnimation } from '@/shared/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, Plus, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCentsShort } from '@/lib/money';
import type { ProductCardData } from './productCardData';

export function FeaturedVariant({ d }: { d: ProductCardData }) {
  const {
    product, tags, notes, baseDelay, softGradient, glowGradient,
    berryColor, isFavorite, favoriteBusy, justAdded, showAddToCart, buyMode, cardRef,
    rotateX, rotateY, handleCardClick, handleAddToCart,
    handleBuyWhatsApp, handleToggleFavorite, handleMouseMove, handleMouseLeave,
  } = d;

  const imgRef = useRef<HTMLImageElement>(null);
  const animateFloat = useInfiniteAnimation(imgRef);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: baseDelay, ease: EASE }}
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
            disabled={favoriteBusy}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg z-10 disabled:opacity-60"
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
            ref={imgRef}
            src={product.image}
            alt={product.name}
            draggable={false}
            animate={animateFloat ? { y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] } : undefined}
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
            transition={{ delay: baseDelay + 0.4, duration: 0.8, ease: EASE }}
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
                {formatCentsShort(product.price)}
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
              {buyMode ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyWhatsApp}
                  className="relative inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg overflow-hidden min-w-[120px]"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
                  }}
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={2.4} />
                  Comprar
                </motion.button>
              ) : (
                showAddToCart && (
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
                )
              )}
            </div>
          </motion.div>
        </div>
      </motion.article>
    </motion.div>
  );
}
