import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get credentials from environment or localStorage
export function getSupabaseCredentials(): { url: string; key: string } {
  const localUrl = localStorage.getItem('gig_connect_supabase_url');
  const localKey = localStorage.getItem('gig_connect_supabase_key');

  const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: localUrl || envUrl || '',
    key: localKey || envKey || '',
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
}

export function isSupabaseConnected(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http'));
}

export function saveSupabaseCredentials(url: string, key: string): boolean {
  try {
    localStorage.setItem('gig_connect_supabase_url', url.trim());
    localStorage.setItem('gig_connect_supabase_key', key.trim());
    supabaseInstance = null; // reset to force re-instantiation
    return true;
  } catch {
    return false;
  }
}

export function clearSupabaseCredentials(): void {
  localStorage.removeItem('gig_connect_supabase_url');
  localStorage.removeItem('gig_connect_supabase_key');
  supabaseInstance = null;
}
