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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/unnes-logo.png"
            alt="Logo UNNES"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="leading-tight">
            <span className="block font-serif text-lg font-bold tracking-tight text-slate-900">
              SIKAP LPPM
            </span>
            <span className="block text-[11px] uppercase tracking-widest text-slate-500">
              Universitas Negeri Semarang
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            Masuk
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          className="flex h-10 w-10 items-center justify-center text-slate-700 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-100 bg-white px-4 py-2 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-slate-50 py-3 text-sm text-slate-600 last:border-0 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="my-3 block bg-slate-900 py-2.5 text-center text-sm font-medium text-white"
          >
            Masuk
          </Link>
        </nav>
      )}
    </header>
  );
}
