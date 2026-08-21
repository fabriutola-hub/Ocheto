import { useSyncExternalStore } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  link?: string;
}

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function push(type: ToastType, message: string, link?: string) {
  const id = nextId++;
  toasts = [...toasts, { id, type, message, link }];
  emit();
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const toast = {
  success: (message: string) => push('success', message),
  error: (message: string) => push('error', message),
  info: (message: string, link?: string) => push('info', message, link),
  dismiss,
};

export function useToasts(): Toast[] {
  return useSyncExternalStore(subscribe, () => toasts);
}
