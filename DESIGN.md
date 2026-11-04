# DESIGN.md, Duitsy

Arah desain ini ditulis dari instruksi pemilik pada 4 November 2026:

> "Saya tetap ingin mempertahankan gaya 'buku catatan' (font Caveat, garis putus-putus, warna gelap). Tugasmu merapikan strukturnya tanpa menghilangkan identitas visual tersebut. Anggap arah desainku adalah ENERGY 2 / RHYTHM 3 / MOTION 1."

Bagian yang ditandai **(turunan)** adalah detail teknis yang saya isi supaya arah itu bisa dijalankan. Bukan keputusan pemilik, jadi silakan koreksi. Bagian tanpa tanda berasal langsung dari instruksi di atas atau dari kondisi produk.

## Design Read

> Reading this as: aplikasi catatan keuangan pribadi untuk satu orang di Indonesia, dengan bahasa visual buku kas tulisan tangan di atas kertas gelap, dial ENERGY 2 / RHYTHM 3 / MOTION 1.

## Dials

| Dial | Nilai | Konsekuensi yang harus terlihat |
|---|---|---|
| ENERGY | 2 | Angka besar dan tulisan tangan memberi karakter, tapi tidak ada ilustrasi, gradien, atau ornamen. Energi datang dari tipografi dan kontras ukuran, bukan dekorasi. |
| RHYTHM | 3 | Empat halaman harus terbaca berbeda: Beranda rata kiri dengan angka besar, Wawasan komposisi tengah dengan cincin, Transaksi bertumpuk per hari, Akun satu kartu utama lalu baris ringkas. |
| MOTION | 1 | Hanya transisi warna 150ms pada hover dan fokus, plus masuknya sheet 160ms. Tidak ada scroll reveal, parallax, atau animasi berulang. Semua berhenti di `prefers-reduced-motion: reduce`. |

## Identitas

- **Metafora**: buku kas yang ditulis tangan. Bukan dashboard, bukan aplikasi bank.
- **Motif yang diulang**: garis putus-putus. Dipakai untuk memisahkan baris transaksi dan sebagai garis bawah judul bagian (`.section-head`). Satu gestur, dua tempat, konsisten di semua halaman.
- **Suara tipografi**: Caveat untuk angka dan judul, karena angka uang adalah hal yang paling sering ditulis tangan di buku kas. Poppins untuk teks isi supaya angka tetap mudah dibaca.
- **Fokus per layar**: setiap halaman punya satu angka atau satu elemen yang jelas paling besar. Beranda: total saldo. Wawasan: total kategori. Akun: akun terbesar. Transaksi: kelompok hari.

## Palet (turunan)

Peran, bukan nama buah. Semua pasangan teks di bawah sudah diukur terhadap latarnya dengan rumus kontras WCAG.

| Token | Nilai | Peran | Kontras |
|---|---|---|---|
| `paper` | `#0b0e14` | latar halaman | |
| `paper-2` | `#11151d` | kartu | |
| `paper-3` | `#182029` | kontrol, input, nav | |
| `line` | `#232d3c` | garis kartu dan pemisah tipis | |
| `line-strong` | `#5a6b84` | garis kontrol (input, tombol sekunder, grup tab): 3.56:1 di `paper` | |
| `ink` | `#eef2f8` | teks utama | 17.2:1 di `paper` |
| `ink-2` | `#c6cfdc` | teks pendukung | 12.3:1 |
| `ink-3` | `#9aa7ba` | teks meta 11 sampai 12px | 6.7:1 di `paper-3` |
| `accent` | `#6aa9ff` | satu aksen: aksi utama, tautan, fokus | 8.0:1 di `paper` |
| `accent-ink` | `#0b0e14` | teks di atas aksen | 8.0:1 di `accent` |
| `pos` | `#8ce99a` | uang masuk | 13.1:1 |
| `neg` | `#ffb199` | uang keluar, peringatan | 11.0:1 |

Aturan:

1. Tiga hue saja: biru (aksen/netral), hijau (masuk), coral (keluar). Nama warna lama di database dipetakan lewat `tintOf()`, jadi tidak ada migrasi data.
2. Tombol berisi aksen selalu memakai tinta gelap, bukan teks putih. Putih di atas `#6aa9ff` hanya 2.4:1 dan itu yang dulu gagal.
3. Tidak ada gradien latar. Kertasnya rata.

**Override R-21 (dicatat, bukan disembunyikan).** Aplikasi ini gelap saja, tanpa toggle terang. R-21 menyarankan toggle kalau produk tidak punya alasan kuat untuk tema tetap. Pemilik memilih gelap sebagai bagian identitas, jadi keputusan itu dipertahankan, dan seluruh artefak terang (manifest `background_color`, ikon maskable, `apple-touch-icon`, status bar iOS) disamakan ke gelap. Kalau nanti ingin tema terang, token di `:root` sudah siap dipindah ke `[data-theme="light"]`.

## Tipografi

| Peran | Font | Ukuran | Catatan |
|---|---|---|---|
| Angka utama | Caveat 500/700 | 34 sampai 52px | selalu `leading-none`, `tabular-nums` untuk nilai uang |
| Judul bagian | Caveat 500 | 26px | `leading-none` + garis putus-putus |
| Judul sheet | Poppins 600 | 14px | |
| Teks isi | Poppins 400 | 14px | |
| Meta | Poppins 400 | 12px | `ink-3` |
| Label | Poppins 500 | 11px | huruf kalimat, bukan UPPERCASE |

Dihapus: label uppercase bertracking 9 sampai 10px. Teks di bawah 11px tidak dipakai lagi.

## Bentuk, jarak, elevasi (turunan)

- Radius: `6px` chip, `10px` field/tombol, `14px` kartu, `20px` sheet. Lingkaran penuh hanya untuk FAB dan penanda "hari ini" di kalender. Kontrol tidak berbentuk pill supaya tidak tertukar dengan badge.
- Jarak halaman: gutter 16px. Jarak antar bagian 28px, antar baris 12px. Angka ini sengaja tidak seragam di semua tempat supaya ritme tidak monoton.
- Elevasi: shadow hanya di sheet dan FAB, karena keduanya memang mengambang di atas halaman. Kartu memakai border, bukan shadow.

## Gerak

- Transisi 150ms pada `background-color`, `border-color`, `color`.
- Sheet masuk 160ms dari bawah.
- Tidak ada animasi yang berjalan terus. `prefers-reduced-motion: reduce` mematikan semuanya.

## Alasan satu baris (R-31)

- **Warna gelap**: identitas yang diminta pemilik, cocok untuk pemakaian malam hari.
- **Tiga hue**: cukup untuk membedakan masuk, keluar, dan aksi, tanpa membuat daftar transaksi jadi pelangi.
- **Caveat**: satu-satunya alasan buku kas terasa seperti buku kas.
- **Garis putus-putus**: meniru garis buku tulis, dan memisahkan baris tanpa menambah border tebal.
- **Angka besar di Beranda**: saldo adalah pertanyaan pertama pemilik aplikasi.
- **Kartu hanya untuk ringkasan**: daftar transaksi lebih mudah dibaca sebagai baris, bukan kartu.
- **Ikon inline**: tidak ada dependensi jaringan, dan bentuknya bisa dipilih sesuai fungsi.
- **Wawasan monokrom**: urutan peringkat lebih jujur ditunjukkan oleh tingkat kecerahan daripada tujuh warna acak.

## Catatan aset yang belum dikonfirmasi (R-23)

Ikon aplikasi masih memakai siluet angsa watercolor yang sudah ada di repo. Saya hanya menaruhnya di atas piringan gelap supaya terbaca di layar gelap dan di splash PWA. Kalau angsa ini bukan aset resmi, ganti dengan wordmark "Duitsy" atau placeholder `[LOGO]`. Ini satu-satunya aset yang belum punya jawaban dari pemilik.
