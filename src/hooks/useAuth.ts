"use client";

import { useSession } from "next-auth/react";
import type { SessionUser } from "@/types";

export interface UseAuthReturn {
  user: SessionUser | null;
  isAdmin: boolean;
  isPimpinan: boolean;
  isMitra: boolean;
  loading: boolean;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  const user = session?.user ?? null;

  return {
    user: user
      ? { id: user.id, nama: user.nama, email: user.email ?? "", role: user.role, mitraId: user.mitraId }
      : null,
    isAdmin: user?.role === "ADMIN",
    isPimpinan: user?.role === "PIMPINAN",
    isMitra: user?.role === "MITRA",
    loading: status === "loading",
  };
}