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
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/55 to-blue-950/40" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-28 sm:px-6 sm:py-36">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
            <span className="h-px w-8 bg-amber-400" />
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
              className="group inline-flex items-center rounded-full bg-gradient-to-b from-amber-400 to-amber-500 px-6 py-3 text-sm font-semibold text-blue-950 shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/30"
            >
              Masuk Aplikasi{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#tentang"
              className="inline-flex items-center rounded-full border border-white/50 px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              Tentang Sistem
            </Link>
          </div>
        </div>
      </section>

      {/* BARIS FAKTA */}
      <section className="gradient-unnes">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {[
            ["3 jenis mitra", "Desa binaan, industri, instansi pemerintah"],
            ["Satu respons per mitra", "Data dijaga agar tetap representatif"],
            ["Rekap tanpa jeda", "Hasil terbaca seketika setelah dikirim"],
          ].map(([judul, sub]) => (
            <div key={judul} className="py-6 sm:px-8 sm:first:pl-0">
              <p className="font-serif text-lg font-bold text-white">{judul}</p>
              <p className="mt-1 text-sm text-blue-200">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="scroll-mt-20 bg-gradient-to-b from-blue-50/60 to-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-800">Tentang</p>
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
      <section id="fitur" className="scroll-mt-20 border-t border-blue-100 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-800">Fitur</p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl font-bold leading-snug sm:text-4xl">
            Cukup apa adanya, tanpa fitur yang tidak terpakai.
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FITUR.map((f, i) => (
              <div
                key={f.judul}
                className="card-hover group rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-900/20"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-900 to-blue-700 font-serif text-sm font-bold text-amber-300 transition-transform duration-200 group-hover:scale-110">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-semibold text-blue-950">{f.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERAN */}
      <section id="peran" className="scroll-mt-20 border-t border-blue-100 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-800">Peran</p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-snug sm:text-4xl">
            Tiga peran, satu alur kerja.
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0">
            {PERAN.map((p, i) => {
              const dot = ["bg-blue-800", "bg-emerald-600", "bg-amber-500"][i];
              return (
                <div
                  key={p.label}
                  className={`group md:px-10 ${i > 0 ? "md:border-l md:border-blue-100" : "md:pr-10"} ${
                    i === 0 ? "md:pl-0" : ""
                  }`}
                >
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${dot} transition-transform group-hover:scale-125`} />
                  <p className="mt-3 font-serif text-lg font-bold text-blue-950">{p.label}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.deskripsi}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PENUTUP */}
      <section className="gradient-unnes py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              Sudah menerima undangan survei?
            </h2>
            <p className="mt-2 text-sm text-blue-200">
              Masuk dengan akun yang diberikan admin LPPM, atau pindai QR code dari email Anda.
            </p>
          </div>
          <Link
            href="/login"
            className="group inline-flex shrink-0 items-center rounded-full bg-gradient-to-b from-amber-400 to-amber-500 px-6 py-3 text-sm font-semibold text-blue-950 shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/30"
          >
            Halaman Masuk{" "}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-blue-950 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
              <Image
                src="/assets/unnes-logo.png"
                alt="Logo UNNES"
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
            </span>
            <p className="text-sm text-blue-200">
              LPPM Universitas Negeri Semarang
            </p>
          </div>
          <p className="text-xs text-blue-400">
            © {new Date().getFullYear()} SIKAP LPPM · Dikembangkan dengan Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
