"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/#tentang", label: "Tentang" },
  { href: "/#fitur", label: "Fitur" },
  { href: "/#peran", label: "Peran" },
];

export function SiteNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-blue-950/10 bg-white/90 backdrop-blur-md">
      <div className="h-[3px] w-full gradient-gold" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 ring-2 ring-transparent transition-all group-hover:ring-amber-400">
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
            <span className="block font-serif text-lg font-bold tracking-tight text-blue-950">
              SIKAP LPPM
            </span>
            <span className="block text-[11px] uppercase tracking-widest text-amber-600">
              Universitas Negeri Semarang
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="underline-grow text-sm font-medium text-blue-950/70 transition-colors hover:text-blue-950"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-full bg-gradient-to-b from-amber-400 to-amber-500 px-5 py-2 text-sm font-semibold text-blue-950 shadow transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30"
          >
            Masuk
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          className="flex h-10 w-10 items-center justify-center rounded-full text-blue-950 transition-colors hover:bg-blue-50 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="animate-fade-in-up border-t border-blue-950/10 bg-white px-4 py-2 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-slate-50 py-3 text-sm text-blue-950/70 last:border-0 hover:text-blue-950"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="my-3 block rounded-full bg-gradient-to-b from-amber-400 to-amber-500 py-2.5 text-center text-sm font-semibold text-blue-950"
          >
            Masuk
          </Link>
        </nav>
      )}
    </header>
  );
}
