import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/types/supabase';

type AuthState = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAdmin: false,
  });

  // Fetch profile from Supabase
  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[useAuth] Error fetching profile:', error.message);
      return null;
    }
    return data as Profile;
  }, []);

  // Initialize auth state and subscribe to changes
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          session,
          isLoading: false,
          isAdmin: profile?.is_admin ?? false,
        });
      } else {
        setState({
          user: null,
          profile: null,
          session: null,
          isLoading: false,
          isAdmin: false,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          session,
          isLoading: false,
          isAdmin: profile?.is_admin ?? false,
        });
      } else {
        setState({
          user: null,
          profile: null,
          session: null,
          isLoading: false,
          isAdmin: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Auth actions
  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName || '' },
      },
    });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!supabase) throw new Error('Supabase is not configured');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
}
