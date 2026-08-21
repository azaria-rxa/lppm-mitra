"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormMitra } from "@/components/admin/form-mitra";

export function TambahMitraView() {
  const router = useRouter();

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

      {/* Bar atas: logo pojok kiri */}
      <header className="relative z-10 border-b border-white/15">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
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
                Panel Admin
              </span>
            </span>
          </Link>
          <Link
            href="/mitra"
            className="flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Daftar Mitra
          </Link>
        </div>
      </header>

      {/* Kartu form */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Mitra Baru</CardTitle>
              <CardDescription>
                Isi data mitra. Bagian akun masuk bersifat opsional — diisi agar mitra
                dapat masuk aplikasi dan memakai QR code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormMitra onDone={() => router.push("/mitra")} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
