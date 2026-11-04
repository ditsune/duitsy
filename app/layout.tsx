import type { Metadata, Viewport } from 'next';
import { Caveat, Poppins } from 'next/font/google';
import './globals.css';

// Caveat: tulisan tangan untuk angka dan judul, ini suara utama "buku catatan".
// Poppins: teks isi, geometris dan netral supaya angka tidak bersaing dengan tulisan tangan.
const caveat = Caveat({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-caveat' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: {
    default: 'Duitsy, Catatan Keuangan',
    template: '%s · Duitsy',
  },
  description: 'Catatan pengeluaran dan pemasukan pribadi.',
  applicationName: 'Duitsy',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Duitsy',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0e14',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${caveat.variable} ${poppins.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-field focus:bg-paper-2 focus:px-3 focus:py-2 focus:text-sm focus:text-ink focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-focus"
        >
          Lompat ke konten
        </a>
        {children}
      </body>
    </html>
  );
}
