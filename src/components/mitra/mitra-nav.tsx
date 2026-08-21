"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ClipboardList, History, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types";
import { Button } from "@/components/ui/button";

export function MitraNav({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { href: "/survei", label: "Survei", icon: ClipboardList },
    { href: "/riwayat", label: "Riwayat", icon: History },
  ];

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ClipboardList className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">SIKAP LPPM</p>
            <p className="truncate text-xs text-slate-400">Halo, {user.nama}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            title="Keluar"
            onClick={async () => {
              await signOut({ redirect: false });
              router.push("/login");
              router.refresh();
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Bottom navigation mobile-first */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-white/95 backdrop-blur">
        <div
          className="mx-auto grid max-w-lg grid-cols-2"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {items.map((item) => {
            const aktif = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                  aktif ? "text-primary" : "text-slate-400"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}