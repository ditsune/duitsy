'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

const ITEMS = [
  { href: '/dashboard', icon: 'home', label: 'Beranda' },
  { href: '/dashboard/wawasan', icon: 'chart-donut', label: 'Wawasan' },
  { href: '/dashboard/transaksi', icon: 'list', label: 'Transaksi' },
  { href: '/dashboard/akun', icon: 'building-bank', label: 'Wallet' },
];

export default function BottomNav({ onAdd }: { onAdd: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex w-full max-w-app items-center justify-around border-t border-line bg-paper px-2 pb-[calc(8px+env(safe-area-inset-bottom))] pt-1.5"
    >
      {ITEMS.map((item, index) => {
        const active = pathname === item.href;
        const link = (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-[52px] w-[68px] flex-col items-center justify-center gap-1 rounded-field text-[11px] font-medium transition-colors duration-150 ${active ? 'text-accent' : 'text-ink-3 hover:text-ink-2'
              }`}
          >
            <Icon name={item.icon} size={21} />
            <span>{item.label}</span>
            <span
              aria-hidden="true"
              className={`h-1 w-1 rounded-full ${active ? 'bg-accent' : 'bg-transparent'}`}
            />
          </Link>
        );

        if (index === 1) {
          return (
            <div key="fab-slot" className="contents">
              {link}
              <button
                type="button"
                onClick={onAdd}
                aria-label="Catat transaksi baru"
                className="tap -mt-7 flex h-14 w-14 items-center justify-center rounded-full border-4 border-paper bg-accent text-accent-ink shadow-lg transition-colors duration-150 hover:bg-[#8bbaff] active:bg-[#5a99ee]"
              >
                <Icon name="plus" size={24} strokeWidth={2.2} />
              </button>
            </div>
          );
        }

        return link;
      })}
    </nav>
  );
}
