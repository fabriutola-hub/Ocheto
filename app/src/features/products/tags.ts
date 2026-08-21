import type { LucideIcon } from 'lucide-react';
import { Flame, Coffee, Sparkles, Leaf } from 'lucide-react';
import type { Product } from '@/types';

type TagKey = 'bestseller' | 'new' | 'vegan';

export interface CardTag {
  key: TagKey;
  label: string;
  icon: LucideIcon;
  bg: string;
  text: string;
}

export interface FeaturedTag {
  label: string;
  icon: LucideIcon;
  color: string;
  text: string;
}

const CARD_TAGS: Record<TagKey, CardTag> = {
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

const FEATURED_TAGS: Record<TagKey, FeaturedTag> = {
  bestseller: {
    label: 'BESTSELLER',
    icon: Flame,
    color: '#E8B923',
    text: '#1a1a1a',
  },
  new: {
    label: 'NUEVO',
    icon: Sparkles,
    color: '#D4A574',
    text: '#1a1a1a',
  },
  vegan: {
    label: 'VEGANO',
    icon: Leaf,
    color: '#2E7D32',
    text: '#FAF7F0',
  },
};

const PRIORITY: TagKey[] = ['bestseller', 'new', 'vegan'];

export function getProductTags(product: Product): CardTag[] {
  const tags: CardTag[] = [];
  for (const key of PRIORITY) {
    if (product[key]) tags.push(CARD_TAGS[key]);
  }
  return tags;
}

export function getProductTag(product: Product): FeaturedTag | null {
  for (const key of PRIORITY) {
    if (product[key]) return FEATURED_TAGS[key];
  }
  return null;
}

export function getNoteList(product: Product): string[] {
  if (product.notes && product.notes.length > 0) return product.notes.slice(0, 3);
  if (product.tags && product.tags.length > 0) return product.tags.slice(0, 3);
  return [];
}
