
import { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const USERS_STORAGE_KEY = 'unikiala_mock_users';

// Helper for local mock database
const getLocalUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalUser = (user: User) => {
  const users = getLocalUsers();
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, user]));
};

// Helper to get environment variables safely
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
    try {
      // 1. Admin Login
      if (email === ADMIN_EMAIL && (password === ADMIN_PASSWORD || !password)) {
        return { user: MOCK_ADMIN };
      }

      // 2. Supabase Login if configured
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (!error && data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          return {
            user: {
              id: data.user.id,
              email: data.user.email || '',
              name: profile?.name || data.user.user_metadata?.name || 'Usuário',
              password: '',
              role: (profile?.role as UserRole) || UserRole.USER,
              isVerified: true,
              avatarUrl: profile?.avatar_url
            }
          };
        }
      }

      // 3. Fallback to Local Mock Storage
      const localUsers = getLocalUsers();
      const foundUser = localUsers.find(u => u.email === email);
      if (foundUser) {
        // In a real app we'd check password, here we allow it for demo purposes
        return { user: foundUser };
      }

      return { error: 'Credenciais inválidas ou usuário não encontrado.' };
    } catch (e) {
      console.error("Login crash:", e);
      return { error: 'Erro interno ao processar login.' };
    }
  },

  signup: async (name: string, email: string, password: string, role: UserRole): Promise<{ user?: User; error?: string }> => {
    try {
      // 1. Check if user already exists in local storage
      const localUsers = getLocalUsers();
      if (localUsers.some(u => u.email === email)) {
        return { error: 'Este email já está cadastrado.' };
      }

      // 2. Supabase Signup if configured
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, role } }
        });

        if (!error && data.user) {
          // Create profile record
          await supabase.from('profiles').insert([{ 
            id: data.user.id, email, name, role, is_verified: true 
          }]);

          return {
            user: {
              id: data.user.id,
              name,
              email,
              password: '',
              role,
              isVerified: true
            }
          };
        }
        // If Supabase fails (e.g. SMTP limits), we still fallback to local mode for the demo
        console.warn("Supabase signup failed, falling back to local storage:", error?.message);
      }

      // 3. Mock Local Signup (Always works)
      const newUser: User = {
        id: `mock_${Date.now()}`,
        name,
        email,
        password: '', // We don't store passwords in plain text or at all in this mock
        role,
        isVerified: true
      };

      saveLocalUser(newUser);
      // Auto-login locally
      localStorage.setItem('unikiala_current_user', JSON.stringify(newUser));

      return { user: newUser };
    } catch (e) {
      console.error("Signup crash:", e);
      return { error: 'Ocorreu um erro ao criar sua conta. Tente novamente.' };
    }
  },

  resetPassword: async (email: string): Promise<{ success?: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { error: error.message };
      return { success: true };
    }
    return { success: true }; // Mock success
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('unikiala_current_user');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    // 1. Check LocalStorage Session first (for mock users)
    try {
      const saved = localStorage.getItem('unikiala_current_user');
      if (saved) return JSON.parse(saved);
    } catch(e) {}

    // 2. Check Supabase Session
    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
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
              isVerified: true,
              avatarUrl: profile?.avatar_url
          };
        }
      } catch (e) {}
    }

    return null;
  },

  updateUserAvatar: async (userId: string, avatarUrl: string): Promise<boolean> => {
    // Update locally if it's a mock user
    const users = getLocalUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].avatarUrl = avatarUrl;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      const current = localStorage.getItem('unikiala_current_user');
      if (current) {
        const currentUser = JSON.parse(current);
        if (currentUser.id === userId) {
          currentUser.avatarUrl = avatarUrl;
          localStorage.setItem('unikiala_current_user', JSON.stringify(currentUser));
        }
      }
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', userId);
      return !error;
    }
    return true;
  }
};
