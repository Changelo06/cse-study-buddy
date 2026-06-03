import { ReactNode } from 'react';
import { Navigate, useLocation } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

/**
 * Wraps protected routes. Redirects to /login if user is not authenticated.
 * If `requireAdmin` is true, also checks for admin privileges.
 * 
 * When Supabase is not configured (mock-data mode), the guard is bypassed
 * to allow development without credentials.
 */
export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isAdmin, isLoading } = useAuth();

  // In mock-data mode, bypass auth entirely
  if (!isSupabaseConfigured()) {
    return <>{children}</>;
  }

  // Show nothing while loading auth state (prevents flash)
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-ink/20 border-t-brand-blue" />
          <p className="font-display text-lg font-bold text-brand-ink/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Not admin but admin required → redirect to home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
