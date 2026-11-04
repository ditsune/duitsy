'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

/**
 * Error boundary paling luar. Root layout sudah tidak dipakai di sini, jadi
 * gaya ditulis inline dan tidak bergantung pada Tailwind yang mungkin gagal dimuat.
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="id">
      <head>
        <title>Ada yang tersangkut · Duitsy</title>
        <meta name="color-scheme" content="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '48px 24px',
          textAlign: 'center',
          background: '#0b0e14',
          color: '#eef2f8',
          fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: '#9aa7ba' }}>Duitsy</p>
        <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.2 }}>Ada yang tersangkut</h1>
        <p style={{ margin: 0, maxWidth: '34ch', fontSize: 14, lineHeight: 1.6, color: '#c6cfdc' }}>
          Aplikasi gagal dimuat. Coba muat ulang halaman ini.
          {error.digest ? ` Kode laporan: ${error.digest}.` : ''}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            marginTop: 12,
            minHeight: 44,
            padding: '12px 22px',
            border: 'none',
            borderRadius: 10,
            background: '#6aa9ff',
            color: '#0b0e14',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Muat ulang
        </button>
      </body>
    </html>
  );
}
