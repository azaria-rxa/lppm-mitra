import { NextRequest } from "next/server";
import type { Role } from "@prisma/client";
import { fail, ok, unauthorized, forbidden, } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { hitungLaporanPeriode } from "@/lib/laporan";
import { laporanSchema } from "@/lib/validations";

const BOLEH_AKSES: Role[] = ["ADMIN", "PIMPINAN"];

export async function GET(req: NextRequest) {
  const user = await requireUser(BOLEH_AKSES);
  if (!user) return user ? forbidden() : unauthorized();

  const jenis = req.nextUrl.searchParams.get("jenis") ?? "TAHUNAN";
  const periode = req.nextUrl.searchParams.get("periode") ?? String(new Date().getFullYear());

  const parsed = laporanSchema.safeParse({ jenis, periode });
  if (!parsed.success) return fail("Parameter periode tidak valid");

  try {
    const data = await hitungLaporanPeriode(parsed.data);
    return ok(data);
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Gagal menghitung laporan");
  }
}