# Duitsy, Catatan Keuangan

Aplikasi pencatatan pengeluaran dan pemasukan pribadi. Next.js (App Router) + Supabase (Auth + Postgres).
Multi-user: setiap orang hanya bisa melihat datanya sendiri lewat Row Level Security.

## Fitur

- Auth (daftar, masuk, keluar) lewat Supabase, email dan kata sandi.
- CRUD transaksi penuh, tersimpan di database, bukan localStorage.
- Data terpisah per user (RLS di database).
- Saldo akun dihitung dari view `account_balances`, jadi tidak bisa melenceng dari transaksi.
- Halaman: Beranda, Wawasan (pecahan per kategori), Transaksi (daftar + kalender), Akun (saldo + target).
- Ekspor transaksi bulan terpilih ke CSV, jalan sepenuhnya di browser.
- Tanggal mengikuti tanggal perangkat, bukan UTC server.
- PWA: bisa dipasang ke home screen, splash dan tema gelap.
- Tema gelap saja, sesuai arah desain di `DESIGN.md`.

## Setup

### 1. Buat project Supabase

1. Buka https://supabase.com, buat project baru (tier gratis cukup).
2. Buka SQL Editor, tempel seluruh isi `supabase/schema.sql`, lalu Run.
3. Buka Project Settings > API, salin `Project URL` dan `anon public key`.

### 2. Environment

```bash
cp .env.example .env.local
```

Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Variabel Sentry opsional; tanpa DSN,
tidak ada error yang dikirim ke mana pun, dan aplikasi tetap jalan.

### 3. Jalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000, aplikasi akan mengarahkan ke halaman masuk.

### 4. Konfirmasi email (opsional)

Supabase secara default meminta konfirmasi email sebelum akun bisa dipakai. Untuk pemakaian pribadi atau
testing, matikan di Authentication > Providers > Email > Confirm email. Untuk pemakaian bersama, biarkan
menyala dan pastikan SMTP aktif.

### 5. Deploy

Push ke GitHub, import di https://vercel.com/new, isi dua variabel Supabase yang sama, deploy.

## Struktur

```
app/
  layout.tsx              font, metadata, skip link
  globals.css             token warna, fokus, gaya dasar
  login/, signup/         halaman auth
  dashboard/
    layout.tsx            shell + metadata
    page.tsx              Beranda
    wawasan/              pecahan per kategori
    transaksi/            daftar + kalender + ekspor CSV
    akun/                 saldo dan target
components/
  DashboardShell.tsx      state dan context untuk semua tab
  Sheet.tsx               dialog berbasis <dialog> native
  ConfirmDialog.tsx       konfirmasi hapus
  TransactionSheet.tsx    tambah/ubah transaksi
  AccountSheet.tsx        tambah/ubah akun
  Icon.tsx                set ikon inline
  TopBar.tsx, BottomNav.tsx, TransactionRow.tsx, EmptyState.tsx, LoadingRows.tsx, CurrencyInput.tsx, IconTintPicker.tsx
lib/
  supabase/client.ts      Supabase client browser (singleton)
  supabase/server.ts      Supabase client server component
  queries.ts              CRUD ke database
  auth.ts                 deteksi dan pemulihan sesi
  types.ts                tipe, format rupiah, tint kategori
  date.ts                 rentang bulan berdasarkan waktu lokal
  export.ts               ekspor CSV
DESIGN.md                 arah desain, palet, dial, alasan keputusan
```

## Menambah kategori

Insert baris ke tabel `categories` lewat Supabase Table Editor, atau tambahkan di `supabase/schema.sql`
pada bagian `insert into categories`. Kategori bersifat global, dipakai semua user. Kolom `icon` menerima
nama ikon dari `components/Icon.tsx` (nama lama `ti-...` tetap diterima), dan kolom `ramp` dipetakan ke
tiga tint: `blue`, `green`, `coral`.

## Catatan skala

Setup ini memakai Supabase tier gratis dan Vercel hobby, lebih dari cukup untuk 1 sampai 5 orang. Kalau
suatu saat dipakai ratusan orang, cukup upgrade tier Supabase tanpa mengubah kode.
