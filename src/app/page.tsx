import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";

const FITUR = [
  {
    judul: "Kuesioner dinamis",
    deskripsi:
      "Pertanyaan disusun langsung oleh admin: skala 1–5, pilihan ganda, maupun teks bebas, tanpa perlu sentuh kode.",
  },
  {
    judul: "Rekap real-time",
    deskripsi:
      "Setiap respons yang masuk langsung terhitung pada indeks kepuasan, tren bulanan, dan rata-rata per pertanyaan.",
  },
  {
    judul: "Laporan PDF otomatis",
    deskripsi:
      "Laporan bulanan dan tahunan beserta grafiknya dapat diunduh dalam bentuk PDF siap cetak untuk pimpinan.",
  },
  {
    judul: "Akses QR untuk mitra",
    deskripsi:
      "Tiap mitra menerima tautan dan QR personal. Memindai QR berarti sudah masuk ke halaman survei tanpa password.",
  },
  {
    judul: "Berbasis web & PWA",
    deskripsi:
      "Tidak perlu instal aplikasi. Mitra cukup membuka tautan dari HP, dan dapat memasangnya bila diperlukan.",
  },
  {
    judul: "Catatan sentimen",
    deskripsi:
      "Saran tertulis otomatis ditandai positif, netral, atau negatif agar masukan penting tidak terlewat.",
  },
];

const PERAN = [
  {
    label: "Admin LPPM",
    deskripsi:
      "Mengelola kuesioner dan data mitra, mengirim undangan survei, serta memantau seluruh respons yang masuk.",
  },
  {
    label: "Pimpinan",
    deskripsi:
      "Melihat rekap indeks kepuasan dan mengunduh laporan periodik. Akses terbatas pada pembacaan data.",
  },
  {
    label: "Mitra",
    deskripsi:
      "Desa binaan, industri, dan instansi pemerintah yang mengisi survei melalui perangkat mobile masing-masing.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <SiteNavbar />

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/assets/background-unnes.jpeg"
            alt="Lingkungan kampus Universitas Negeri Semarang"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-28 sm:px-6 sm:py-36">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
            Lembaga Penelitian dan Pengabdian kepada Masyarakat
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Sistem Kepuasan Mitra LPPM
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Sarana bagi desa binaan, industri, dan instansi pemerintah untuk memberikan
            penilaian atas kerja sama yang telah berjalan — dan sarana bagi LPPM untuk
            membacanya secara jujur.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="inline-flex items-center bg-white px-6 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
            >
              Masuk Aplikasi <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#tentang"
              className="inline-flex items-center border border-white/50 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Tentang Sistem
            </Link>
          </div>
        </div>
      </section>

      {/* BARIS FAKTA */}
      <section className="border-b border-slate-200">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-slate-200 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {[
            ["3 jenis mitra", "Desa binaan, industri, instansi pemerintah"],
            ["Satu respons per mitra", "Data dijaga agar tetap representatif"],
            ["Rekap tanpa jeda", "Hasil terbaca seketika setelah dikirim"],
          ].map(([judul, sub]) => (
            <div key={judul} className="py-6 sm:px-8 sm:first:pl-0">
              <p className="font-serif text-lg font-bold">{judul}</p>
              <p className="mt-1 text-sm text-slate-600">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Tentang</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-snug sm:text-4xl">
              Masukan mitra adalah bahan evaluasi, bukan formalitas.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-slate-600">
            <p>
              Selama ini penilaian mitra terhadap layanan LPPM banyak dikumpulkan lewat
              kertas dan tabulasi manual. SIKAP memindahkan proses itu ke web: kuesioner
              dibuka daring, mitra mengisi dari ponsel masing-masing, dan hasilnya terkumpul
              dalam satu basis data yang sama.
            </p>
            <p>
              Untuk pimpinan, sistem ini menyajikan indeks kepuasan, tren dari waktu ke
              waktu, serta perbandingan antar jenis mitra — lengkap dengan laporan PDF yang
              dapat langsung dilampirkan ke dokumen akreditasi dan pelaporan institusi.
            </p>
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="scroll-mt-20 border-t border-slate-200 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Fitur</p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl font-bold leading-snug sm:text-4xl">
            Cukup apa adanya, tanpa fitur yang tidak terpakai.
          </h2>

          <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {FITUR.map((f, i) => (
              <div key={f.judul} className="border-t border-slate-300 pt-5">
                <p className="font-serif text-sm text-slate-400">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-semibold">{f.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERAN */}
      <section id="peran" className="scroll-mt-20 border-t border-slate-200 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Peran</p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-snug sm:text-4xl">
            Tiga peran, satu alur kerja.
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0">
            {PERAN.map((p, i) => (
              <div
                key={p.label}
                className={`md:px-10 ${i > 0 ? "md:border-l md:border-slate-200" : "md:pr-10"} ${
                  i === 0 ? "md:pl-0" : ""
                }`}
              >
                <p className="font-serif text-lg font-bold">{p.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PENUTUP */}
      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              Sudah menerima undangan survei?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Masuk dengan akun yang diberikan admin LPPM, atau pindai QR code dari email Anda.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            Halaman Masuk <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/unnes-logo.png"
              alt="Logo UNNES"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <p className="text-sm text-slate-600">
              LPPM Universitas Negeri Semarang
            </p>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} SIKAP LPPM · Dikembangkan dengan Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
