import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Akun' };

export default function AkunLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
