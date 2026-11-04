import type { ReactNode } from 'react';

const GLYPHS: Record<string, ReactNode> = {
  home: (
    <>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10.2V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.8" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  'chart-donut': (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  'chart-pie': (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 4.5V12h7.5" />
    </>
  ),
  'chart-line': (
    <>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7 15.5l3.5-4.5 3 2.5L20 7" />
    </>
  ),
  list: (
    <>
      <path d="M9 7h10M9 12h10M9 17h10" />
      <path d="M5 7h.01M5 12h.01M5 17h.01" strokeWidth="2.6" />
    </>
  ),
  'building-bank': (
    <>
      <path d="M4 9.5 12 4l8 5.5" />
      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
      <path d="M3.5 19h17" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  'chevron-left': <path d="M14.5 6.5 9 12l5.5 5.5" />,
  'chevron-right': <path d="M9.5 6.5 15 12l-5.5 5.5" />,
  'chevron-down': <path d="M6.5 9.5 12 15l5.5-5.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.6 15.6 20 20" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V5.2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7" />
      <path d="M6.8 7l.8 11a1 1 0 0 0 1 1h6.8a1 1 0 0 0 1-1l.8-11" />
      <path d="M10.5 10.5v5M13.5 10.5v5" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M4 10h16M9 4v3M15 4v3" />
    </>
  ),
  'shopping-cart': (
    <>
      <path d="M4 5h2l2.2 9.2a1 1 0 0 0 1 .8h7.4a1 1 0 0 0 1-.8L19 8H6.2" />
      <circle cx="9.5" cy="19" r="1.3" />
      <circle cx="16.5" cy="19" r="1.3" />
    </>
  ),
  cash: (
    <>
      <rect x="3" y="6.5" width="18" height="11" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6.5 10v4M17.5 10v4" />
    </>
  ),
  'credit-card': (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M6.5 14.5h3" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18a2 2 0 0 1 2 2v.5" />
      <rect x="4" y="8.5" width="16" height="10" rx="2.5" />
      <path d="M16 13.5h4" />
      <circle cx="15.8" cy="13.5" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  tag: (
    <>
      <path d="M4 12.2V5.5A1.5 1.5 0 0 1 5.5 4h6.7a1.5 1.5 0 0 1 1 .4l6 6a1.5 1.5 0 0 1 0 2.1l-5.2 5.2a1.5 1.5 0 0 1-2.1 0l-6-6a1.5 1.5 0 0 1-.4-1z" />
      <circle cx="8.3" cy="8.3" r="1.3" />
    </>
  ),
  heart: <path d="M12 19.5s-6.5-4-6.5-8.4A3.9 3.9 0 0 1 12 8.3a3.9 3.9 0 0 1 6.5 2.8c0 4.4-6.5 8.4-6.5 8.4z" />,
  gift: (
    <>
      <rect x="4" y="9" width="16" height="10.5" rx="1.5" />
      <path d="M4 13h16M12 9v10.5" />
      <path d="M12 9S10.5 5 8.5 5a2 2 0 0 0 0 4M12 9s1.5-4 3.5-4a2 2 0 0 1 0 4" />
    </>
  ),
  car: (
    <>
      <path d="M4 16v-2.6a2 2 0 0 1 .3-1l2.2-3.6a2 2 0 0 1 1.7-1h7.6a2 2 0 0 1 1.7 1l2.2 3.6a2 2 0 0 1 .3 1V16" />
      <path d="M4 16h16" />
      <circle cx="8" cy="16.8" r="1.5" />
      <circle cx="16" cy="16.8" r="1.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="7.5" width="17" height="11.5" rx="2" />
      <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5" />
      <path d="M3.5 12.5h17" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5A1.5 1.5 0 0 1 20 20.5z" />
    </>
  ),
  paw: (
    <>
      <circle cx="7" cy="8" r="1.7" />
      <circle cx="12" cy="6" r="1.7" />
      <circle cx="17" cy="8" r="1.7" />
      <path d="M12 11c-2.6 0-4.5 2-4.5 4.1 0 1.7 1.3 2.9 3 2.9 1 0 1.5-.4 1.5-.4s.5.4 1.5.4c1.7 0 3-1.2 3-2.9C16.5 13 14.6 11 12 11z" />
    </>
  ),
  plane: (
    <>
      <path d="M4 11.5 20 4l-7.5 16-2.2-6.3z" />
      <path d="M10.3 13.7 20 4" />
    </>
  ),
  'device-gamepad-2': (
    <>
      <rect x="2.8" y="8" width="18.4" height="9" rx="3.5" />
      <path d="M8 10.8v3.4M6.3 12.5h3.4" />
      <path d="M15.2 11.6h.01M17.6 13.6h.01" strokeWidth="2.4" />
    </>
  ),
  dots: (
    <>
      <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  basket: (
    <>
      <path d="M4.5 9.5h15l-1.6 7.7a2 2 0 0 1-2 1.6H8.1a2 2 0 0 1-2-1.6z" />
      <path d="M9 9.5 11 4M15 9.5 13 4" />
      <path d="M10 12.8v2.6M14 12.8v2.6" />
    </>
  ),
  cup: (
    <>
      <path d="M5 7h11v6.5a3.5 3.5 0 0 1-3.5 3.5H8.5A3.5 3.5 0 0 1 5 13.5z" />
      <path d="M16 9h1.5a2.5 2.5 0 0 1 0 5H16" />
    </>
  ),
  bus: (
    <>
      <rect x="4" y="5" width="16" height="12" rx="2" />
      <path d="M4 10.5h16" />
      <path d="M7.5 17v1.6M16.5 17v1.6" />
      <path d="M9 13.8h.01M15 13.8h.01" strokeWidth="2.4" />
    </>
  ),
  'gas-station': (
    <>
      <rect x="4" y="4.5" width="9" height="15" rx="1.5" />
      <path d="M4 10h9" />
      <path d="M13 8h2.5A1.5 1.5 0 0 1 17 9.5V16a1.5 1.5 0 0 0 3 0v-4l-2-2" />
    </>
  ),
  flame: (
    <path d="M12 20.5c2.9 0 5-2.1 5-4.7 0-3.6-3.5-5.5-3.5-9.5-2.4 1.4-4 3.7-4 5.7 0 .9.3 1.6.7 2.1-.9 0-1.7-.6-2.2-1.4-.7 1-1 2.1-1 3.1 0 2.6 2.1 4.7 5 4.7z" />
  ),
  wifi: (
    <>
      <path d="M4 9.5a12 12 0 0 1 16 0" />
      <path d="M6.8 12.6a8 8 0 0 1 10.4 0" />
      <path d="M9.6 15.7a4 4 0 0 1 4.8 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  'device-tv': (
    <>
      <rect x="3.5" y="6" width="17" height="11" rx="2" />
      <path d="M9 20h6M12 17v3" />
    </>
  ),
  'glass-cocktail': (
    <>
      <path d="M5 5h14l-7 7z" />
      <path d="M12 12v7M8.5 20h7" />
    </>
  ),
  hanger: (
    <>
      <path d="M12 8.5V6.8a1.7 1.7 0 0 1 3.4 0" />
      <path d="M12 8.5 4.8 13.2a1.4 1.4 0 0 0 .8 2.5h12.8a1.4 1.4 0 0 0 .8-2.5z" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="7.6" r="2" />
      <circle cx="16.1" cy="10.8" r="2" />
      <circle cx="14.6" cy="15.6" r="2" />
      <circle cx="9.4" cy="15.6" r="2" />
      <circle cx="7.9" cy="10.8" r="2" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  beach: (
    <>
      <path d="M12 4c4.4 0 8 3.6 8 8H4c0-4.4 3.6-8 8-8z" />
      <path d="M12 12v6.4a1.8 1.8 0 0 0 3.6 0" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v10" />
      <path d="M8 10.5 12 14.5l4-4" />
      <path d="M5 19.5h14" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.8v5" />
      <path d="M12 16.2h.01" strokeWidth="2.4" />
    </>
  ),
  // IKON BARU KITA TAMBAHIN DI SINI (BIAR MUNCUL)
  coffee: (
    <>
      <path d="M5 7h11v6.5a3.5 3.5 0 0 1-3.5 3.5H8.5A3.5 3.5 0 0 1 5 13.5z" />
      <path d="M16 9h1.5a2.5 2.5 0 0 1 0 5H16" />
    </>
  ),
  pill: (
    <>
      <rect x="4" y="9" width="16" height="6" rx="3" transform="rotate(-45 12 12)" />
      <path d="M8.5 8.5l7 7" />
    </>
  ),
  moped: (
    <>
      <circle cx="6" cy="16" r="3" />
      <circle cx="18" cy="16" r="3" />
      <path d="M9 16h4l3-6h2" />
      <path d="M14 10H8" />
    </>
  ),
  bolt: <path d="M13 3 4 14h7l-1 7 9-11h-7z" />,
  school: (
    <>
      <path d="M3 10 12 3l9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9 14h6M9 18h6" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="3.2" />,
};

const ALIASES: Record<string, string> = {
  'heart-handshake': 'heart',
  'gift-card': 'gift',
  dog: 'paw',
  'trend-up': 'chart-line',
  'trending-up': 'chart-line',
  coins: 'cash',
  money: 'cash',
  'calendar-event': 'calendar',
  'dots-vertical': 'dots',
  more: 'dots',
};

export type IconProps = {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export default function Icon({ name, size = 20, strokeWidth = 1.8, className }: IconProps) {
  const raw = name.replace(/^ti-/, '');
  const key = ALIASES[raw] ?? raw;

  // Ambil dari GLYPHS, kalau nggak ada pakai 'tag'
  const glyph = GLYPHS[key] ?? GLYPHS['tag'];

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {glyph}
    </svg>
  );
}

export const ACCOUNT_ICONS = [
  'wallet',
  'building-bank',
  'credit-card',
  'cash',
  'tag',
  'briefcase',
  'gift',
  'home',
  'car',
  'book',
  'paw',
  'plane',
  'cup',
  'target',
] as const;