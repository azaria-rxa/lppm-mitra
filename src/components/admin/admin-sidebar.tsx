"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ROLE_LABEL } from "@/lib/rbac";
import type { SessionUser } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  user: SessionUser;
}

const NAV_ADMIN = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kuesioner", label: "Kuesioner", icon: ClipboardList },
  { href: "/mitra", label: "Mitra", icon: Building2 },
  { href: "/laporan", label: "Laporan", icon: FileText },
];

const NAV_PIMPINAN = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/laporan", label: "Laporan", icon: FileText },
];

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const nav = user.role === "ADMIN" ? NAV_ADMIN : NAV_PIMPINAN;

  function isAktif(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function Navigasi() {
    return (
      <nav className="flex flex-col gap-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
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
    );
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
          <span className="block font-serif text-base font-bold tracking-tight">SIKAP LPPM</span>
          <span className="block text-[11px] uppercase tracking-widest text-slate-400">
            {user.role === "ADMIN" ? "Panel Admin" : "Panel Pimpinan"}
          </span>
        </span>
        <button className="ml-auto rounded p-1 text-slate-500 lg:hidden" onClick={() => setOpen(false)} aria-label="Tutup menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <Navigasi />
      </div>
      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {user.nama.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.nama}</p>
            <p className="truncate text-xs text-slate-500">{ROLE_LABEL[user.role]}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-slate-600"
          onClick={async () => {
            await signOut({ redirect: false });
            router.push("/login");
            router.refresh();
          }}
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

      {/* Topbar mobile */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center gap-2 border-b bg-white px-4 lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Buka menu">
          <Menu className="h-5 w-5" />
        </Button>
        <Image
          src="/assets/unnes-logo.png"
          alt="Logo UNNES"
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
        />
        <span className="font-bold">SIKAP LPPM</span>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
          <span>{user.nama}</span>
        </div>
      </header>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">{SidebarKonten}</aside>
        </div>
      )}
    </>
  );
}