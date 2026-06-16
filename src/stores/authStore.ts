import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types/user';
import { supabase } from '../lib/supabase';
import type { AuthError, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  error: string | null;
  
  // Actions
  initializeAuth: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  setError: (error: string | null) => void;
  
  // Legacy actions (for backward compatibility)
  login: (user: User) => void;
  logout: () => void;
}

// Helper to convert Supabase user to our User type
const convertSupabaseUser = async (session: Session | null): Promise<User | null> => {
  if (!session?.user) return null;

  // Get user profile from our users table
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    console.error('Error fetching user profile:', error);
    throw new Error(error?.message || 'Gagal memuat profil pengguna dari database. Pastikan tabel users sudah dibuat.');
  }

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role as 'student' | 'lecturer',
    identifier: profile.identifier,
    avatarUrl: profile.avatar_url,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,
      error: null,

      initializeAuth: async () => {
        set({ isLoading: true, error: null });
        
        // Cek error dari URL callback OAuth (misalnya karena ditolak oleh Trigger)
        if (window.location.hash.includes('error=')) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const errorDesc = hashParams.get('error_description');
          if (errorDesc) {
            set({ 
              error: decodeURIComponent(errorDesc).replace(/\+/g, ' '), 
              isLoading: false 
            });
            // Bersihkan URL agar pesan error tidak muncul terus saat di-refresh
            window.history.replaceState(null, '', window.location.pathname);
            return;
          }
        }

        try {
          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;

          if (session) {
            const user = await convertSupabaseUser(session);
            set({ user, isAuthenticated: !!user, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event);
            
            try {
              if (event === 'SIGNED_IN' && session) {
                const user = await convertSupabaseUser(session);
                set({ user, isAuthenticated: !!user, isLoading: false, error: null });
              } else if (event === 'SIGNED_OUT') {
                set({ user: null, isAuthenticated: false, isLoading: false, error: null });
              }
            } catch (err) {
              console.error('Error in onAuthStateChange:', err);
              set({ 
                error: err instanceof Error ? err.message : 'Failed to process authentication state',
                isLoading: false 
              });
            }
          });
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to initialize auth',
            isLoading: false 
          });
        }
      },

      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin,
              queryParams: {
                access_type: 'offline',
                prompt: 'select_account',
                hd: 'teknokrat.ac.id',
              },
            },
          });

          if (error) throw error;
        } catch (error) {
          console.error('Error signing in with Google:', error);
          set({ 
            error: error instanceof AuthError ? error.message : 'Failed to sign in with Google',
            isLoading: false 
          });
        }
      },

      signInWithPassword: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          const user = await convertSupabaseUser(data.session);
          set({ user, isAuthenticated: !!user, isLoading: false });
        } catch (error) {
          console.error('Error signing in with password:', error);
          set({ 
            error: error instanceof AuthError ? error.message : 'Failed to sign in',
            isLoading: false 
          });
        }
      },

      signOut: async () => {
        // Segera reset state lokal agar UI langsung pindah halaman tanpa menunggu Supabase
        set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        
        try {
          // Fire and forget
          supabase.auth.signOut().catch(console.error);
        } catch (error) {
          console.error('Error signing out:', error);
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setHasHydrated: (hydrated) => {
        set({ hasHydrated: hydrated });
      },

      setError: (error) => {
        set({ error });
      },

      // Legacy actions for backward compatibility
      login: (user) => {
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        // Initialize auth after rehydration
        state?.initializeAuth();
      },
    }
  )
);
