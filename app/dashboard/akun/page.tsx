'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/components/DashboardShell';
import AccountSheet from '@/components/AccountSheet';
import EmptyState from '@/components/EmptyState';
import LoadingRows from '@/components/LoadingRows';
import Icon from '@/components/Icon';
import { createClient } from '@/lib/supabase/client';
import { TINTS, fmt, fmtAmount, tintOf, type Account } from '@/lib/types';

const TYPE_LABEL: Record<Account['type'], string> = {
  cash: 'Dompet',
  savings: 'Tabungan',
  debt: 'Utang',
};

function currentAmount(account: Account): number {
  return account.type === 'debt' ? Math.abs(account.balance) : account.balance;
}

function GoalProgress({ account, onSetGoal }: { account: Account; onSetGoal: () => void }) {
  if (account.goal <= 0) {
    return (
      <button
        type="button"
        onClick={onSetGoal}
        className="mt-2 flex min-h-11 items-center gap-1.5 text-[11px] font-medium text-accent hover:text-[#8bbaff]"
      >
        <Icon name="target" size={14} />
        Atur target {account.type === 'debt' ? 'pelunasan' : 'tabungan'}
      </button>
    );
  }

  const current = currentAmount(account);
  const ratio = Math.min(Math.max(current / account.goal, 0), 1);
  const percent = Math.round(ratio * 100);

  return (
    <div className="mt-3">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`Progress ${account.type === 'debt' ? 'pelunasan' : 'target'} ${account.name}`}
        className="h-1.5 overflow-hidden rounded-full bg-paper-3"
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, background: account.type === 'debt' ? 'var(--neg)' : 'var(--pos)' }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-ink-3">
        <span className="tabular-nums">
          {fmtAmount(current)} / {fmtAmount(account.goal)}
        </span>
        <span className="tabular-nums">{percent}%</span>
      </div>
    </div>
  );
}

export default function AkunPage() {
  const { accounts, loading, refresh } = useDashboard();
  const [sheet, setSheet] = useState<{ open: boolean; mode: 'add' | 'edit'; account?: Account }>({
    open: false,
    mode: 'add',
  });

  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    if (window.confirm('Yakin mau keluar dari akun ini?')) {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    }
  };

  const { primary, rest, total } = useMemo(() => {
    const sorted = [...accounts].sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
    return {
      primary: sorted[0],
      rest: sorted.slice(1),
      total: accounts.reduce((sum, account) => sum + account.balance, 0),
    };
  }, [accounts]);

  function openAdd() {
    setSheet({ open: true, mode: 'add' });
  }

  function openEdit(account: Account) {
    setSheet({ open: true, mode: 'edit', account });
  }

  function closeSheet() {
    setSheet((current) => ({ ...current, open: false }));
  }

  function onSaved() {
    closeSheet();
    refresh();
  }

  return (
    <>
      <h1 className="sr-only">Akun</h1>

      {/* BAGIAN HEADER: TOTAL SALDO & TOMBOL LOGOUT */}
      <section className="px-4 pt-5" aria-labelledby="total-saldo-label">
        <div className="flex items-baseline justify-between gap-3">
          <p id="total-saldo-label" className="label">
            Total saldo
          </p>
          {/* Log Out sejajar dengan Total Saldo, persis seperti di Beranda */}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-chip text-[11px] font-medium text-ink-3 underline underline-offset-2 hover:text-ink"
          >
            Log Out
          </button>
        </div>
        <p className="mt-1 font-hand text-[40px] leading-none text-ink">{fmt(total)}</p>
      </section>

      {loading ? (
        <div className="px-4 pt-4">
          <LoadingRows count={4} />
        </div>
      ) : accounts.length === 0 ? (
        <div className="px-4 pt-5">
          <EmptyState
            icon="wallet"
            title="Belum ada akun"
            hint="Tambahkan dompet, rekening, atau utang supaya saldo bisa dihitung."
            action={
              <button type="button" onClick={openAdd} className="btn-primary">
                Tambah wallet pertama
              </button>
            }
          />
        </div>
      ) : (
        <>
          {primary && (
            <div className="mx-4 mt-4 card p-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-field"
                  style={{ background: TINTS[tintOf(primary.ramp)].bg, color: TINTS[tintOf(primary.ramp)].fg }}
                >
                  <Icon name={primary.icon} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{primary.name}</p>
                  <p className="mt-0.5 text-[11px] text-ink-3">{TYPE_LABEL[primary.type]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(primary)}
                  aria-label={`Ubah akun ${primary.name}`}
                  className="tap flex items-center justify-center rounded-field text-ink-3 transition-colors duration-150 hover:bg-paper-3 hover:text-ink"
                >
                  <Icon name="dots" size={18} />
                </button>
              </div>

              <p className="mt-2 font-hand text-[34px] leading-none text-ink">{fmt(primary.balance)}</p>

              <GoalProgress account={primary} onSetGoal={() => openEdit(primary)} />
            </div>
          )}

          {/* BAGIAN AKUN LAIN & TOMBOL TAMBAH AKUN */}
          {rest.length > 0 && (
            <section className="mt-5 px-4" aria-label="Akun lain">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="section-head">Wallet</h2>
                {/* Tombol Tambah Akun dipindah ke sini, disejajarkan */}
                <button
                  type="button"
                  onClick={openAdd}
                  className="flex items-center gap-1 text-[11px] font-medium text-accent hover:text-[#8bbaff] transition-colors"
                >
                  <Icon name="plus" size={13} />
                  Tambah wallet
                </button>
              </div>

              <div className="mt-1">
                {rest.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => openEdit(account)}
                    className="row row-sep rounded-field px-1 transition-colors duration-150 hover:bg-paper-2"
                  >
                    <span
                      className="icon-tile"
                      style={{ background: TINTS[tintOf(account.ramp)].bg, color: TINTS[tintOf(account.ramp)].fg }}
                    >
                      <Icon name={account.icon} size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-ink">{account.name}</span>
                      <span className="block text-xs text-ink-3">{TYPE_LABEL[account.type]}</span>
                    </span>
                    <span
                      className={`shrink-0 text-sm font-semibold tabular-nums ${account.balance < 0 ? 'text-neg' : 'text-ink-2'
                        }`}
                    >
                      {fmt(account.balance)}
                    </span>
                    <span className="sr-only">Ubah akun</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Tombol "Keluar Akun" di paling bawah udah DIHAPUS sesuai request */}

      {sheet.open && (
        <AccountSheet
          mode={sheet.mode}
          account={sheet.account}
          onClose={closeSheet}
          onSaved={onSaved}
        />
      )}
    </>
  );
}