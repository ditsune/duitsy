'use client';

import Icon from './Icon';
import { TINTS, fmtAmount, tintOf, type Category, type Transaction } from '@/lib/types';

type Props = {
  transaction: Transaction;
  category: Pick<Category, 'name' | 'icon' | 'ramp'>;
  accountName: string;
  onEdit: () => void;
};

/**
 * Satu baris transaksi. Ini <button>, bukan div yang diklik: bisa difokus
 * dengan Tab, bisa diaktifkan dengan Enter/Space, dan punya nama yang dibaca
 * screen reader lengkap dengan arah uangnya.
 */
export default function TransactionRow({ transaction, category, accountName, onEdit }: Props) {
  const tint = TINTS[tintOf(category.ramp)];
  const isIncome = transaction.type === 'inc';
  const sign = isIncome ? '+' : '-';

  return (
    <button
      type="button"
      onClick={onEdit}
      className="row row-sep group rounded-field px-1 transition-colors duration-150 hover:bg-paper-2"
    >
      <span className="icon-tile" style={{ background: tint.bg, color: tint.fg }}>
        <Icon name={category.icon} size={18} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-ink">{category.name}</span>
        <span className="block truncate text-xs text-ink-3">
          {accountName || 'Tanpa akun'}
          {transaction.note ? ` · ${transaction.note}` : ''}
        </span>
      </span>

      <span className={`shrink-0 text-sm font-semibold tabular-nums ${isIncome ? 'text-pos' : 'text-neg'}`}>
        {sign}
        {fmtAmount(transaction.amount)}
      </span>

      <span className="sr-only">Ubah transaksi</span>
    </button>
  );
}
