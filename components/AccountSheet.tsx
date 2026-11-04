'use client';

import { useId, useState } from 'react';
import Icon from './Icon';
import Sheet from './Sheet';
import ConfirmDialog from './ConfirmDialog';
import CurrencyInput from './CurrencyInput';
import IconTintPicker from './IconTintPicker';
import { TINTS, tintOf, type Account, type TintName } from '@/lib/types';
import { createAccount, deleteAccount, updateAccountOpeningBalance } from '@/lib/queries';
import { createClient } from '@/lib/supabase/client';

type Mode = 'add' | 'edit';

type AccountDraft = {
  name: string;
  icon: string;
  tint: TintName;
  type: 'cash' | 'savings' | 'debt';
  balanceInput: number;
  goal: number;
};

const TYPE_OPTIONS: { value: AccountDraft['type']; label: string; icon: string; desc: string }[] = [
  { value: 'cash', label: 'Dompet / Cash', icon: 'wallet', desc: 'Uang tunai dan e-wallet' },
  { value: 'savings', label: 'Tabungan', icon: 'building-bank', desc: 'Rekening dan investasi' },
  { value: 'debt', label: 'Utang / Kredit', icon: 'credit-card', desc: 'Kartu kredit dan pinjaman' },
];

type Props = {
  mode: Mode;
  account?: Account;
  onClose: () => void;
  onSaved: () => void;
};

const EMPTY_DRAFT: AccountDraft = {
  name: '',
  icon: 'wallet',
  tint: 'blue',
  type: 'cash',
  balanceInput: 0,
  goal: 0,
};

export default function AccountSheet({ mode, account, onClose, onSaved }: Props) {
  const initialDraft: AccountDraft =
    mode === 'edit' && account
      ? {
          name: account.name,
          icon: account.icon,
          tint: tintOf(account.ramp),
          type: account.type,
          balanceInput: account.balance,
          goal: account.goal,
        }
      : EMPTY_DRAFT;

  const [draft, setDraft] = useState<AccountDraft>(initialDraft);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const formId = useId();
  const nameId = useId();
  const balanceId = useId();
  const balanceHintId = useId();
  const goalId = useId();
  const errorId = useId();

  const dirty = JSON.stringify(draft) !== JSON.stringify(initialDraft);
  const colors = TINTS[draft.tint];

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();

    if (!draft.name.trim()) {
      setError('Nama akun tidak boleh kosong.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (mode === 'add') {
        await createAccount({
          name: draft.name.trim(),
          icon: draft.icon,
          ramp: draft.tint,
          type: draft.type,
          opening_balance: draft.balanceInput,
          goal: draft.goal,
        });
      } else if (account) {
        const supabase = createClient();
        await supabase
          .from('accounts')
          .update({
            name: draft.name.trim(),
            icon: draft.icon,
            ramp: draft.tint,
            type: draft.type,
            goal: draft.goal,
          })
          .eq('id', account.id);

        // User mengisi saldo yang ingin dia lihat sekarang, bukan saldo awal.
        // Opening balance baru = target - (semua transaksi yang sudah tercatat).
        const totalTransaksi = account.balance - (account.opening_balance ?? 0);
        await updateAccountOpeningBalance(account.id, draft.balanceInput - totalTransaksi);
      }

      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!account) return;
    setDeleting(true);
    setError('');

    try {
      await deleteAccount(account.id);
      onSaved();
    } catch (e) {
      setConfirmingDelete(false);
      setDeleting(false);
      setError(e instanceof Error ? e.message : 'Gagal menghapus akun.');
    }
  }

  const saveButton = (
    <button
      type="submit"
      form={formId}
      disabled={saving || deleting}
      className="tap rounded-field px-3 text-sm font-semibold text-accent transition-colors duration-150 hover:text-[#8bbaff] disabled:text-ink-3"
    >
      {saving ? 'Menyimpan...' : 'Simpan'}
    </button>
  );

  return (
    <>
      <Sheet
        title={mode === 'add' ? 'Akun baru' : 'Ubah akun'}
        onClose={onClose}
        dirty={dirty}
        action={saveButton}
        describedBy={error ? errorId : undefined}
      >
        <form id={formId} onSubmit={handleSave} noValidate>
          <div className="mb-5 flex justify-center">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-card"
              style={{ background: colors.bg, color: colors.fg }}
            >
              <Icon name={draft.icon} size={28} />
            </span>
          </div>

          <div className="mb-4">
            <label htmlFor={nameId} className="label mb-1.5 block">
              Nama akun
            </label>
            <input
              id={nameId}
              type="text"
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              maxLength={40}
              placeholder="Contoh: GoPay, BCA"
              className="field"
            />
          </div>

          <fieldset className="mb-4">
            <legend className="label mb-2">Tipe akun</legend>
            <div className="flex flex-col gap-2">
              {TYPE_OPTIONS.map((option) => {
                const active = draft.type === option.value;
                return (
                  <label key={option.value} className="relative block">
                    <input
                      type="radio"
                      name="account-type"
                      value={option.value}
                      checked={active}
                      onChange={() => setDraft({ ...draft, type: option.value })}
                      className="peer absolute h-px w-px opacity-0"
                    />
                    <span className="flex min-h-11 items-center gap-3 rounded-field border border-line-strong bg-paper-3 px-4 py-2.5 transition-colors duration-150 peer-checked:border-accent peer-checked:bg-paper-2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
                      <Icon name={option.icon} size={18} className={active ? 'text-accent' : 'text-ink-3'} />
                      <span className="flex-1">
                        <span className={`block text-sm font-medium ${active ? 'text-ink' : 'text-ink-2'}`}>
                          {option.label}
                        </span>
                        <span className="block text-[11px] text-ink-3">{option.desc}</span>
                      </span>
                      {active && <Icon name="check" size={16} className="text-accent" />}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <IconTintPicker
            icon={draft.icon}
            tint={draft.tint}
            onIcon={(icon) => setDraft({ ...draft, icon })}
            onTint={(tint) => setDraft({ ...draft, tint })}
          />

          <div className="mb-4">
            <label htmlFor={balanceId} className="label mb-1.5 block">
              {mode === 'add' ? 'Saldo awal' : 'Saldo saat ini'}
            </label>
            <div className="relative">
              <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-3">
                Rp
              </span>
              <CurrencyInput
                id={balanceId}
                value={draft.balanceInput}
                onChange={(balanceInput) => setDraft({ ...draft, balanceInput })}
                className="field pl-10"
                describedBy={balanceHintId}
              />
            </div>
            <p id={balanceHintId} className="mt-1.5 text-[11px] leading-relaxed text-ink-3">
              {mode === 'add'
                ? 'Isi saldo yang sekarang ada di akun ini. Boleh dikosongkan.'
                : 'Isi saldo yang ingin kamu lihat sekarang. Transaksi lama tidak berubah.'}
            </p>
          </div>

          {draft.type !== 'cash' && (
            <div className="mb-4">
              <label htmlFor={goalId} className="label mb-1.5 block">
                {draft.type === 'savings' ? 'Target tabungan' : 'Total utang / limit kredit'}
              </label>
              <div className="relative">
                <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-3">
                  Rp
                </span>
                <CurrencyInput
                  id={goalId}
                  value={draft.goal}
                  onChange={(goal) => setDraft({ ...draft, goal })}
                  className="field pl-10"
                />
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-3">
                Kosongkan kalau belum ada target. Progress baru muncul setelah target diisi.
              </p>
            </div>
          )}

          {error && (
            <p
              id={errorId}
              role="alert"
              className="flex items-start gap-2 rounded-card border px-3 py-2.5 text-xs leading-relaxed text-ink"
              style={{ borderColor: 'var(--neg)', background: 'var(--neg-soft)' }}
            >
              <Icon name="alert" size={16} className="mt-0.5 shrink-0 text-neg" />
              {error}
            </p>
          )}

          {mode === 'edit' && (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              disabled={deleting}
              className="btn-danger mt-5"
            >
              <Icon name="trash" size={16} />
              {deleting ? 'Menghapus...' : 'Hapus akun'}
            </button>
          )}
        </form>
      </Sheet>

      {confirmingDelete && account && (
        <ConfirmDialog
          title={`Hapus akun "${account.name}"?`}
          description="Akun hanya bisa dihapus kalau semua transaksinya sudah dipindah atau dihapus."
          confirmLabel="Hapus akun"
          busy={deleting}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
