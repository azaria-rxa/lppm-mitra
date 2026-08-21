import { NextRequest } from "next/server";
import type { Role } from "@prisma/client";
import { fail, ok, unauthorized, forbidden } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { hitungDataDashboard } from "@/lib/laporan";

const BOLEH_AKSES: Role[] = ["ADMIN", "PIMPINAN"];

export async function GET(_req: NextRequest) {
  const user = await requireUser(BOLEH_AKSES);
  if (!user) return user ? forbidden() : unauthorized();

  const data = await hitungDataDashboard();
  return ok(data);
}