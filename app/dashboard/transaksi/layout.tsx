import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Transaksi' };

export default function TransaksiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
