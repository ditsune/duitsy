'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { friendlyAuthMessage } from '@/lib/auth';
import Icon from '@/components/Icon';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const passwordHintId = useId();
  const errorId = useId();

  const supabase = createClient();

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (signUpError) {
      setError(friendlyAuthMessage(signUpError));
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main id="konten" className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col justify-center px-5 py-10">
        <h1 className="font-hand text-[46px] leading-none text-ink">Tinggal satu langkah</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          Akun untuk <span className="font-medium text-ink">{email}</span> sudah dibuat. Buka email
          konfirmasinya, lalu masuk.
        </p>
        <Link href="/login" className="btn-primary mt-6 w-full">
          Ke halaman masuk
        </Link>
      </main>
    );
  }

  return (
    <main id="konten" className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col justify-center px-5 py-10">
      <h1 className="font-hand text-[46px] leading-none text-ink">Buat akun</h1>
      <p className="mt-2 text-sm text-ink-2">Catatanmu disimpan per akun, jadi hanya kamu yang bisa lihat.</p>

      <form onSubmit={handleSignup} className="mt-8 flex flex-col gap-4" noValidate>
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
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="field"
            placeholder="Minimal 6 karakter"
            aria-describedby={passwordHintId}
          />
          <p id={passwordHintId} className="mt-1.5 text-[11px] text-ink-3">
            Minimal 6 karakter.
          </p>
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="flex items-start gap-2 rounded-card border px-3 py-2.5 text-xs leading-relaxed text-ink"
            style={{ borderColor: 'var(--neg)', background: 'var(--neg-soft)' }}
          >
            <Icon name="alert" size={15} className="mt-0.5 shrink-0 text-neg" />
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-1 w-full disabled:bg-paper-3 disabled:text-ink-3">
          {loading ? 'Membuat akun...' : 'Buat akun'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink-3">
        Sudah punya akun?{' '}
        <Link
          href="/login"
          className="font-medium text-accent underline underline-offset-2 hover:text-[#8bbaff]"
        >
          Masuk
        </Link>
      </p>
    </main>
  );
}
