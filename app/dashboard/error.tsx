'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import Icon from '@/components/Icon';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-card bg-paper-2 text-neg">
        <Icon name="alert" size={24} />
      </span>
      <h1 className="font-hand text-[34px] leading-none text-ink">Ada yang tersangkut</h1>
      <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-ink-2">
        Bagian ini gagal dimuat. Coba lagi dulu. Kalau tetap gagal, kirim kode laporan di bawah ke pembuat
        aplikasi.
      </p>
      {error.digest && (
        <p className="mt-2 text-[11px] tabular-nums text-ink-3">Kode laporan: {error.digest}</p>
      )}
      <button type="button" onClick={reset} className="btn-primary mt-5">
        Coba lagi
      </button>
    </div>
  );
}
