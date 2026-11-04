# Taruna Prima — Mockup Website Bimbel Taruna

Ini adalah **mockup** website untuk klien bimbel taruna (persiapan seleksi Akmil, Akpol, AAL, AAU, Bintara, dan Sekolah Kedinasan). Tujuannya untuk presentasi desain, struktur konten, dan alur konversi. Ini **bukan situs resmi** dan tidak berafiliasi dengan TNI, Polri, maupun panitia penerimaan.

## Placeholder yang harus diganti

Nama **"Taruna Prima"** adalah placeholder (nama klien belum diketahui). Cara rename: cari dan ganti `Taruna Prima` / `TARUNA PRIMA` di semua file `.html` (dan `favicon.svg` jika ada teks, serta JSON-LD di `index.html`).

Daftar placeholder yang harus diganti sebelum go-live:

- **Nomor WhatsApp** `62xxxxxxxxxx` — ada di setiap link `wa.me` (cari `GANTI: nomor WhatsApp`). Juga nomor tampilan `+62 xxx-xxxx-xxxx` di footer.
- **Email** `halo@tarunaprima.example` (footer dan JSON-LD).
- **Alamat** — saat ini tertulis "Alamat cabang segera diumumkan".
- **Angka statistik** di hero (1.200+ siswa, 48 tryout/tahun, 6 jalur, rating 4.8/5) — hanya contoh, tandai "*Angka contoh untuk mockup".
- **Harga paket** (Rp 2.450.000 / 7.900.000 / 18.500.000) dan skema cicilan — contoh.
- **Testimoni** — nama, target, dan kutipan adalah contoh. Ganti dengan testimoni asli **dengan izin tertulis**.
- **Syarat & Ketentuan garansi ikut ulang** — wajib direview penasihat hukum sebelum dipublikasikan.
- **Link sosial media** (Instagram, YouTube, TikTok) — saat ini `href="#"`.
- **Domain** `https://bimbel-taruna.vercel.app` (URL mockup sementara) — ada di `<link rel="canonical">`, `og:url`, `og:image`, dan JSON-LD semua halaman. Ganti dengan domain final klien.

## Struktur file

```
index.html          Landing page lengkap (hero, program, keunggulan, tahapan, harga, garansi, testimoni, FAQ, CTA, footer)
program.html        Halaman "Segera Hadir"
tryout.html         Halaman "Segera Hadir"
alumni.html         Halaman "Segera Hadir"
blog.html           Halaman "Segera Hadir"
tentang.html        Halaman "Segera Hadir"
kontak.html         Halaman "Segera Hadir"
favicon.svg         Favicon (bentuk perisai generik, bukan lambang resmi)
vercel.json         Konfigurasi deploy Vercel (cleanUrls, trailingSlash, cache /assets)
assets/
  css/style.css     Hasil build Tailwind (WAJIB di-commit)
  js/main.js        Menu mobile, header sticky, reveal animasi, counter, tahun footer
  hero.webm         Video latar hero (sumber utama, WebM)
  hero.mp4          Video latar hero (fallback, MP4)
  hero-poster.webp  Poster hero (ditampilkan sebelum video main, atau jika video gagal/reduced motion)
  hero-poster.jpg   Poster hero versi JPG
  hero.webp         Gambar hero lama (tidak lagi direferensikan; disimpan sebagai cadangan)
  logos/*.webp      Logo ilustrasi instansi (320x320, transparan) — lihat catatan di bawah
  og-image.jpg      Gambar Open Graph (1200x630)
src/input.css       Sumber Tailwind (@tailwind + komponen kustom @layer)
tailwind.config.js  Tema warna (navy, olive, gold) dan font (Oswald, Inter)
package.json        Dependency Tailwind CSS v3 dan script build
```

Header dan footer disalin identik di setiap halaman (tanpa include JS). Jika mengubah menu atau footer, ubah di **semua** file HTML.

## Cara edit konten

- Edit langsung teks di file HTML terkait. Semua teks dalam Bahasa Indonesia.
- Setiap link WhatsApp memiliki komentar `<!-- GANTI: ... -->` di dekatnya.
- Link navigasi memakai URL bersih (`/program`, `/tryout`, dst.) sesuai `cleanUrls` di Vercel.

## Build ulang CSS

Tailwind meng-compile class yang terpakai di HTML dan JS menjadi `assets/css/style.css` (minified).

```bash
npm install
npm run build:css
```

**Wajib dijalankan setiap kali mengganti atau menambah class Tailwind**, lalu commit `assets/css/style.css` bersama perubahan HTML. Vercel tidak menjalankan build step, jadi file CSS harus sudah ter-commit.

## Preview lokal

```bash
npx serve .
# atau
python3 -m http.server 8000
```

Buka `http://localhost:8000`. Catatan: dengan server statis biasa, URL seperti `/program` mungkin perlu `program.html`. `npx serve .` biasanya sudah menangani clean URL.

## Deploy ke Vercel

1. Import repository ke Vercel sebagai proyek **Other / Static** (tanpa framework).
2. Build command: kosongkan. Output directory: `.` (root).
3. `vercel.json` sudah mengatur `cleanUrls: true` dan `trailingSlash: false`.

## Catatan

- Video dan poster hero dibuat dengan AI. Tidak ada lambang atau insignia resmi TNI/Polri/Akmil/Akpol/AAL/AAU di video maupun poster.
- **Logo di `assets/logos/` adalah logo ilustrasi/stylized, bukan file resmi.** Sebelum produksi, wajib memperoleh izin atau aset resmi dari masing-tiap instansi (TNI AD/AL/AU, Polri, dan lembaga kedinasan terkait). AAL belum memiliki file logo dan saat ini ditampilkan sebagai lencana teks/ikon.
- Tema terang (white/sand) dengan aksen navy, emas, dan olive. Hero, kartu harga unggulan, dan footer tetap gelap.
- Video hero diputar otomatis dan senyap. Jika `prefers-reduced-motion` aktif, video dihentikan dan poster statis yang ditampilkan.
- Font Oswald dan Inter dimuat dari Google Fonts.
- Animasi menghormati `prefers-reduced-motion`.
