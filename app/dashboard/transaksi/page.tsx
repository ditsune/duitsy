'use client';

import { useMemo, useState } from 'react';
import { useDashboard } from '@/components/DashboardShell';
import TransactionRow from '@/components/TransactionRow';
import LoadingRows from '@/components/LoadingRows';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import {
  DAYNAMES,
  fmtAmount,
  fmtDelta,
  isSameMonth,
  monthLabel,
  type Category,
  type Transaction,
} from '@/lib/types';

const FALLBACK_CATEGORY: Pick<Category, 'name' | 'icon' | 'ramp'> = {
  name: 'Tanpa kategori',
  icon: 'tag',
  ramp: 'blue',
};

const WEEKDAYS = [
  { short: 'S', full: 'Senin' },
  { short: 'S', full: 'Selasa' },
  { short: 'R', full: 'Rabu' },
  { short: 'K', full: 'Kamis' },
  { short: 'J', full: 'Jumat' },
  { short: 'S', full: 'Sabtu' },
  { short: 'M', full: 'Minggu' },
];

export default function TransaksiPage() {
  const { categories, accounts, transactions, monthDate, loading, openEdit } = useDashboard();
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const days = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => b.tx_date.localeCompare(a.tx_date));
    const grouped = new Map<string, Transaction[]>();
    sorted.forEach((transaction) => {
      const list = grouped.get(transaction.tx_date) ?? [];
      list.push(transaction);
      grouped.set(transaction.tx_date, list);
    });
    return Array.from(grouped.entries());
  }, [transactions]);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'inc')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'exp')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const transactionDates = new Set(transactions.map((transaction) => transaction.tx_date));
  const today = new Date();
  const isCurrentMonth = isSameMonth(monthDate, today);

  function categoryOf(id: string) {
    return categories.find((category) => category.id === id) ?? FALLBACK_CATEGORY;
  }

  function accountNameOf(id: string) {
    return accounts.find((account) => account.id === id)?.name ?? '';
  }

  return (
    <>
      <h1 className="sr-only">Transaksi</h1>

      <div className="flex items-center gap-2 px-4 pt-4">
        <div
          role="group"
          aria-label="Tampilan transaksi"
          className="flex flex-1 gap-1 rounded-field border border-line-strong bg-paper-2 p-1"
        >
          <button
            type="button"
            aria-pressed={view === 'list'}
            onClick={() => setView('list')}
            className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-chip text-xs font-medium transition-colors duration-150 ${view === 'list' ? 'bg-paper-3 text-accent' : 'text-ink-3 hover:text-ink-2'
              }`}
          >
            <Icon name="list" size={15} />
            Daftar
          </button>
          <button
            type="button"
            aria-pressed={view === 'calendar'}
            onClick={() => setView('calendar')}
            className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-chip text-xs font-medium transition-colors duration-150 ${view === 'calendar' ? 'bg-paper-3 text-accent' : 'text-ink-3 hover:text-ink-2'
              }`}
          >
            <Icon name="calendar" size={15} />
            Kalender
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 px-4 pb-1 pt-3 text-xs text-ink-3">
        <span className="whitespace-nowrap">{transactions.length} transaksi</span>
        <span aria-hidden="true">·</span>
        <span className="whitespace-nowrap">
          Masuk <span className="font-semibold tabular-nums text-pos">+{fmtAmount(totalIncome)}</span>
        </span>
        <span aria-hidden="true">·</span>
        <span className="whitespace-nowrap">
          Keluar <span className="font-semibold tabular-nums text-neg">-{fmtAmount(totalExpense)}</span>
        </span>
      </div>

      {loading ? (
        <div className="px-4">
          <LoadingRows count={6} />
        </div>
      ) : view === 'calendar' ? (
        <section className="px-4 pt-2" aria-label={`Kalender ${monthLabel(monthDate)}`}>
          <table className="w-full table-fixed border-collapse">
            <caption className="sr-only">Kalender {monthLabel(monthDate)}</caption>
            <thead>
              <tr>
                {WEEKDAYS.map((weekday) => (
                  <th key={weekday.full} scope="col" className="py-1 text-[10px] font-medium text-ink-3">
                    <abbr title={weekday.full} className="no-underline">
                      {weekday.short}
                    </abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil((firstWeekday + daysInMonth) / 7) }).map((_, week) => (
                <tr key={week}>
                  {Array.from({ length: 7 }).map((__, weekdayIndex) => {
                    const dayNumber = week * 7 + weekdayIndex - firstWeekday + 1;
                    if (dayNumber < 1 || dayNumber > daysInMonth) {
                      return <td key={weekdayIndex} />;
                    }
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                    const hasTransaction = transactionDates.has(dateString);
                    const isToday = isCurrentMonth && today.getDate() === dayNumber;

                    return (
                      <td key={weekdayIndex} className="py-0.5">
                        <span className="mx-auto flex h-10 w-9 flex-col items-center justify-center gap-0.5">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs tabular-nums ${isToday ? 'bg-accent font-semibold text-accent-ink' : 'text-ink-2'
                              }`}
                          >
                            {dayNumber}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`h-1 w-1 rounded-full ${hasTransaction ? (isToday ? 'bg-accent' : 'bg-ink-3') : 'bg-transparent'
                              }`}
                          />
                          {hasTransaction && <span className="sr-only">ada transaksi</span>}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="pb-2 pt-3 text-[11px] text-ink-3">Titik menandai hari yang punya transaksi.</p>
        </section>
      ) : days.length === 0 ? (
        <div className="px-4 pt-3">
          <EmptyState
            icon="list"
            title={`Belum ada transaksi di ${monthLabel(monthDate)}`}
            hint="Tekan tombol + di bawah untuk mencatat pengeluaran atau pemasukan pertama."
          />
        </div>
      ) : (
        <div className="px-4 pb-10">
          {days.map(([date, dayTransactions]) => {
            const dateObject = new Date(`${date}T00:00:00`);
            const dayNet = dayTransactions.reduce(
              (sum, transaction) => sum + (transaction.type === 'inc' ? transaction.amount : -transaction.amount),
              0,
            );

            return (
              <section key={date} className="mt-5 first:mt-3" aria-label={`${dateObject.getDate()} ${DAYNAMES[dateObject.getDay()]}`}>
                {/* HEADER TANGGAL & BADGE TOTAL HARIAN */}
                <div className="row-sep flex items-center justify-between border-b border-line-soft pb-2.5 mb-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="w-7 text-center font-hand text-[32px] leading-none text-accent">
                      {dateObject.getDate()}
                    </span>
                    <span className="font-hand text-[24px] leading-none text-ink">
                      {DAYNAMES[dateObject.getDay()]}
                    </span>
                  </div>

                  {/* BADGE TOTAL HARIAN (DIBESARIN & DIPERTEBAL) */}
                  <span
                    className={`rounded-lg px-3.5 py-1.5 text-[13px] font-bold tabular-nums shadow-sm ${dayNet < 0
                        ? 'bg-neg-soft text-neg'
                        : dayNet > 0
                          ? 'bg-pos-soft text-pos'
                          : 'bg-paper-3 text-ink-3'
                      }`}
                  >
                    {fmtDelta(dayNet)}
                  </span>
                </div>

                {/* LIST TRANSAKSI */}
                <div className="flex flex-col mt-2">
                  {dayTransactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      category={categoryOf(transaction.category_id)}
                      accountName={accountNameOf(transaction.account_id)}
                      onEdit={() => openEdit(transaction)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}