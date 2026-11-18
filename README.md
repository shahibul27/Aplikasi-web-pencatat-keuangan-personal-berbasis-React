# Dompetku

Dashboard pencatat keuangan pribadi berbahasa Indonesia. Catat pemasukan dan pengeluaran, lihat ringkasan saldo, serta cari dan filter riwayat transaksi dengan tampilan yang responsif.

## Fitur

- Ringkasan saldo, total pemasukan, dan total pengeluaran.
- Tambah dan hapus transaksi.
- Pencarian serta filter transaksi berdasarkan jenisnya.
- Penyimpanan otomatis di browser menggunakan `localStorage`.
- Informasi kurs USD ke rupiah yang diperbarui dari layanan kurs publik.
- Tampilan responsif untuk desktop dan perangkat seluler.

## Menjalankan proyek

Pastikan Node.js dan npm sudah terpasang, lalu jalankan:

```bash
npm install
npm run dev
```

Untuk memeriksa hasil build produksi:

```bash
npm run build
npm run preview
```

## Teknologi

- React
- Vite
- CSS

Data transaksi tersimpan secara lokal di browser dan tidak dikirim ke server. Informasi kurs memerlukan koneksi internet.

## Belajar dari proyek ini

Lihat [Catatan Belajar](./CATATAN-BELAJAR.md) untuk penjelasan alur data, komponen React, state dan props, formulir, `localStorage`, kurs API, CSS responsif, serta latihan mandiri.
"# Aplikasi-web-pencatat-keuangan-personal-berbasis-React" 
