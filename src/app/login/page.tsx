import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Masuk",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; token?: string }>;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <Image
        src="/assets/background-unnes.jpeg"
        alt="Lingkungan kampus Universitas Negeri Semarang"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-blue-950/70 to-slate-950/85" />

      {/* Bar atas */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/30 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow ring-1 ring-white/20">
              <Image
                src="/assets/unnes-logo.png"
                alt="Logo UNNES"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
              />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold tracking-tight text-white">SIKAP LPPM</span>
              <span className="hidden text-[11px] font-medium text-white/70 sm:block">
                Universitas Negeri Semarang
              </span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Beranda
          </Link>
        </div>
      </header>

      {/* Kartu login */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-white/60">
            Kembali ke{" "}
            <Link className="font-medium text-white underline-offset-4 hover:underline" href="/">
              beranda
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
