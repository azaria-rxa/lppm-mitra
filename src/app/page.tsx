import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardList,
  Eye,
  FileDown,
  QrCode,
  Smartphone,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteNavbar } from "@/components/site-navbar";

const FITUR = [
  {
    icon: ClipboardList,
    judul: "Kuesioner Dinamis",
    deskripsi:
      "Susun pertanyaan skala 1-5, pilihan ganda, dan teks bebas dengan builder drag-free yang cepat.",
  },
  {
    icon: BarChart3,
    judul: "Dashboard Real-time",
    deskripsi:
      "Indeks kepuasan, tren bulanan, dan breakdown per jenis mitra diperbarui otomatis tanpa refresh.",
  },
  {
    icon: Smartphone,
    judul: "Mobile-first & PWA",
    deskripsi:
      "Mitra mengisi survei dari HP dan dapat memasang aplikasi lewat Add to Home Screen.",
  },
  {
    icon: FileDown,
    judul: "Laporan PDF Otomatis",
    deskripsi:
      "Ekspor laporan periodik lengkap dengan grafik dalam satu klik, siap untuk pimpinan.",
  },
  {
    icon: QrCode,
    judul: "Akses Cepat QR Code",
    deskripsi:
      "Setiap mitra mendapat QR code personal — scan langsung masuk ke halaman survei tanpa password.",
  },
  {
    icon: Eye,
    judul: "Analisis Sentimen",
    deskripsi:
      "Jawaban teks bebas otomatis dikategorikan positif, netral, atau negatif untuk insight cepat.",
  },
];

const PERAN = [
  {
    icon: Building2,
    label: "Admin LPPM",
    warna: "from-blue-600 to-indigo-600",
    poin: ["Kelola kuesioner & mitra", "Kirim undangan email", "Pantau semua respons"],
  },
  {
    icon: Users,
    label: "Pimpinan",
    warna: "from-amber-500 to-orange-600",
    poin: ["Lihat dashboard grafik", "Unduh laporan PDF", "Akses read-only aman"],
  },
  {
    icon: Smartphone,
    label: "Mitra Eksternal",
    warna: "from-emerald-500 to-teal-600",
    poin: ["Isi survei via HP (PWA)", "Login cepat dengan QR", "Riwayat pengisian pribadi"],
  },
];

const STATISTIK = [
  { angka: "3", label: "Jenis Mitra" },
  { angka: "100%", label: "Digital & Paperless" },
  { angka: "Real-time", label: "Sinkronisasi Data" },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-white">
      <SiteNavbar />

      {/* HERO dengan background kampus UNNES */}
      <section className="relative -mt-16 flex min-h-[92dvh] items-center overflow-hidden">
        <Image
          src="/assets/background-unnes.jpeg"
          alt="Lingkungan kampus Universitas Negeri Semarang"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/55 to-slate-950/85" />

        <div className="relative mx-auto w-full max-w-5xl px-6 pb-20 pt-28 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Sistem Kepuasan Mitra LPPM · Universitas Negeri Semarang
          </p>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ukur Indeks Kepuasan Mitra{" "}
            <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
              Lebih Cepat & Terukur
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Platform survei digital untuk desa binaan, industri, dan instansi pemerintah.
            Satu aplikasi untuk dashboard admin di desktop dan pengisian survei di HP mitra.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/30">
                Masuk ke Aplikasi <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#fitur">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 px-8 text-white backdrop-blur hover:bg-white/20 hover:text-white"
              >
                Pelajari Fitur
              </Button>
            </Link>
          </div>

          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/5 py-5 backdrop-blur-sm">
            {STATISTIK.map((s) => (
              <div key={s.label} className="px-2">
                <p className="text-xl font-bold text-white sm:text-2xl">{s.angka}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-300 sm:text-xs">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Fitur Unggulan</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Semua yang Dibutuhkan Survei Kepuasan
            </h2>
            <p className="mt-3 text-slate-600">
              Dari penyusunan kuesioner hingga laporan PDF — satu sistem terintegrasi.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FITUR.map((f) => (
              <Card
                key={f.judul}
                className="group border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{f.judul}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.deskripsi}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PERAN PENGGUNA */}
      <section id="peran" className="scroll-mt-20 bg-gradient-to-b from-slate-50 to-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Peran Pengguna</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Satu Aplikasi, Tiga Peran
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PERAN.map((p) => (
              <Card key={p.label} className="overflow-hidden border-slate-200 transition-shadow hover:shadow-lg">
                <div className={`h-1.5 w-full bg-gradient-to-r ${p.warna}`} />
                <CardContent className="p-6">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${p.warna} text-white`}>
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{p.label}</h3>
                  <ul className="mt-3 space-y-2">
                    {p.poin.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 px-8 py-14 text-center shadow-2xl shadow-blue-900/20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-sky-400/20 blur-2xl" />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Siap Memberikan Masukan Terbaik?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Masuk sekarang dan bagikan penilaian Anda — masukan mitra adalah bekal
            perbaikan layanan LPPM.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                Masuk Sekarang <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-950 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <Image
                src="/assets/unnes-logo.png"
                alt="Logo UNNES"
                width={26}
                height={26}
                className="h-6 w-6 object-contain"
              />
            </span>
            <div>
              <p className="text-sm font-bold text-white">SIKAP LPPM</p>
              <p className="text-xs text-slate-400">Universitas Negeri Semarang</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} LPPM UNNES — SIKAP. Dibangun dengan Next.js sebagai
            unified responsive web app.
          </p>
        </div>
      </footer>
    </div>
  );
}
