'use client';

import Link from 'next/link';
import { useDashboard } from '@/components/DashboardShell';
import TransactionRow from '@/components/TransactionRow';
import EmptyState from '@/components/EmptyState';
import LoadingRows from '@/components/LoadingRows';
import { fmt, fmtAmount, fmtDelta, isSameMonth, monthLabel, type Category } from '@/lib/types';

const FALLBACK_CATEGORY: Pick<Category, 'name' | 'icon' | 'ramp'> = {
  name: 'Tanpa kategori',
  icon: 'tag',
  ramp: 'blue',
};

const PREVIEW_COUNT = 5;

export default function BerandaPage() {
  const { categories, accounts, transactions, monthDate, loading, openEdit } = useDashboard();

  if (loading) {
    return (
      <>
        <h1 className="sr-only">Beranda</h1>
        <div className="px-4 pt-5">
          <LoadingRows count={6} />
        </div>
      </>
    );
  }

  const saldo = accounts.reduce((sum, account) => sum + account.balance, 0);
  const income = transactions.filter((transaction) => transaction.type === 'inc');
  const expense = transactions.filter((transaction) => transaction.type === 'exp');
  const totalIncome = income.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = expense.reduce((sum, transaction) => sum + transaction.amount, 0);
  const cashFlow = totalIncome - totalExpense;
  const isCurrentMonth = isSameMonth(monthDate, new Date());
  const periodLabel = isCurrentMonth ? 'bulan ini' : monthLabel(monthDate);

  function categoryOf(id: string) {
    return categories.find((category) => category.id === id) ?? FALLBACK_CATEGORY;
  }

  function accountNameOf(id: string) {
    return accounts.find((account) => account.id === id)?.name ?? '';
  }

  return (
    <>
      <h1 className="sr-only">Beranda</h1>

      {/* Focal point halaman ini: satu angka terbesar, sisanya mendukung. */}
      <section className="px-4 pt-5" aria-labelledby="saldo-label">
        <div className="flex items-baseline justify-between gap-3">
          <p id="saldo-label" className="label">
            Total saldo
          </p>
          <Link
            href="/dashboard/akun"
            className="rounded-chip text-[11px] font-medium text-ink-3 underline underline-offset-2 hover:text-ink"
          >
            Kelola akun
          </Link>
        </div>
        <p className="mt-1 font-hand text-[40px] leading-none text-ink">{fmt(saldo)}</p>
        <p className="mt-1.5 text-xs text-ink-3">
          {accounts.length ? `Dari ${accounts.length} akun` : 'Belum ada akun'}
        </p>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3 px-4">
        <div className="card px-3.5 py-3">
          <p className="label">Masuk</p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-pos">{fmtAmount(totalIncome)}</p>
          <p className="mt-0.5 text-[11px] text-ink-3">{periodLabel}</p>
        </div>
        <div className="card px-3.5 py-3">
          <p className="label">Keluar</p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-neg">{fmtAmount(totalExpense)}</p>
          <p className="mt-0.5 text-[11px] text-ink-3">{periodLabel}</p>
        </div>
      </div>

      <p className="mt-2 px-4 text-xs text-ink-3">
        Arus kas {periodLabel}:{' '}
        <span className={`font-semibold tabular-nums ${cashFlow < 0 ? 'text-neg' : 'text-pos'}`}>
          {fmtDelta(cashFlow)}
        </span>
      </p>

      {accounts.length === 0 ? (
        <div className="mt-6 px-4">
          <EmptyState
            icon="building-bank"
            title="Mulai dari satu akun"
            hint="Saldo dan catatan transaksi dihitung dari akun yang kamu buat."
            action={
              <Link href="/dashboard/akun" className="btn-primary">
                Buat akun pertama
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <section className="mt-7 px-4" aria-labelledby="pemasukan-heading">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="pemasukan-heading" className="section-head">
                Pemasukan
              </h2>
              <span className="text-[11px] text-ink-3">{income.length} transaksi</span>
            </div>

            <div className="mt-1">
              {income.length === 0 ? (
                <p className="py-6 text-center text-xs text-ink-3">
                  Belum ada pemasukan {isCurrentMonth ? 'bulan ini' : `di ${monthLabel(monthDate)}`}.
                </p>
              ) : (
                income.slice(0, PREVIEW_COUNT).map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    category={categoryOf(transaction.category_id)}
                    accountName={accountNameOf(transaction.account_id)}
                    onEdit={() => openEdit(transaction)}
                  />
                ))
              )}
            </div>

            {income.length > PREVIEW_COUNT && (
              <Link
                href="/dashboard/transaksi"
                className="flex min-h-11 items-center text-xs font-medium text-accent hover:text-[#8bbaff]"
              >
                Semua pemasukan ({income.length})
              </Link>
            )}
          </section>

          <section className="mt-7 px-4" aria-labelledby="pengeluaran-heading">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="pengeluaran-heading" className="section-head">
                Pengeluaran
              </h2>
              <span className="text-[11px] text-ink-3">{expense.length} transaksi</span>
            </div>

            <div className="mt-1">
              {expense.length === 0 ? (
                <p className="py-6 text-center text-xs text-ink-3">
                  Belum ada pengeluaran {isCurrentMonth ? 'bulan ini' : `di ${monthLabel(monthDate)}`}.
                </p>
              ) : (
                expense.slice(0, PREVIEW_COUNT).map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    category={categoryOf(transaction.category_id)}
                    accountName={accountNameOf(transaction.account_id)}
                    onEdit={() => openEdit(transaction)}
                  />
                ))
              )}
            </div>

            {expense.length > PREVIEW_COUNT && (
              <Link
                href="/dashboard/transaksi"
                className="flex min-h-11 items-center text-xs font-medium text-accent hover:text-[#8bbaff]"
              >
                Semua pengeluaran ({expense.length})
              </Link>
            )}
          </section>
        </>
      )}
    </>
  );
}
