export type Category = {
  id: string;
  name: string;
  icon: string;
  ramp: string;
  type: 'exp' | 'inc' | 'both';
};

export type Account = {
  id: string;
  name: string;
  icon: string;
  ramp: string;
  type: 'cash' | 'savings' | 'debt';
  goal: number;
  opening_balance: number;
  balance: number;
};

export type Transaction = {
  id: string;
  amount: number;
  type: 'exp' | 'inc';
  category_id: string;
  account_id: string;
  tx_date: string;
  note: string;
};

// Tiga tint saja, masing-masing punya peran:
// blue = netral/aksen, green = uang masuk, coral = uang keluar.
// Nama tint lama di database (pink, purple, teal, amber) dipetakan ke sini
// supaya data lama tetap tampil tanpa migrasi.
// Warna dipakai untuk membedakan kategori di chart (fungsi data).
export type TintName = 'blue' | 'green' | 'coral' | 'pink' | 'purple' | 'teal' | 'amber' | 'gray';

// Palet warna kalem yang aman (nggak norak/neon) & kontras di background gelap
export const TINTS: Record<TintName, { bg: string; fg: string; hex: string }> = {
  blue: { bg: 'rgba(106, 169, 255, 0.16)', fg: '#6aa9ff', hex: '#6aa9ff' },
  green: { bg: 'rgba(140, 233, 154, 0.12)', fg: '#8ce99a', hex: '#8ce99a' },
  coral: { bg: 'rgba(255, 177, 153, 0.12)', fg: '#ffb199', hex: '#ffb199' },
  pink: { bg: 'rgba(244, 114, 182, 0.12)', fg: '#f472b6', hex: '#f472b6' },
  purple: { bg: 'rgba(167, 139, 250, 0.12)', fg: '#a78bfa', hex: '#a78bfa' },
  teal: { bg: 'rgba(45, 212, 191, 0.12)', fg: '#2dd4bf', hex: '#2dd4bf' },
  amber: { bg: 'rgba(251, 191, 36, 0.12)', fg: '#fbbf24', hex: '#fbbf24' },
  gray: { bg: 'rgba(156, 163, 175, 0.12)', fg: '#9ca3af', hex: '#9ca3af' },
};

// Mapping dari database (ramp) ke TintName
const TINT_ALIAS: Record<string, TintName> = {
  blue: 'blue', pink: 'pink', purple: 'purple', teal: 'teal', green: 'green', coral: 'coral', amber: 'amber',
};

export function tintOf(ramp: string | undefined | null): TintName {
  return TINT_ALIAS[ramp ?? ''] ?? 'gray'; // Fallback ke abu-abu kalau kosong
}

/** Nilai rupiah dengan tanda. Negatif menjadi "-Rp12.000", bukan "Rp12.000". */
export function fmt(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? '-' : '';
  return sign + 'Rp' + Math.abs(rounded).toLocaleString('id-ID');
}

/** Untuk arus kas: selalu menampilkan arah, "+Rp12.000" atau "-Rp12.000". */
export function fmtDelta(n: number): string {
  const rounded = Math.round(n);
  if (rounded === 0) return 'Rp0';
  return (rounded > 0 ? '+' : '-') + 'Rp' + Math.abs(rounded).toLocaleString('id-ID');
}

/** Nilai absolut, hanya untuk baris yang tipenya sudah memberi arah. */
export function fmtAmount(n: number): string {
  return 'Rp' + Math.round(Math.abs(n)).toLocaleString('id-ID');
}

export function fmtPercent(part: number, total: number): string {
  if (!total) return '0%';
  return `${Math.round((part / total) * 100)}%`;
}

export const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const DAYNAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function monthLabel(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
