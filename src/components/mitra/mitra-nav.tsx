"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ClipboardList, History, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types";
import { Button } from "@/components/ui/button";

const ITEMS = [
  { href: "/survei", label: "Survei", icon: ClipboardList },
  { href: "/riwayat", label: "Riwayat", icon: History },
];

export function MitraNav({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  function isAktif(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function keluar() {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  }

  const SidebarKonten = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b bg-gradient-to-r from-blue-950 to-blue-900 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
          <Image
            src="/assets/unnes-logo.png"
            alt="Logo UNNES"
            width={26}
            height={26}
            className="h-6.5 w-6.5 object-contain"
          />
        </span>
        <span className="leading-tight">
          <span className="block font-serif text-base font-bold tracking-tight text-white">
            SIKAP LPPM
          </span>
          <span className="block text-[11px] uppercase tracking-widest text-amber-300">
            Portal Mitra
          </span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg border-l-4 px-3 py-2 text-sm font-medium transition-all duration-200",
              isAktif(item.href)
                ? "border-amber-400 bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20"
                : "border-transparent text-slate-600 hover:translate-x-0.5 hover:border-amber-300 hover:bg-blue-50 hover:text-blue-900"
            )}
          >
            <item.icon className={cn("h-4 w-4", isAktif(item.href) && "text-amber-300")} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-800 to-blue-600 text-sm font-bold text-white ring-2 ring-amber-400/60">
            {user.nama.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.nama}</p>
            <p className="truncate text-xs text-slate-500">Mitra Eksternal</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-slate-600"
          onClick={keluar}
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-white lg:block">
        {SidebarKonten}
      </aside>

      {/* Header mobile */}
      <header className="sticky top-0 z-20 border-b bg-gradient-to-r from-blue-950 to-blue-900 text-white lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <Image
              src="/assets/unnes-logo.png"
              alt="Logo UNNES"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate font-serif text-sm font-bold text-white">SIKAP LPPM</p>
            <p className="truncate text-xs text-amber-300">Halo, {user.nama}</p>
          </div>
          <Button variant="ghost" size="icon" title="Keluar" onClick={keluar} className="text-white hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Bottom navigation (khusus mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-white/95 shadow-[0_-4px_16px_-8px_rgba(15,45,90,0.25)] backdrop-blur lg:hidden">
        <div
          className="mx-auto grid max-w-lg grid-cols-2"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all duration-200",
                isAktif(item.href) ? "text-blue-900" : "text-slate-400 hover:text-blue-700"
              )}
            >
              {isAktif(item.href) && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-amber-400" />
              )}
              <item.icon className={cn("h-5 w-5 transition-transform", isAktif(item.href) && "-translate-y-0.5 scale-110")} />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
