import { useSyncExternalStore } from 'react';
import type { CartItem } from '@/types';

type Listener = () => void;

let items: CartItem[] = [];
let isOpen = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ===== Actions (identidad estable a nivel módulo) =====
function addItem(item: CartItem) {
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    items = items.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
    );
  } else {
    items = [...items, item];
  }
  isOpen = true;
  emit();
}

function removeItem(id: string) {
  items = items.filter((i) => i.id !== id);
  emit();
}

function updateQuantity(id: string, quantity: number) {
  if (quantity <= 0) {
    items = items.filter((i) => i.id !== id);
  } else {
    items = items.map((i) => (i.id === id ? { ...i, quantity } : i));
  }
  emit();
}

function clearCart() {
  items = [];
  emit();
}

function setIsOpen(open: boolean) {
  isOpen = open;
  emit();
}

const cartActions = {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  setIsOpen,
};

export function useCartActions() {
  return cartActions;
}

// ===== Selectores =====
export function useCartItems(): CartItem[] {
  return useSyncExternalStore(subscribe, () => items);
}

export function useCartItem(id: string): CartItem | undefined {
  return useSyncExternalStore(subscribe, () => items.find((i) => i.id === id));
}

export function useCartIsOpen(): boolean {
  return useSyncExternalStore(subscribe, () => isOpen);
}

let cachedItems: CartItem[] = [];
let cachedTotals: { totalItems: number; totalPrice: number } = {
  totalItems: 0,
  totalPrice: 0,
};

function getTotals() {
  if (items === cachedItems) return cachedTotals;
  cachedItems = items;
  cachedTotals = {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
  return cachedTotals;
}

export function useCartTotals() {
  return useSyncExternalStore(subscribe, getTotals);
}
