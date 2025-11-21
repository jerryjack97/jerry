
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
      console.error("Erro Supabase Login:", error);
      
      // Tratamento para Email Não Confirmado (Erro 400 ou específico)
      if (error.message.includes("Email not confirmed") || error.message.includes("confirm")) {
        return { error: "Sua conta existe, mas o email não foi confirmado pelo Supabase. Vá no painel > Authentication > Providers > Email e desligue 'Confirm email' para corrigir." };
      }
      
      // Tratamento para Credenciais Inválidas
      if (error.message.includes("Invalid login credentials")) {
        return { error: "Email ou senha incorretos." };
      }
      
      return { error: `Erro ao entrar: ${error.message}` };
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

  signup: async (name: string, email: string, password: string, role: UserRole): Promise<{ user?: User; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { error: 'Configuração de banco de dados pendente na Vercel.' };
    }

    // Tentativa de cadastro
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

    // LÓGICA CORRIGIDA:
    // Se houver erro de SMTP (comum no plano free), mas o usuário foi criado (data.user existe), ignoramos o erro.
    if (error && !data.user) {
      if (error.message.includes("sending confirmation email") || error.message.includes("confirmation")) {
         return { error: "Erro técnico no envio de email. Desative a confirmação de email no painel do Supabase para evitar isso." };
      }
      return { error: error.message };
    }

    if (data.user) {
      // Criação do perfil na tabela 'profiles'
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id, 
            email, 
            name, 
            role, 
            is_verified: true 
          }
        ]);

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
      }

      // Tentativa de Autenticação Automática Pós-Cadastro
      // Se o signUp não retornou sessão (data.session null), tentamos fazer login manual agora.
      // Isso ajuda a persistir a sessão se o 'Confirm Email' estiver desligado mas o signUp não logou auto.
      if (!data.session) {
        await supabase.auth.signInWithPassword({ email, password });
      }

      const newUser: User = {
        id: data.user.id,
        name,
        email,
        password: '',
        role,
        isVerified: true
      };
      
      return { user: newUser };
    }

    // Caso raro onde user é null mas não deu erro explícito
    if (!data.user && !error) {
       return { error: "Conta criada, mas aguardando confirmação do Supabase. Tente fazer login." };
    }

    return { error: 'Erro ao criar conta.' };
  },

  resetPassword: async (email: string): Promise<{ success?: boolean; error?: string }> => {
    // Simulação para Admin (Bypass)
    if (email === ADMIN_EMAIL) {
      return { success: true };
    }

    if (!isSupabaseConfigured) {
      return { error: 'Banco de dados offline. Não é possível enviar email.' };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      if (error.message.includes("SMTP") || error.message.includes("sending") || error.status === 429) {
          return { error: "Não foi possível enviar o email (Limite do Supabase ou Erro SMTP). Tente novamente mais tarde." };
      }
      return { error: error.message };
    }

    return { success: true };
  },

  verifyUser: async (email: string, code: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    return { success: true };
  },

  logout: async (): Promise<void> => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (!isSupabaseConfigured) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      if (session.user.email === ADMIN_EMAIL) return MOCK_ADMIN;

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
    } catch (e) {
      return null;
    }
  }
};
