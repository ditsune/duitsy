'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import Sheet from './Sheet';
import CurrencyInput from './CurrencyInput';
import ConfirmDialog from './ConfirmDialog';
import { TINTS, tintOf, type Account, type Category, type Transaction } from '@/lib/types';
import { createTransaction, deleteTransaction, updateTransaction } from '@/lib/queries';

type Draft = {
  id?: string;
  amount: number;
  type: 'exp' | 'inc';
  category_id: string | null;
  account_id: string;
  tx_date: string;
  note: string;
};

type Props = {
  categories: Category[];
  accounts: Account[];
  initial: Draft;
  onClose: () => void;
  onSaved: () => void;
};

export default function TransactionSheet({ categories, accounts, initial, onClose, onSaved }: Props) {
  const [draft, setDraft] = useState<Draft>(initial);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const formId = useId();
  const amountId = useId();
  const dateId = useId();
  const accountId = useId();
  const noteId = useId();
  const searchId = useId();
  const pickerId = useId();
  const errorId = useId();

  const selectedCategory = categories.find((category) => category.id === draft.category_id);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const hasAccounts = accounts.length > 0;

  const filteredCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          (category.type === draft.type || category.type === 'both') &&
          category.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [categories, draft.type, search],
  );

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.amount) {
      setError('Isi jumlahnya dulu ya.');
      return;
    }
    if (!draft.category_id) {
      setError('Pilih kategori dulu ya.');
      return;
    }
    if (!draft.account_id) {
      setError('Pilih akun dulu ya.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        amount: draft.amount,
        type: draft.type,
        category_id: draft.category_id,
        account_id: draft.account_id,
        tx_date: draft.tx_date,
        note: draft.note,
      };

      if (draft.id) {
        await updateTransaction(draft.id, payload);
      } else {
        await createTransaction(payload);
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!draft.id) return;
    try {
      await deleteTransaction(draft.id);
      onSaved();
    } catch (e) {
      setConfirmingDelete(false);
      setError(e instanceof Error ? e.message : 'Gagal menghapus. Coba lagi.');
    }
  }

  const saveButton = (
    <button
      type="submit"
      form={formId}
      disabled={saving}
      className="tap rounded-field px-3 text-sm font-semibold text-accent transition-colors duration-150 hover:text-[#8bbaff] disabled:text-ink-3"
    >
      {saving ? 'Menyimpan...' : 'Simpan'}
    </button>
  );

  return (
    <>
      <Sheet
        title={draft.id ? 'Ubah transaksi' : 'Transaksi baru'}
        onClose={onClose}
        dirty={dirty}
        action={saveButton}
        describedBy={error ? errorId : undefined}
      >
        <form id={formId} onSubmit={handleSave} noValidate>
          <div className="flex justify-center gap-2">
            {(['exp', 'inc'] as const).map((type) => {
              const active = draft.type === type;
              const label = type === 'exp' ? 'Pengeluaran' : 'Pemasukan';
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setDraft({ ...draft, type, category_id: null })}
                  className={`flex min-h-11 items-center gap-2 rounded-chip border px-3.5 text-xs font-medium transition-colors duration-150 ${active
                      ? type === 'exp'
                        ? 'border-neg bg-neg-soft text-neg'
                        : 'border-pos bg-pos-soft text-pos'
                      : 'border-line-strong bg-paper-3 text-ink-3 hover:text-ink-2'
                    }`}
                >
                  <Icon name={type === 'exp' ? 'shopping-cart' : 'cash'} size={16} />
                  {label}
                </button>
              );
            })}
          </div>

          <div className="px-1 pb-5 pt-4 text-center">
            <label htmlFor={amountId} className="label">
              Jumlah (Rp)
            </label>
            <CurrencyInput
              id={amountId}
              value={draft.amount}
              onChange={(amount) => setDraft({ ...draft, amount })}
              placeholder="0"
              autoFocus
              invalid={Boolean(error) && !draft.amount}
              describedBy={error ? errorId : undefined}
              className="mt-1 w-full bg-transparent text-center font-hand text-[46px] leading-none text-ink placeholder:text-ink-3"
            />
          </div>

          <div className="card overflow-hidden">
            <div className="rule flex items-center gap-3 px-4 py-1.5">
              <span id={`${pickerId}-label`} className="w-24 shrink-0 text-sm text-ink-2">
                Kategori
              </span>
              <button
                type="button"
                onClick={() => setPickerOpen((open) => !open)}
                aria-expanded={pickerOpen}
                aria-controls={pickerId}
                aria-labelledby={`${pickerId}-label ${pickerId}-value`}
                className="flex min-h-11 flex-1 items-center justify-end gap-1.5 rounded-field px-1 text-right text-sm transition-colors duration-150 hover:text-accent"
              >
                <span id={`${pickerId}-value`} className={selectedCategory ? 'text-ink' : 'text-ink-3'}>
                  {selectedCategory?.name ?? 'Pilih kategori'}
                </span>
                <Icon name={pickerOpen ? 'chevron-down' : 'chevron-right'} size={16} className="text-ink-3" />
              </button>
            </div>

            <div className="rule flex items-center gap-3 px-4 py-1.5">
              <label htmlFor={dateId} className="w-24 shrink-0 text-sm text-ink-2">
                Tanggal
              </label>
              <input
                id={dateId}
                type="date"
                value={draft.tx_date}
                onChange={(event) => setDraft({ ...draft, tx_date: event.target.value })}
                className="min-h-11 flex-1 rounded-field bg-transparent px-1 text-right text-sm text-ink"
              />
            </div>

            <div className="rule flex items-center gap-3 px-4 py-1.5">
              <label htmlFor={accountId} className="w-24 shrink-0 text-sm text-ink-2">
                Wallet
              </label>
              {hasAccounts ? (
                <select
                  id={accountId}
                  value={draft.account_id}
                  onChange={(event) => setDraft({ ...draft, account_id: event.target.value })}
                  className="min-h-11 flex-1 rounded-field bg-transparent px-1 text-right text-sm text-ink"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              ) : (
                <Link href="/dashboard/akun" className="flex min-h-11 flex-1 items-center justify-end text-sm font-medium text-accent">
                  Buat wallet dulu
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3 px-4 py-1.5">
              <label htmlFor={noteId} className="w-24 shrink-0 text-sm text-ink-2">
                Catatan
              </label>
              <input
                id={noteId}
                type="text"
                value={draft.note}
                placeholder="Opsional"
                maxLength={120}
                onChange={(event) => setDraft({ ...draft, note: event.target.value })}
                className="min-h-11 flex-1 rounded-field bg-transparent px-1 text-right text-sm text-ink placeholder:text-ink-3"
              />
            </div>
          </div>

          {error && (
            <p
              id={errorId}
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-card border px-3 py-2.5 text-xs leading-relaxed text-ink"
              style={{ borderColor: 'var(--neg)', background: 'var(--neg-soft)' }}
            >
              <Icon name="alert" size={16} className="mt-0.5 shrink-0 text-neg" />
              {error}
            </p>
          )}

          {pickerOpen && (
            <div id={pickerId} className="mt-4">
              <label htmlFor={searchId} className="label mb-1.5 block">
                Cari kategori
              </label>
              <div className="relative">
                <Icon
                  name="search"
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
                />
                <input
                  id={searchId}
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Misal: makan"
                  className="field pl-9"
                />
              </div>

              {filteredCategories.length === 0 ? (
                <p className="px-1 py-6 text-center text-xs text-ink-3">Kategori tidak ditemukan.</p>
              ) : (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {filteredCategories.map((category) => {
                    const active = category.id === draft.category_id;
                    const colors = TINTS[tintOf(category.ramp)];
                    return (
                      <button
                        key={category.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setDraft({ ...draft, category_id: category.id });
                          setPickerOpen(false);
                        }}
                        className={`flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-card border px-1.5 py-2.5 transition-colors duration-150 ${active ? 'border-accent bg-paper-2' : 'border-line-strong bg-paper-3 hover:border-[#6b7d97]'
                          }`}
                      >
                        <span className="icon-tile" style={{ background: colors.bg, color: colors.fg }}>
                          <Icon name={category.icon} size={18} />
                        </span>
                        <span className="line-clamp-2 text-center text-[11px] leading-tight text-ink-2">
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {draft.id && (
            <button type="button" onClick={() => setConfirmingDelete(true)} className="btn-danger mt-6">
              <Icon name="trash" size={16} />
              Hapus transaksi
            </button>
          )}
        </form>
      </Sheet>

      {confirmingDelete && (
        <ConfirmDialog
          title="Hapus transaksi ini?"
          description="Transaksi akan dihapus permanen dan saldo akun ikut menyesuaikan."
          confirmLabel="Hapus"
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
