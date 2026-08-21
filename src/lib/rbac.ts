import type { Role } from "@prisma/client";

/**
 * Matriks RBAC (Role-Based Access Control) untuk aplikasi SIKAP-LPPM.
 *
 *  - ADMIN   : full access — kelola kuesioner, mitra, lihat laporan, export PDF, notifikasi
 *  - PIMPINAN: read-only — dashboard, laporan, export PDF
 *  - MITRA   : isi survei yang ditugaskan + riwayat pengisian sendiri
 */

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin LPPM",
  PIMPINAN: "Pimpinan",
  MITRA: "Mitra / Publik",
};

export const ADMIN_ROUTES = [
  "/dashboard",
  "/kuesioner",
  "/mitra",
  "/laporan",
] as const;

export const MITRA_ROUTES = [
  "/survei",
  "/riwayat",
] as const;

/** Prefix route group bagi halaman admin */
export const ADMIN_PREFIX = "";

/** Daftar halaman yang boleh diakses tiap role */
export const ROLE_ROUTES: Record<Role, string[]> = {
  ADMIN: [...ADMIN_ROUTES],
  PIMPINAN: ["/dashboard", "/laporan"],
  MITRA: [...MITRA_ROUTES],
};

/** Halaman yang boleh diakses tanpa login */
export const PUBLIC_ROUTES = ["/login", "/"] as const;

export function canAccess(role: Role | undefined, pathname: string): boolean {
  if (!role) return false;
  const allowed = ROLE_ROUTES[role];

  // Segment pertama path, contoh: "/dashboard/foo" -> "/dashboard"
  const segment = "/" + (pathname.split("/")[1] || "");

  // Mitra juga bisa membuka halaman survei spesifik /survei/[id]
  if (role === "MITRA" && (pathname.startsWith("/survei") || pathname.startsWith("/riwayat"))) {
    return true;
  }
  return allowed.some((r) => segment === r || segment === r + "/");
}

export function isAdmin(role: Role | undefined): boolean {
  return role === "ADMIN";
}

export function isPimpinan(role: Role | undefined): boolean {
  return role === "PIMPINAN";
}

export function isMitra(role: Role | undefined): boolean {
  return role === "MITRA";
}