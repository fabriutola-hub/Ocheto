import { useState, useRef, useCallback, useEffect, memo, useMemo } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
import { useCartActions, useCartItem } from '@/features/cart/CartContext';
import { useAuth } from '@/features/auth/store';
import { useFavoriteIds, favoritesStore } from '@/features/favorites/store';
import { buildWhatsAppProductUrl } from '@/features/shop/whatsapp';
import { getProductTags, getNoteList } from '@/features/products/tags';
import { toast } from '@/lib/toast';
import type { Product } from '@/types';
import { CompactVariant } from './ProductCardCompact';
import { FeaturedVariant } from './ProductCardFeatured';
import { GridVariant } from './ProductCardGrid';
import type { ProductCardData } from './productCardData';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'featured' | 'compact';
  showAddToCart?: boolean;
  mode?: 'cart' | 'whatsapp';
  onClick?: () => void;
  index?: number;
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

function ProductCardInner({
  product,
  variant = 'grid',
  showAddToCart = true,
  mode = 'cart',
  onClick,
  index = 0,
}: ProductCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const { addItem, updateQuantity } = useCartActions();
  const cartItem = useCartItem(product.id);
  const { ids } = useFavoriteIds();
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const justAddedTimer = useRef<number | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement>(null);

  const isFavorite = ids.has(product.id);

  useEffect(() => {
    return () => {
      if (justAddedTimer.current !== undefined) {
        window.clearTimeout(justAddedTimer.current);
      }
    };
  }, []);

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
      justAddedTimer.current = window.setTimeout(() => setJustAdded(false), 1400);
    },
    [addItem, product],
  );

  const handleBuyWhatsApp = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
      const url = buildWhatsAppProductUrl(product.name, product.price);
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        toast.info('No se pudo abrir WhatsApp. Copia el enlace manualmente.', url);
      }
    },
    [product],
  );

  const handleToggleFavorite = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (!session) {
        const returnTo = encodeURIComponent(location.pathname + location.search);
        navigate(`/auth/login?returnTo=${returnTo}`);
        return;
      }
      if (favoriteBusy) return;
      setFavoriteBusy(true);
      void favoritesStore.toggle(product.id).then((ok) => {
        setFavoriteBusy(false);
        if (ok) {
          toast.success(
            isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos',
          );
        } else {
          toast.error('No se pudo guardar el favorito');
        }
      });
    },
    [session, favoriteBusy, isFavorite, navigate, location, product.id],
  );

  const handleCardClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const tags = useMemo(() => getProductTags(product), [product]);
  const notes = useMemo(() => getNoteList(product), [product]);
  const softGradient = useMemo(
    () =>
      `linear-gradient(135deg, ${hexToRgba(product.color, 0.12)} 0%, ${hexToRgba(product.color, 0.04)} 50%, ${hexToRgba(product.color, 0.18)} 100%)`,
    [product.color],
  );
  const glowGradient = useMemo(
    () =>
      `radial-gradient(circle at 50% 60%, ${hexToRgba(product.color, 0.35)} 0%, transparent 65%)`,
    [product.color],
  );
  const baseDelay = index * 0.05;
  const berryColor = 'hsl(var(--ocheto-berry-600))';
  const goldColor = 'hsl(var(--ocheto-gold-500))';

  const data: ProductCardData = {
    product,
    tags,
    notes,
    baseDelay,
    softGradient,
    glowGradient,
    berryColor,
    goldColor,
    isFavorite,
    favoriteBusy,
    justAdded,
    cartItem,
    showAddToCart,
    buyMode: mode === 'whatsapp',
    cardRef,
    rotateX,
    rotateY,
    handleCardClick,
    handleAddToCart,
    handleBuyWhatsApp,
    handleToggleFavorite,
    handleMouseMove,
    handleMouseLeave,
    updateQuantity,
  };

  if (variant === 'compact') return <CompactVariant d={data} />;
  if (variant === 'featured') return <FeaturedVariant d={data} />;
  return <GridVariant d={data} />;
}

export const ProductCard = memo(ProductCardInner);

export default ProductCard;
