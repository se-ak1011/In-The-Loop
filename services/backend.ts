import { hasSupabaseConfig } from '../config';

export type BackendMode = 'mock' | 'supabase-ready';

export function getBackendMode(): BackendMode {
  return hasSupabaseConfig ? 'supabase-ready' : 'mock';
}

export function getBackendStatusMessage() {
  if (hasSupabaseConfig) {
    return 'Supabase environment variables detected. The app is ready for a Supabase client wiring pass.';
  }

  return 'Using bundled mock data. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY when you are ready to connect Supabase.';
}
