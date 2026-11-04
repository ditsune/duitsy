import type { Metadata } from 'next';
import DashboardShell from '@/components/DashboardShell';

// Setiap muat ulang bulan harus selalu segar, tidak boleh di-cache.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Beranda',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
