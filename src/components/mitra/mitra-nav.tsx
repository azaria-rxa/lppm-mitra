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
      <div className="flex h-16 items-center gap-2.5 border-b px-5">
        <Image
          src="/assets/unnes-logo.png"
          alt="Logo UNNES"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
        <span className="leading-tight">
          <span className="block font-serif text-base font-bold tracking-tight text-slate-900">
            SIKAP LPPM
          </span>
          <span className="block text-[11px] uppercase tracking-widest text-slate-400">
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
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isAktif(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
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
      <header className="sticky top-0 z-20 border-b bg-white lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-3">
          <Image
            src="/assets/unnes-logo.png"
            alt="Logo UNNES"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate font-serif text-sm font-bold text-slate-900">SIKAP LPPM</p>
            <p className="truncate text-xs text-slate-400">Halo, {user.nama}</p>
          </div>
          <Button variant="ghost" size="icon" title="Keluar" onClick={keluar}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Bottom navigation (khusus mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-white/95 backdrop-blur lg:hidden">
        <div
          className="mx-auto grid max-w-lg grid-cols-2"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                isAktif(item.href) ? "text-primary" : "text-slate-400"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
