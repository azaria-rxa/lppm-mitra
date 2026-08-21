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
    <div className="relative flex min-h-dvh flex-col">
      <div className="absolute inset-0">
        <Image
          src="/assets/background-unnes.jpeg"
          alt="Lingkungan kampus Universitas Negeri Semarang"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/75" />
      </div>

      {/* Bar atas */}
      <header className="relative z-10 border-b border-white/15">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center bg-white">
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
              <span className="block font-serif text-lg font-bold tracking-tight text-white">
                SIKAP LPPM
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-slate-300">
                Universitas Negeri Semarang
              </span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Beranda
          </Link>
        </div>
      </header>

      {/* Kartu login */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-slate-300">
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
