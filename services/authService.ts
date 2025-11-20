import { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Mock user para quando não houver DB conectado
const MOCK_ADMIN: User = {
  id: 'mock-admin',
  email: 'admin@unikiala.com',
  name: 'Admin Demo',
  password: '',
  role: UserRole.ADMIN,
  isVerified: true
};

export const authService = {
  login: async (email: string, password: string): Promise<{ user?: User; error?: string }> => {
    if (!isSupabaseConfigured) {
      if (email === 'admin@unikiala.com' && password === 'admin123') {
        return { user: MOCK_ADMIN };
      }
      return { error: 'Banco de dados não configurado. Use admin@unikiala.com / admin123 para testar.' };
    }

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