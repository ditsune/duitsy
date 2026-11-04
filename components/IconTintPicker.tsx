'use client';

import Icon, { ACCOUNT_ICONS } from './Icon';
import { TINTS, type TintName } from '@/lib/types';

const ICON_LABELS: Record<string, string> = {
  wallet: 'Dompet',
  'building-bank': 'Bank',
  'credit-card': 'Kartu kredit',
  cash: 'Uang tunai',
  tag: 'Label',
  briefcase: 'Tas kerja',
  gift: 'Hadiah',
  home: 'Rumah',
  car: 'Mobil',
  book: 'Buku',
  paw: 'Peliharaan',
  plane: 'Perjalanan',
  cup: 'Kopi',
  target: 'Target',
};

// Kita ambil semua 8 warna dari TINTS di lib/types.ts
// Urutannya gw atur biar yang cerah di depan
const TINT_OPTIONS: { value: TintName; label: string }[] = [
  { value: 'blue', label: 'Biru' },
  { value: 'green', label: 'Hijau' },
  { value: 'coral', label: 'Coral' },
  { value: 'pink', label: 'Pink' },
  { value: 'purple', label: 'Ungu' },
  { value: 'teal', label: 'Teal' },
  { value: 'amber', label: 'Kuning' },
  { value: 'gray', label: 'Abu-abu' },
];

type Props = {
  icon: string;
  tint: TintName;
  onIcon: (icon: string) => void;
  onTint: (tint: TintName) => void;
};

/**
 * Pemilih ikon dan warna untuk akun. Setiap tombol 44px, punya nama,
 * dan menandai pilihannya dengan centang, bukan cuma warna.
 */
export default function IconTintPicker({ icon, tint, onIcon, onTint }: Props) {
  const normalizedIcon = icon.replace(/^ti-/, '');

  return (
    <div className="mb-4">
      <p className="label mb-2">Ikon</p>
      <div className="grid grid-cols-5 gap-2">
        {ACCOUNT_ICONS.map((name) => {
          const active = name === normalizedIcon;
          const colors = TINTS[tint];
          return (
            <button
              key={name}
              type="button"
              onClick={() => onIcon(name)}
              aria-pressed={active}
              aria-label={ICON_LABELS[name] ?? name}
              className={`tap flex items-center justify-center rounded-field border transition-colors duration-150 ${active ? 'border-accent' : 'border-line-strong bg-paper-3 hover:border-[#6b7d97]'
                }`}
              style={active ? { background: colors.bg, color: colors.fg } : undefined}
            >
              <Icon name={name} size={20} />
            </button>
          );
        })}
      </div>

      <p className="label mb-2 mt-4">Warna</p>
      {/* GW UBAH JADI flex-wrap BIAR KALAU WARNANYA BANYAK, TURUN KE BAWAH */}
      <div className="flex flex-wrap gap-2">
        {TINT_OPTIONS.map((option) => {
          const active = option.value === tint;
          const colors = TINTS[option.value];
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onTint(option.value)}
              aria-pressed={active}
              aria-label={`Warna ${option.label}`}
              className={`tap flex items-center justify-center rounded-field border bg-paper-3 transition-colors duration-150 hover:border-[#6b7d97] ${active ? 'border-accent' : 'border-line-strong'
                }`}
            >
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ background: colors.fg }}
              >
                {active && <Icon name="check" size={14} strokeWidth={2.6} className="text-[#0b0e14]" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}