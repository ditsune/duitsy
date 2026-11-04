import { createClient } from '@/lib/supabase/client';

/**
 * Satu tempat untuk urusan sesi yang rusak. Sebelumnya logika ini tersebar
 * di middleware, halaman login, shell dashboard, dan satu API route, dan
 * masing-masing menanganinya dengan cara berbeda.
 */

type MaybeError = {
  message?: string;
  status?: number;
  code?: string;
};

export function isAuthError(error: unknown): boolean {
  const e = (error ?? {}) as MaybeError;
  const message = (e.message ?? '').toLowerCase();
  return message.includes('jwt') || message.includes('token') || e.status === 401 || e.code === 'PGRST301';
}

/** Coba satu kali refresh. true berarti sesi baru siap dipakai. */
export async function refreshSessionOnce(): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.refreshSession();
  return !error && Boolean(data.session);
}

export async function signOutAndGoToLogin(): Promise<void> {
  const supabase = createClient();
  try {
    await supabase.auth.signOut();
  } catch {
    // Kalau sign out gagal, cookie tetap dibersihkan middleware saat redirect.
  }
  window.location.assign('/login');
}

export function friendlyAuthMessage(error: unknown): string {
  if (isAuthError(error)) {
    return 'Sesi lama tidak valid. Coba masuk lagi ya.';
  }

  const e = (error ?? {}) as MaybeError;
  const message = e.message || '';

  // --- MAPPING PESAN ERROR SUPABASE KE BAHASA MANUSIA ---

  // 1. Salah email / password (Supabase gabungin jadi 1 pesan demi keamanan)
  if (message.includes('Invalid login credentials')) {
    return 'Email atau password salah. Mohon periksa kembali.';
  }

  // 2. Email belum dikonfirmasi
  if (message.includes('Email not confirmed')) {
    return 'Email kamu belum dikonfirmasi. Cek kotak masuk email ya.';
  }

  // 3. Email udah kedaftar (biasanya pas di halaman Signup)
  if (message.includes('User already registered')) {
    return 'Email ini sudah terdaftar. Silakan masuk.';
  }

  // 4. Password terlalu pendek (kalau validasi dari Supabase yang ke-trigger)
  if (message.includes('Password should be at least 6 characters')) {
    return 'Kata sandi minimal 6 karakter.';
  }

  // 5. Rate limit (kebanyakan spam login/daftar)
  if (message.includes('For security purposes, you can only request this after')) {
    return 'Terlalu banyak percobaan. Tunggu beberapa saat lagi ya.';
  }

  // 6. Kalau error nggak dikenali, tampilin pesan aslinya (bahasa Inggris) atau fallback
  return message || 'Gagal memproses permintaan. Coba lagi.';
}