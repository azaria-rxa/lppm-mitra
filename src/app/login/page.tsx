import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Smartphone, BarChart3 } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Masuk",
};

const SOROTAN = [
  {
    icon: ShieldCheck,
    judul: "Akses berbasis peran",
    deskripsi: "Admin, Pimpinan, dan Mitra masing-masing punya tampilan sendiri.",
  },
  {
    icon: Smartphone,
    judul: "Isi survei dari HP",
    deskripsi: "Mitra cukup buka tautan atau pindai QR, tanpa instal aplikasi.",
  },
  {
    icon: BarChart3,
    judul: "Data langsung terekap",
    deskripsi: "Setiap respons tercermin seketika di dashboard admin.",
  },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; token?: string }>;
}) {
  const { callbackUrl, token } = await searchParams;
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* PANEL KIRI — branding */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between gradient-unnes px-12 py-10 text-white">
        {/* Dekorasi lingkaran samar */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-amber-400/10" />
        <div className="pointer-events-none absolute right-10 top-1/3 h-40 w-40 rounded-full border border-white/10" />

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
            <Image
              src="/assets/unnes-logo.png"
              alt="Logo UNNES"
              width={30}
              height={30}
              className="h-7.5 w-7.5 object-contain"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-bold tracking-tight text-white">
              SIKAP LPPM
            </span>
            <span className="block text-[11px] uppercase tracking-widest text-amber-300">
              Universitas Negeri Semarang
            </span>
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300">
            Sistem Kepuasan Mitra
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-snug xl:text-4xl">
            Masukan mitra, terbaca jelas oleh LPPM.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-blue-100">
            Satu sistem untuk desa binaan, industri, dan instansi pemerintah menilai
            kerja sama yang telah berjalan bersama LPPM.
          </p>

          <div className="mt-10 space-y-5">
            {SOROTAN.map((s) => (
              <div key={s.judul} className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-amber-300">
                  <s.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{s.judul}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-blue-200">{s.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-blue-300">
          © {new Date().getFullYear()} LPPM Universitas Negeri Semarang
        </p>
      </div>

      {/* PANEL KANAN — form */}
      <div className="relative flex flex-col bg-white">
        {/* Header mobile & tautan beranda */}
        <div className="flex items-center justify-between px-5 py-5 sm:px-8 lg:justify-end">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-950">
              <Image
                src="/assets/unnes-logo.png"
                alt="Logo UNNES"
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
                priority
              />
            </span>
            <span className="font-serif text-sm font-bold text-blue-950">SIKAP LPPM</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-blue-950"
          >
            <ArrowLeft className="h-4 w-4" /> Beranda
          </Link>
        </div>

        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-sm">
            <LoginForm callbackUrl={callbackUrl} token={token} />
          </div>
        </main>

        <p className="pb-8 text-center text-xs text-slate-400 lg:hidden">
          © {new Date().getFullYear()} LPPM Universitas Negeri Semarang
        </p>
      </div>
    </div>
  );
}
