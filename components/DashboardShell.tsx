'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getCategories, getAccounts, getTransactions } from '@/lib/queries';
import { monthRange } from '@/lib/date';
import { isAuthError, refreshSessionOnce, signOutAndGoToLogin } from '@/lib/auth';
import type { Category, Account, Transaction } from '@/lib/types';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import TransactionSheet from './TransactionSheet';
import Icon from './Icon';

type DashboardContextType = {
  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
  monthDate: Date;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  openEdit: (tx: Transaction) => void;
};

export const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardShell');
  return ctx;
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthDate, setMonthDate] = useState<Date>(new Date());

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Sesi yang benar-benar kedaluwarsa hanya boleh memicu satu percobaan
  // refresh per siklus load, bukan loop.
  const retriedSession = useRef(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { start, end } = monthRange(monthDate);
      const [cats, accs, txs] = await Promise.all([
        getCategories(),
        getAccounts(),
        getTransactions(start, end),
      ]);

      setCategories(cats);
      setAccounts(accs);
      setTransactions(txs);
      retriedSession.current = false;
    } catch (e) {
      console.error('Gagal memuat data dashboard:', e);

      if (isAuthError(e) && !retriedSession.current) {
        retriedSession.current = true;
        if (await refreshSessionOnce()) {
          await loadData();
          return;
        }
        await signOutAndGoToLogin();
        return;
      }

      setError('Data gagal dimuat. Periksa koneksi, lalu coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [monthDate]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function openEdit(tx: Transaction) {
    setEditingTx(tx);
    setSheetOpen(true);
  }

  function openAdd() {
    setEditingTx(null);
    setSheetOpen(true);
  }

  function closeSheet() {
    setSheetOpen(false);
    setEditingTx(null);
  }

  function saved() {
    closeSheet();
    void loadData();
  }

  function prevMonth() {
    setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  return (
    <DashboardContext.Provider
      value={{
        categories,
        accounts,
        transactions,
        monthDate,
        loading,
        error,
        refresh: loadData,
        openEdit,
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-app flex-col bg-paper">
        <TopBar monthDate={monthDate} onPrev={prevMonth} onNext={nextMonth} />

        <main id="konten" className="flex-1 pb-28">
          {error && (
            <div
              role="alert"
              className="mx-4 mt-3 flex items-start gap-3 rounded-card border px-3.5 py-3"
              style={{ borderColor: 'var(--neg)', background: 'var(--neg-soft)' }}
            >
              <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-neg" />
              <p className="flex-1 text-xs leading-relaxed text-ink">{error}</p>
              <button
                type="button"
                onClick={() => void loadData()}
                className="shrink-0 rounded-chip px-2 py-1 text-xs font-semibold text-neg underline underline-offset-2"
              >
                Coba lagi
              </button>
            </div>
          )}

          {children}
        </main>

        <BottomNav onAdd={openAdd} />

        {sheetOpen && (
          <TransactionSheet
            categories={categories}
            accounts={accounts}
            initial={
              editingTx
                ? {
                    id: editingTx.id,
                    amount: editingTx.amount,
                    type: editingTx.type,
                    category_id: editingTx.category_id,
                    account_id: editingTx.account_id,
                    tx_date: editingTx.tx_date,
                    note: editingTx.note,
                  }
                : {
                    amount: 0,
                    type: 'exp',
                    category_id: null,
                    account_id: accounts[0]?.id || '',
                    tx_date: new Date().toISOString().split('T')[0],
                    note: '',
                  }
            }
            onClose={closeSheet}
            onSaved={saved}
          />
        )}
      </div>
    </DashboardContext.Provider>
  );
}
