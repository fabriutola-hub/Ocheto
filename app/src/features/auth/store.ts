import { useSyncExternalStore } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { ProfileRow } from '@/features/products/types';
import { favoritesStore } from '@/features/favorites/store';

type Listener = () => void;

let session: Session | null = null;
let profile: ProfileRow | null = null;
let loading = true;
let profileLoading = false;
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

let started = false;

async function refreshProfile() {
  const currentSession = session;
  if (!currentSession) {
    profile = null;
    profileLoading = false;
    return;
  }
  profileLoading = true;
  emit();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentSession.user.id)
    .maybeSingle();
  profile = error ? null : ((data as ProfileRow | null) ?? null);
  profileLoading = false;
  emit();
}

/** Inicializa el listener de auth una sola vez. */
function ensureStarted() {
  if (started) return;
  started = true;
  supabase.auth.getSession().then(({ data }) => {
    session = data.session;
    loading = false;
    emit();
    if (session) {
      void refreshProfile();
      void favoritesStore.load();
    }
  });
  supabase.auth.onAuthStateChange((_event, newSession) => {
    session = newSession;
    if (newSession) {
      void refreshProfile();
      void favoritesStore.load();
    } else {
      profile = null;
      favoritesStore.reset();
    }
    emit();
  });
}

export interface AuthState {
  session: Session | null;
  profile: ProfileRow | null;
  loading: boolean;
  profileLoading: boolean;
}

let cachedSnapshot: AuthState = { session: null, profile: null, loading: true, profileLoading: false };

function getSnapshot(): AuthState {
  ensureStarted();
  const next: AuthState = { session, profile, loading, profileLoading };
  if (
    next.session !== cachedSnapshot.session ||
    next.profile !== cachedSnapshot.profile ||
    next.loading !== cachedSnapshot.loading ||
    next.profileLoading !== cachedSnapshot.profileLoading
  ) {
    cachedSnapshot = next;
  }
  return cachedSnapshot;
}

export function useAuth(): AuthState {
  return useSyncExternalStore(subscribe, getSnapshot, () => ({
    session: null,
    profile: null,
    loading: true,
    profileLoading: false,
  }));
}

export const authStore = {
  get session() {
    return session;
  },
  get profile() {
    return profile;
  },
  refreshProfile,
  isAdmin: () => profile?.role === 'admin',
};
