# SIKAP-LPPM

**SIKAP-LPPM** — *Sistem Kepuasan Mitra LPPM*. Platform umpan balik digital untuk mengukur
indeks kepuasan mitra eksternal (desa binaan, industri, instansi pemerintah) yang bekerja sama
dengan Lembaga Penelitian dan Pengabdian kepada Masyarakat (LPPM).

Dibangun sebagai **unified responsive web app**: satu codebase Next.js yang berfungsi sebagai
dashboard admin (desktop) sekaligus aplikasi pengisian survei untuk mitra (mobile/PWA) —
tanpa aplikasi mobile native terpisah.

---

## Arsitektur "Unified Responsive Web App"

```
┌────────────────────────────────────────────────────────────┐
│                     Satu Next.js 15 App                    │
│                                                            │
│   /dashboard, /kuesioner, /mitra, /laporan                 │
│        └── Admin LPPM (desktop-first, sidebar layout)      │
│                                                            │
│   /survei, /survei/[id], /riwayat                          │
│        └── Mitra (mobile-first, bottom-nav + PWA)          │
│                                                            │
│   Satu MySQL + Satu Prisma  →  data real-time sinkron     │
└────────────────────────────────────────────────────────────┘
```

Beberapa keputusan arsitektur penting:

1. **Satu codebase, dua UX berbeda** — menggunakan *route group* Next.js:
   - `src/app/(admin)/` → layout sidebar untuk admin/pimpinan (desktop-optimized).
   - `src/app/(mitra)/` → layout *bottom navigation* mobile-first dengan target `max-w-lg`.
   - Keduanya berbagi database, auth, dan komponen UI (shadcn/ui) yang sama.
2. **Server-first dengan ISR-friendly API** — sebagian besar logika (RBAC, validasi Zod,
   perhitungan laporan, sentiment tagging) berjalan di server. Halaman admin memakai **SWR**
   dengan `refreshInterval` sehingga respons yang baru disubmit mitra langsung tampil tanpa
   refresh manual (sinkronisasi soft-real-time).
3. **Auth JWT berbasis role** — NextAuth (Credentials) + JWT strategy. Password di-hash dengan
   **bcrypt**. Middleware (edge runtime) memproteksi route berdasarkan peran via `getToken`,
   sehingga RBAC berlaku di sisi client *dan* server (API routes diperiksa lagi dengan
   `requireUser([...roles])`).
4. **PWA tanpa aplikasi native** — `next-pwa` + `manifest.json` + ikon. Mitra menekan
   **"Add to Home Screen"** sehingga survei terasa seperti aplikasi mobile asli.
5. **Laporan & PDF dihasilkan server-side** — `@react-pdf/renderer` merender dokumen laporan
   (dengan grafik batang sederhana) sebagai buffer PDF di API route; data dihitung langsung
   dari database sehingga tidak terjadi perbedaan data antara dashboard dan cetakan.

---

## Tech Stack

| Area | Teknologi |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | MySQL 8 |
| ORM | Prisma |
| Auth | NextAuth.js + bcrypt (RBAC: ADMIN / PIMPINAN / MITRA) |
| Grafik | Recharts |
| PDF | @react-pdf/renderer |
| PWA | next-pwa |
| Validasi | Zod + React Hook Form |
| Real-time | SWR (auto-refresh) |
| Email | Nodemailer (undangan & reminder) |

---

## Kebutuhan Sistem (Prerequisites)

- Node.js 20+ dan npm
- MySQL 8 (disarankan via Docker) — atau instance MySQL mana pun
- (Opsional) Docker Desktop untuk menjalankan MySQL dengan sekali perintah

## Cara Menjalankan

> Jalankan semua perintah dari akar repositori ini.

### 1. Clone repository (mengunduh project dari GitHub)

**Clone** artinya mengunduh salinan lengkap repositori ini — seluruh kode,
riwayat commit, dan cabang — langsung dari GitHub ke komputer Anda. Ini langkah
pertama jika Anda belum memiliki filenya sama sekali.

```bash
git clone https://github.com/azaria-rxa/lppm-mitra.git
cd lppm-mitra
```

Perintah di atas membuat folder baru bernama `lppm-mitra` berisi seluruh isi
repositori. Setelah clone selesai, lanjutkan ke langkah instalasi di bawah.

### 2. Instal dependensi

```bash
npm install
```

Perintah `postinstall` otomatis menjalankan `prisma generate`.

### 3. Jalankan MySQL (opsional, via Docker)

```bash
docker compose up -d
```

Perintah ini membuat database `sikap_lppm` (user `root`, password `rootpass-dev`) di port `3306`.
Jika Anda sudah punya MySQL sendiri, lewati langkah ini dan sesuaikan `.env`.

### 4. Konfigurasi environment

```bash
cp .env.example .env
```

Lalu isi `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` (mis. hasil
`openssl rand -base64 32`). Jika ingin email benar-benar terkirim, isi `SMTP_*`
(mis. akun gratis di https://ethereal.email).

### 5. Sinkronkan skema ke database & seed data contoh

**Opsi A — Prisma (disarankan untuk pengembangan):**

```bash
npm run prisma:push    # atau npm run prisma:migrate untuk migration file resmi
npm run prisma:seed    # membuat akun default + kuesioner + contoh respons
```

**Opsi B — Import dump SQL siap pakai:**

File `database/sikap_lppm.sql` berisi struktur tabel **plus data contoh**
(akun demo, 1 kuesioner, dan beberapa respons) sehingga aplikasi langsung bisa
dicoba tanpa menjalankan seed.

```bash
# via Docker (container harus sudah berjalan)
docker exec -i sikap-lppm-mysql mysql -uroot -prootpass-dev < database/sikap_lppm.sql

# atau via mysql client lokal
mysql -u root -p < database/sikap_lppm.sql
```

Dump ini membuat ulang database `sikap_lppm` dari nol (`DROP DATABASE IF EXISTS`
di awal file), jadi hati-hati jika menjalankannya di database yang sudah berisi data.
Setelah import, jalankan tetap `npx prisma generate` agar Prisma Client tersedia.

### 6. Jalankan aplikasi

```bash
npm run dev            # Development  -> http://localhost:3000
npm run build && npm run start   # Production (termasuk build PWA service worker)
```

### Akun Default (hasil seed)

| Peran | Email | Password |
| --- | --- | --- |
| Admin LPPM | `admin@lppm.ac.id` | `Admin123!` |
| Pimpinan (read-only) | `pimpinan@lppm.ac.id` | `Pimpinan123!` |
| Mitra (contoh) | `desabinaan.sejahtera@example.com` | `Mitra123!` |

> Ubah password default sebelum digunakan di lingkungan nyata.

---

## Menyinkronkan dengan GitHub (`git pull`)

### Buat apa `git pull`?

Repositori ini bisa dikerjakan oleh beberapa orang (atau dari beberapa komputer).
Ketika seseorang melakukan `git push`, perubahan tersimpan di GitHub — tetapi
komputer Anda **tidak otomatis ikut berubah**. Di sinilah `git pull` berperan:

> **`git pull` mengambil commit terbaru dari GitHub dan menggabungkannya ke
> kode di komputer Anda**, sehingga versi lokal selalu sama dengan versi
> terbaru di repositori.

Kapan sebaiknya dilakukan:
- **Sebelum mulai bekerja** setiap hari, agar Anda mengedit kode dari versi terbaru.
- **Sebelum melakukan `git push`**, untuk memastikan tidak ada perubahan rekan yang belum tergabung.
- Setiap kali ada pemberitahuan bahwa "sudah ada update di repo".

### Cara menggunakan

```bash
# pastikan berada di dalam folder project
cd lppm-mitra

git pull origin main
```

Perintah ini mengunduh commit baru dari cabang `main` di GitHub lalu langsung
menggabungkannya. Jika muncul editor teks meminta pesan merge, simpan saja dan
tutup (biasanya cukup menekan `:wq` lalu Enter di vim).

Setelah pull selesai, sebaiknya jalankan kembali:

```bash
npm install          # jika ada dependensi baru yang ditambahkan rekan
npm run prisma:push  # jika ada perubahan skema database
```

### Jika terjadi konflik

Konflik muncul ketika Anda dan orang lain mengubah baris yang sama. Git akan
menandai bagian tersebut dengan `<<<<<<<`, `=======`, dan `>>>>>>>`. Cara
penyelesaian singkatnya:

1. Buka file yang disebutkan git, putuskan kode mana yang dipertahankan, lalu hapus penanda konfliknya.
2. Lanjutkan dengan:

```bash
git add .
git commit -m "resolve merge conflict"
```

Tips: lakukan `git pull` secara rutin agar perbedaan selalu kecil dan konflik mudah diselesaikan.

---

## Struktur Project

```
src/
├── app/
│   ├── (admin)/                     # Dashboard admin (sidebar desktop)
│   │   ├── dashboard/page.tsx       # Grafik kepuasan + statistik real-time
│   │   ├── kuesioner/page.tsx       # CRUD builder kuesioner dinamis
│   │   ├── mitra/page.tsx           # CRUD data mitra + QR code
│   │   ├── laporan/page.tsx         # Laporan periodik + export PDF
│   │   └── layout.tsx
│   ├── (mitra)/                     # Aplikasi mitra (mobile-first, bottom nav)
│   │   ├── survei/page.tsx          # Daftar survei aktif
│   │   ├── survei/[id]/page.tsx     # Pengisian survei dinamis
│   │   ├── riwayat/page.tsx         # Riwayat pengisian sendiri
│   │   └── layout.tsx
│   ├── api/                         # REST API + NextAuth (semua tervalidasi Zod)
│   │   ├── auth/[...nextauth]/
│   │   ├── kuesioner/{[id]}/{isi}/
│   │   ├── survei/{tersedia,riwayat}/
│   │   ├── mitra/{[id]}/
│   │   ├── laporan/{data,periode,pdf}/
│   │   ├── notifikasi/  reminder/  qrcode/[id]/
│   ├── login/page.tsx               # Login + akses cepat via QR token
│   ├── layout.tsx                   # Root layout (SessionProvider + Toaster)
│   └── page.tsx                     # Landing page
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── admin/                       # kuesioner-builder, grafik-kepuasan, form-mitra, ...
│   └── mitra/                       # form-survei-dinamis, kartu-riwayat, mitra-nav
├── lib/
│   ├── prisma.ts  auth.ts  session.ts  api.ts
│   ├── rbac.ts  validations.ts  laporan.ts
│   ├── sentiment.ts  email.ts  rate-limit.ts  utils.ts
├── types/   hooks/
├── middleware.ts                    # RBAC route protection (edge)
prisma/
├── schema.prisma                    # MySQL + model User, Mitra, Kuesioner, dst.
└── seed.ts                          # Seed data contoh
docker-compose.yml                   # MySQL 8 untuk pengembangan
```

---

## Fitur

### Fitur Utama
1. **Kuesioner dinamis** — builder membentuk pertanyaan bertipe **Skala 1-5**, **Pilihan Ganda**,
   dan **Teks Bebas**, dengan pengurutan (naik/turun), edit, dan status aktif/nonaktif.
2. **Pengisian survei mobile-first** — form dirender sesuai tipe pertanyaan, progress bar,
   tombol skor besar yang mudah di-tap, validasi wajib (Zod + React Hook Form), dan keyakinan
   submit sekali per mitra per kuesioner (dicegah di database via unique constraint).
3. **Dashboard & indeks kepuasan** — Recharts menampilkan tren bulanan, breakdown per jenis
   mitra, dan skor rata-rata keseluruhan. Data di-refresh otomatis (SWR) sehingga hasil
   submit mitra langsung tampil.
4. **Laporan otomatis + export PDF** — pilih periode (bulanan/tahunan), lihat ringkasan,
   lalu unduh PDF ber-grafik.
5. **Real-time sync** — satu database/backend; API ditandai `Cache-Control: no-store` dan
   halaman dashboard menggunakan SWR `refreshInterval`.
6. **PWA** — `manifest.json`, ikon, dan service worker (`public/sw.js`) agar mitra bisa
   *Add to Home Screen*.

### Fitur Tambahan (implemented)
1. **Notifikasi email otomatis** — tombol "Kirim Undangan Email" di halaman kuesioner mengirim
   email ke semua mitra yang punya akun (Nodemailer). Riwayat tersimpan di tabel `NotifikasiEmail`.
2. **Reminder otomatis** — endpoint `/api/reminder` (dilindungi `x-cron-secret`) dapat dipanggil
   scheduler eksternal untuk mengingatkan mitra yang belum mengisi selama N hari
   (`REMINDER_AFTER_DAYS`, default 3).
3. **QR Code per mitra** — tiap mitra mendapat QR (`/api/qrcode/[id]`) yang membuka link
   `/login?token=...&callbackUrl=/survei`; pengguna masuk otomatis tanpa mengetik password
   (magic-login berbasis `Mitra.qrToken`).
4. **Sentiment tagging otomatis** — jawaban teks bebas dikategorikan **POSITIF / NETRAL / NEGATIF**
   menggunakan analisis kata kunci Bahasa Indonesia (`src/lib/sentiment.ts`) saat submit,
   lalu ditampilkan di laporan.

---

## RBAC & Keamanan

| Peran | Akses |
| --- | --- |
| **ADMIN** | Full: kelola kuesioner & mitra, kirim undangan, lihat semua laporan, export PDF |
| **PIMPINAN** | Read-only: dashboard grafik & laporan, export PDF |
| **MITRA** | Isi survei aktif yang ditugaskan + riwayat pengisian sendiri |

Pengamanan berlapis:
- **Middleware** (`src/middleware.ts`) memproteksi route halaman sesuai peran (edge runtime).
- **Setiap API route** memeriksa sesi + peran lagi (`requireUser`) sebagai pertahanan kedua.
- **Password di-hash** dengan bcrypt (`bcryptjs`).
- **Validasi input server-side** dengan Zod di semua route API, bukan hanya di client.
- **Rate limiting** sederhana (in-memory fixed window) pada `/api/survei` — atur lewat
  `RATE_LIMIT_MAX` (default 5 post/menit per IP).
- **Proteksi CSRF** bawaan NextAuth untuk form login.
- Sekret (SMTP, cron, NextAuth) hanya di `.env` dan ditolak dari git.

---

## Scripts

```bash
npm run dev            # Server dev (http://localhost:3000)
npm run build          # Build produksi (generate service worker PWA)
npm run start          # Jalankan hasil build
npm run typecheck      # tsc --noEmit
npm run lint           # next lint
npm run prisma:push    # Sinkronkan schema ke database
npm run prisma:migrate # Buat & jalankan migration
npm run prisma:seed    # Seed data contoh
npm run prisma:studio  # Buka Prisma Studio
```

---

## Catatan Deployment

- **Production build** harus dijalankan dengan `npm run build` agar service worker PWA
  (`public/sw.js`) ter-generate.
- **Server didukung Node.js runtime** (route PDF menggunakan `@react-pdf/renderer`).
- Rate limiter berbasis memori cukup untuk single-instance; pada multi-instance/disparking
  sebaiknya ganti dengan store terdistribusi (mis. Redis).
- Konfigurasikan `NEXTAUTH_URL` sesuai domain produksi.

---

*Dokumen ini dapat dijadikan bagian dari Dokumen Teknis & User Guide. © LPPM — SIKAP.*