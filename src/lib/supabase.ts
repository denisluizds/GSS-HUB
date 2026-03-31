import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Get the Supabase client instance.
 * This function is robust and handles various environment variable names and formats.
 */
export function getSupabase(): SupabaseClient {
  if (supabaseClient) return supabaseClient;

  // 1. Get raw values from environment (Vite style)
  // We check both VITE_ and NEXT_PUBLIC_ prefixes
  // We also provide the URL you specified as a hardcoded fallback to ensure it works
  const rawUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dctqsklarlbndxtxhlez.supabase.co';
  const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
  
  // 2. Clean values (remove quotes, spaces)
  const cleanVal1 = rawUrl.trim().replace(/^["']|["']$/g, '');
  const cleanVal2 = rawKey.trim().replace(/^["']|["']$/g, '');

  if (!cleanVal1 && !cleanVal2) {
    throw new Error('Configuração do Supabase ausente. Por favor, adicione as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nos Secrets.');
  }

  let supabaseUrl = '';
  let supabaseAnonKey = '';

  // 3. Identify which value is the URL and which is the Key
  // This helps if the user accidentally swapped them in the Secrets panel
  if (cleanVal1.startsWith('http')) {
    supabaseUrl = cleanVal1;
    supabaseAnonKey = cleanVal2;
  } else if (cleanVal2.startsWith('http')) {
    supabaseUrl = cleanVal2;
    supabaseAnonKey = cleanVal1;
  }

  // 4. Final validation before initialization
  if (!supabaseUrl) {
    throw new Error('URL do Supabase não encontrada. Certifique-se de que um dos valores nos Secrets começa com "https://".');
  }
  
  if (!supabaseAnonKey || supabaseAnonKey.startsWith('http')) {
    throw new Error('Chave (Key) do Supabase não encontrada ou inválida. Certifique-se de que a chave longa (começando com "eyJ" ou "sb_") está em um dos campos de Secret.');
  }

  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully.');
    return supabaseClient;
  } catch (error: any) {
    console.error('Failed to initialize Supabase client:', error);
    throw new Error(`Erro na inicialização do Supabase: ${error.message || 'Verifique a URL e a Chave.'}`);
  }
}
