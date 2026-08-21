import { useSyncExternalStore } from 'react';
import { supabase } from '@/lib/supabase';

type Listener = () => void;

let favoriteIds = new Set<string>();
let loaded = false;
let loadPromise: Promise<void> | null = null;
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

let cachedSnapshot = { ids: favoriteIds, loaded };

function getSnapshot() {
  if (cachedSnapshot.ids !== favoriteIds || cachedSnapshot.loaded !== loaded) {
    cachedSnapshot = { ids: favoriteIds, loaded };
  }
  return cachedSnapshot;
}

async function loadFavorites(): Promise<void> {
  if (loaded || loadPromise) return loadPromise ?? Promise.resolve();
  loadPromise = (async () => {
    const { data, error } = await supabase.from('favorites').select('product_id');
    if (!error && data) {
      favoriteIds = new Set(data.map((f) => f.product_id));
    }
    loaded = true;
    loadPromise = null;
    emit();
  })();
  return loadPromise;
}

function reset() {
  favoriteIds = new Set();
  loaded = false;
  loadPromise = null;
  emit();
}

/** Añade un favorito y devuelve true si se insertó. */
async function addFavorite(productId: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase
    .from('favorites')
    .insert({ product_id: productId, user_id: user.id });
  if (error) return false;
  favoriteIds = new Set([...favoriteIds, productId]);
  emit();
  return true;
}

/** Elimina un favorito y devuelve true si se borró. */
async function removeFavorite(productId: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('product_id', productId)
    .eq('user_id', user.id);
  if (error) return false;
  const next = new Set(favoriteIds);
  next.delete(productId);
  favoriteIds = next;
  emit();
  return true;
}

async function toggleFavorite(productId: string): Promise<boolean> {
  return favoriteIds.has(productId)
    ? removeFavorite(productId)
    : addFavorite(productId);
}

export function useFavoriteIds() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export const favoritesStore = {
  load: loadFavorites,
  reset,
  toggle: toggleFavorite,
  has: (productId: string) => favoriteIds.has(productId),
};
