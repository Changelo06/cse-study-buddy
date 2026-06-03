import { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // If already logged in, redirect to dashboard
  if (user) {
    navigate({ to: '/' });
    return null;
  }

  if (!isSupabaseConfigured()) {
    return (
      <main className="container-page flex min-h-[80vh] items-center justify-center py-12">
        <div className="mx-auto max-w-md rounded-[2rem] bg-white/90 p-10 text-center shadow-sticker">
          <h1 className="font-display text-4xl font-black text-brand-ink">Auth Not Configured</h1>
          <p className="mt-4 text-lg font-medium text-brand-ink/70">
            Supabase credentials are not set. The app is running in mock-data mode.
          </p>
          <p className="mt-2 text-sm font-medium text-brand-ink/50">
            Set <code className="rounded bg-brand-ink/5 px-2 py-1 font-mono text-xs">VITE_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-brand-ink/5 px-2 py-1 font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> in your{' '}
            <code className="rounded bg-brand-ink/5 px-2 py-1 font-mono text-xs">.env.local</code> file.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-2xl bg-brand-blue px-8 py-4 font-bold text-white shadow-[4px_4px_0_rgba(45,45,45,0.12)] transition-transform hover:-translate-y-0.5"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate({ to: '/' });
      } else {
        await signUp(email, password, fullName);
        setSuccessMessage('Account created! Check your email to confirm your account.');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
    }
  };

  return (
    <main className="container-page flex min-h-[80vh] items-center justify-center py-12">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-display text-5xl font-black text-brand-ink">
              CSE <span className="text-brand-blue">Ready</span>
            </h1>
          </Link>
          <p className="mt-2 text-lg font-medium text-brand-ink/60">
            {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[2rem] bg-white/90 p-8 shadow-sticker md:p-10">
          {/* Success message */}
          {successMessage && (
            <div className="mb-6 rounded-xl bg-brand-teal/10 border-2 border-brand-teal/30 p-4 text-sm font-bold text-brand-teal">
              {successMessage}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl bg-brand-pink/10 border-2 border-brand-pink/30 p-4 text-sm font-bold text-brand-pink">
              {error}
            </div>
          )}

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-brand-ink/12 bg-white px-6 py-4 font-bold text-brand-ink shadow-[2px_2px_0_rgba(45,45,45,0.08)] transition-all hover:-translate-y-0.5 hover:border-brand-ink/25 hover:shadow-[3px_3px_0_rgba(45,45,45,0.12)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-brand-ink/12" />
            <span className="text-sm font-bold text-brand-ink/40">or</span>
            <div className="h-px flex-1 bg-brand-ink/12" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div>
                <label className="mb-1.5 block text-sm font-bold text-brand-ink/70">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="h-13 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 text-base font-medium text-brand-ink shadow-[inset_0_2px_0_rgba(45,45,45,0.04)] outline-none transition focus:border-brand-purple"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-bold text-brand-ink/70">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-13 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 text-base font-medium text-brand-ink shadow-[inset_0_2px_0_rgba(45,45,45,0.04)] outline-none transition focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-brand-ink/70">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-13 w-full rounded-xl border-2 border-brand-ink/12 bg-[#fff8df] px-4 text-base font-medium text-brand-ink shadow-[inset_0_2px_0_rgba(45,45,45,0.04)] outline-none transition focus:border-brand-purple"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-2xl bg-brand-blue px-8 py-4 text-lg font-bold text-white shadow-[4px_4px_0_rgba(45,45,45,0.12)] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="mt-6 text-center text-sm font-medium text-brand-ink/60">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); setSuccessMessage(''); }}
                  className="font-bold text-brand-blue hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
                  className="font-bold text-brand-blue hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs font-medium text-brand-ink/40">
          CSE Ready is not affiliated with the Philippine Civil Service Commission.
        </p>
      </div>
    </main>
  );
}
