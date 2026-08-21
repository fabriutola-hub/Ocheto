import type { MouseEvent } from 'react';
import type { MotionValue } from 'framer-motion';
import type { Product, CartItem } from '@/types';
import type { CardTag } from '@/features/products/tags';

export interface ProductCardData {
  product: Product;
  tags: CardTag[];
  notes: string[];
  baseDelay: number;
  softGradient: string;
  glowGradient: string;
  berryColor: string;
  goldColor: string;
  isFavorite: boolean;
  favoriteBusy: boolean;
  justAdded: boolean;
  cartItem: CartItem | undefined;
  showAddToCart: boolean;
  buyMode: boolean;
  cardRef: React.RefObject<HTMLDivElement | null>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  handleCardClick: () => void;
  handleAddToCart: (e: MouseEvent<HTMLElement>) => void;
  handleBuyWhatsApp: (e: MouseEvent<HTMLElement>) => void;
  handleToggleFavorite: (e: MouseEvent<HTMLElement>) => void;
  handleMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
  updateQuantity: (id: string, quantity: number) => void;
}
