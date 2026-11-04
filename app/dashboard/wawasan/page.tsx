'use client';

import { useMemo, useState } from 'react';
import { useDashboard } from '@/components/DashboardShell';
import LoadingRows from '@/components/LoadingRows';
import EmptyState from '@/components/EmptyState';
import Icon from '@/components/Icon';
import { fmtAmount, fmtPercent, isSameMonth, monthLabel, type Category, tintOf, TINTS } from '@/lib/types';

const FALLBACK_CATEGORY: Pick<Category, 'name' | 'icon' | 'ramp'> = {
  name: 'Tanpa kategori',
  icon: 'tag',
  ramp: 'blue',
};

// Palet warna cadangan (kalau data ramp dari DB kosong/error)
const FALLBACK_COLORS = ['#6aa9ff', '#8ce99a', '#ffb199', '#f472b6', '#a78bfa', '#2dd4bf', '#fbbf24'];

export default function WawasanPage() {
  const { categories, transactions, monthDate, loading } = useDashboard();
  const [tab, setTab] = useState<'exp' | 'inc'>('exp');

  const data = useMemo(() => {
    const filtered = transactions.filter((transaction) => transaction.type === tab);

    const totals = new Map<string, number>();
    filtered.forEach((transaction) => {
      totals.set(transaction.category_id, (totals.get(transaction.category_id) ?? 0) + transaction.amount);
    });

    // Dapetin data, urutin, dan tentuin warnanya
    const entries = Array.from(totals.entries())
      .map(([categoryId, amount], index) => {
        const category = categories.find((c) => c.id === categoryId) ?? FALLBACK_CATEGORY;

        // --- LOGIKA WARNA ANTI-SLOP ---
        let tint = tintOf(category.ramp);
        let color = TINTS[tint].hex;

        // Kalau dari DB warnanya abu-abu (nggak di-set), kita paksa pakai warna dari Fallback
        if (tint === 'gray') {
          color = FALLBACK_COLORS[index % FALLBACK_COLORS.length];
        }

        return {
          categoryId,
          amount,
          category,
          color, // Masukin kode warnanya ke sini
        };
      })
      .sort((a, b) => b.amount - a.amount);

    const total = entries.reduce((sum, entry) => sum + entry.amount, 0);

    return {
      entries: entries.map((entry) => ({
        ...entry,
        percent: total ? Math.round((entry.amount / total) * 100) : 0,
      })),
      total,
      top: entries[0],
      topPercent: total && entries[0] ? Math.round((entries[0].amount / total) * 100) : 0,
    };
  }, [categories, tab, transactions]);

  const isCurrentMonth = isSameMonth(monthDate, new Date());
  const periodLabel = isCurrentMonth ? 'bulan ini' : monthLabel(monthDate);
  const kindLabel = tab === 'exp' ? 'pengeluaran' : 'penghasilan';

  return (
    <>
      <h1 className="sr-only">Wawasan</h1>

      <div className="px-4 pt-4">
        <div
          role="group"
          aria-label="Jenis arus"
          className="flex gap-1 rounded-field border border-line-strong bg-paper-2 p-1"
        >
          <button
            type="button"
            aria-pressed={tab === 'exp'}
            onClick={() => setTab('exp')}
            className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-chip text-xs font-medium transition-colors duration-150 ${tab === 'exp' ? 'bg-paper-3 text-accent' : 'text-ink-3 hover:text-ink-2'
              }`}
          >
            <Icon name="shopping-cart" size={15} />
            Pengeluaran
          </button>
          <button
            type="button"
            aria-pressed={tab === 'inc'}
            onClick={() => setTab('inc')}
            className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-chip text-xs font-medium transition-colors duration-150 ${tab === 'inc' ? 'bg-paper-3 text-accent' : 'text-ink-3 hover:text-ink-2'
              }`}
          >
            <Icon name="cash" size={15} />
            Penghasilan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="px-4 pt-4">
          <LoadingRows count={6} />
        </div>
      ) : data.entries.length === 0 ? (
        <div className="px-4 pt-4">
          <EmptyState
            icon="chart-donut"
            title={`Belum ada ${kindLabel} ${periodLabel}`}
            hint="Pecahan per kategori muncul setelah ada transaksi yang tercatat."
          />
        </div>
      ) : (
        <>
          <section className="px-4 pt-5 text-center" aria-labelledby="total-heading">
            <h2 id="total-heading" className="label">
              Total {kindLabel} {periodLabel}
            </h2>
            <p className="mt-1 font-hand text-[40px] leading-none text-ink">{fmtAmount(data.total)}</p>
          </section>

          {/* GRAFIK DONAT MULTI-WARNA */}
          <div className="relative mx-auto mt-4 h-[180px] w-[180px]">
            <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="90" cy="90" r="70" fill="none" stroke="var(--paper-3)" strokeWidth="18" />

              {data.entries.map((entry, index) => {
                // Kalkulasi potongan donat
                const radius = 70;
                const circumference = 2 * Math.PI * radius;
                const dash = (entry.percent / 100) * circumference;
                const gap = 4; // Jarak antar potongan biar kelihatan jelas
                const strokeDasharray = `${Math.max(0, dash - gap)} ${circumference - Math.max(0, dash - gap)}`;

                // Kalkulasi posisi mulai potongan (offset)
                let previousPercent = 0;
                for (let i = 0; i < index; i++) {
                  previousPercent += data.entries[i].percent;
                }
                const strokeDashoffset = -(previousPercent / 100) * circumference;

                return (
                  <circle
                    key={entry.categoryId}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={entry.color} // <--- Warna dinamis dari kode di atas
                    strokeWidth="18"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 ease-in-out"
                  />
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-hand text-[38px] leading-none text-ink">{data.topPercent}%</span>
              <span className="mt-0.5 text-[11px] text-ink-3">terbesar</span>
            </div>
          </div>

          <p className="mt-2 px-4 text-center text-xs text-ink-3">
            Kategori terbesar: <span className="text-ink-2">{data.top?.category.name}</span>
          </p>

          <section className="mt-5 px-4" aria-labelledby="pecahan-heading">
            <h2 id="pecahan-heading" className="section-head mb-1">
              Pecahan
            </h2>

            {data.entries.map((entry) => (
              <div key={entry.categoryId} className="py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    {/* Ikon dibikin berwarna sesuai kategorinya */}
                    <Icon name={entry.category.icon} size={15} className="shrink-0" style={{ color: entry.color }} />
                    <span className="truncate text-sm text-ink">{entry.category.name}</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-ink-2">
                    {fmtAmount(entry.amount)}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-2">
                  <div aria-hidden="true" className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-3">
                    {/* Progress bar dibikin berwarna sesuai kategorinya */}
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(entry.percent, 1)}%`, backgroundColor: entry.color }}
                    />
                  </div>
                  <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-ink-3">
                    {fmtPercent(entry.amount, data.total)}
                  </span>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </>
  );
}