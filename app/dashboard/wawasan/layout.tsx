import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Wawasan' };

export default function WawasanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
