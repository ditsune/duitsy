'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { friendlyAuthMessage } from '@/lib/auth';
import Icon from '@/components/Icon';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    // Jeda 500ms biar animasi loading-nya kelihatan
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      // PAKE FUNGSI FRIENDLY ERROR
      setError(friendlyAuthMessage(signInError));
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main id="konten" className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col justify-center px-5 py-10">
      <h1 className="font-hand text-[46px] leading-none text-ink">Duitsy</h1>
      <p className="mt-2 text-sm text-ink-2">Masuk buat lanjut catat keuanganmu.</p>

      <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor={emailId} className="label mb-1.5 block">
            Email
          </label>
          <input
            id={emailId}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field"
            placeholder="nama@email.com"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor={passwordId} className="label mb-1.5 block">
            Kata sandi
          </label>
          <input
            id={passwordId}
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="field"
            placeholder="Kata sandi"
            disabled={loading}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
        </div>

        {/* KOTAK ERROR YANG LEBIH STAND OUT */}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="flex items-start gap-2 rounded-card border px-3 py-2.5 text-xs leading-relaxed text-neg"
            style={{ borderColor: 'var(--neg)', background: 'var(--neg-soft)' }}
          >
            <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-1 w-full flex items-center justify-center gap-2 disabled:bg-paper-3 disabled:text-ink-3"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-ink-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </>
          ) : (
            'Masuk'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink-3">
        Belum punya akun?{' '}
        <Link
          href="/signup"
          className="font-medium text-accent underline underline-offset-2 hover:text-[#8bbaff]"
        >
          Buat akun
        </Link>
      </p>
    </main>
  );
}