import { createClient } from '@/lib/supabase/client';
import type { Category, Account, Transaction } from '@/lib/types';

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('categories').select('*').order('sort_order');
  if (error) throw error;
  return data as Category[];
}

export async function getAccounts(): Promise<Account[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('account_balances')
    .select('account_id, name, icon, ramp, type, goal, opening_balance, balance');
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.account_id,
    name: row.name,
    icon: row.icon,
    ramp: row.ramp,
    type: row.type,
    goal: Number(row.goal),
    opening_balance: Number(row.opening_balance),
    balance: Number(row.balance),
  }));
}

export async function updateAccountOpeningBalance(accountId: string, openingBalance: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from('accounts')
    .update({ opening_balance: openingBalance })
    .eq('id', accountId);
  if (error) throw error;
}

export async function getTransactions(monthStart: string, monthEnd: string): Promise<Transaction[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('id, amount, type, category_id, account_id, tx_date, note')
    .gte('tx_date', monthStart)
    .lte('tx_date', monthEnd)
    .order('tx_date', { ascending: false });
  if (error) throw error;
  return (data || []).map((row: any) => ({ ...row, amount: Number(row.amount) }));
}

export async function createTransaction(tx: Omit<Transaction, 'id'>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Sesi tidak ditemukan. Coba masuk lagi.');

  const { error } = await supabase.from('transactions').insert({
    ...tx,
    user_id: user.id,
    tx_date: tx.tx_date || new Date().toISOString().split('T')[0],
  });
  if (error) throw error;
}

export async function createAccount(account: {
  name: string;
  icon: string;
  ramp: string;
  type: 'cash' | 'savings' | 'debt';
  opening_balance: number;
  goal: number;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Sesi tidak ditemukan. Coba masuk lagi.');

  const { error } = await supabase.from('accounts').insert({ ...account, user_id: user.id });
  if (error) throw error;
}

/**
 * Akun hanya bisa dihapus kalau tidak punya transaksi, karena FK-nya
 * on delete cascade. Cek dulu supaya histori transaksi tidak hilang diam-diam.
 */
export async function deleteAccount(accountId: string) {
  const supabase = createClient();
  const { count, error: countError } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .eq('account_id', accountId);
  if (countError) throw countError;

  if (count && count > 0) {
    throw new Error(
      `Akun ini masih punya ${count} transaksi. Pindahkan atau hapus transaksinya dulu.`,
    );
  }

  const { error } = await supabase.from('accounts').delete().eq('id', accountId);
  if (error) throw error;
}

export async function updateTransaction(id: string, tx: Partial<Omit<Transaction, 'id'>>) {
  const supabase = createClient();
  const { error } = await supabase.from('transactions').update(tx).eq('id', id);
  if (error) throw error;
}

export async function deleteTransaction(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
}
