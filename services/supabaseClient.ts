import { createClient } from '@supabase/supabase-js';

// Tenta obter as variáveis de ambiente de diferentes fontes (Vite ou Process)
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Key is missing. Database features will not work.');
}

// Fallback para previnir crash, mas services devem checar isSupabaseConfigured
const urlToUse = supabaseUrl || 'https://placeholder.supabase.co';
const keyToUse = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(urlToUse, keyToUse);