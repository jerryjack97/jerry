import { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Helper para ler variáveis de ambiente
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

// Credenciais de Admin (Vercel Env Vars ou Padrão)
const ADMIN_EMAIL = getEnv('VITE_ADMIN_EMAIL') || 'admin@unikiala.com';
const ADMIN_PASSWORD = getEnv('VITE_ADMIN_PASSWORD') || 'admin123';

const MOCK_ADMIN: User = {
  id: 'mock-admin',
  email: ADMIN_EMAIL,
  name: 'Administrador',
  password: '',
  role: UserRole.ADMIN,
  isVerified: true
};

export const authService = {
  login: async (email: string, password: string): Promise<{ user?: User; error?: string }> => {
    // 1. Verificação de Admin Prioritária (Funciona sem Banco de Dados)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return { user: MOCK_ADMIN };
    }

    // 2. Verificação de Configuração do Banco
    if (!isSupabaseConfigured) {
      return { error: 'Banco de dados não configurado. Aguardando conexão.' };
    }

    // 3. Login Normal via Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: 'Email ou senha incorretos.' };
    }

    if (data.user) {
      // Buscar perfil adicional
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile?.name || data.user.user_metadata?.name || 'Usuário',
        password: '', // Não guardamos senha
        role: (profile?.role as UserRole) || UserRole.USER,
        isVerified: true 
      };
      return { user };
    }
    return { error: 'Erro desconhecido ao logar.' };
  },

  signup: async (name: string, email: string, password: string, role: UserRole): Promise<{ user?: User; code?: string; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { error: 'Configuração de banco de dados pendente na Vercel.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id, 
            email, 
            name, 
            role, 
            is_verified: false 
          }
        ]);

      if (profileError) console.error("Erro ao criar perfil:", profileError);

      const newUser: User = {
        id: data.user.id,
        name,
        email,
        password: '',
        role,
        isVerified: false
      };
      
      return { user: newUser, code: 'CHECK_EMAIL' };
    }

    return { error: 'Erro ao criar conta.' };
  },

  verifyUser: async (email: string, code: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'DB Missing' };
    }
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup'
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
       const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

       await supabase.from('profiles').update({ is_verified: true }).eq('id', data.user.id);

       const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile?.name || 'Usuário',
        password: '',
        role: (profile?.role as UserRole) || UserRole.USER,
        isVerified: true
      };

      return { success: true, user };
    }

    return { success: false, error: 'Falha na verificação.' };
  },

  logout: async (): Promise<void> => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    // Se não houver DB, não há sessão persistida (exceto se implementarmos mock local, mas vamos manter simples)
    if (!isSupabaseConfigured) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    return {
        id: session.user.id,
        email: session.user.email || '',
        name: profile?.name || session.user.user_metadata.name || 'Usuário',
        password: '',
        role: (profile?.role as UserRole) || UserRole.USER,
        isVerified: true
    };
  }
};