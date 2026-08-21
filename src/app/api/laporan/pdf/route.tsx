import React from "react";
import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import type { Role } from "@prisma/client";
import { fail, unauthorized, forbidden } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { hitungLaporanPeriode } from "@/lib/laporan";
import { laporanSchema } from "@/lib/validations";
import { LaporanPDF } from "@/components/admin/laporan-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOLEH_AKSES: Role[] = ["ADMIN", "PIMPINAN"];

export async function POST(req: NextRequest) {
  const user = await requireUser(BOLEH_AKSES);
  if (!user) return user ? forbidden() : unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = laporanSchema.safeParse(body ?? {});
  if (!parsed.success) return fail("Parameter periode tidak valid");

  try {
    const data = await hitungLaporanPeriode(parsed.data);
    const buffer = await renderToBuffer(<LaporanPDF data={data} />);

    const namaFile = `laporan-kepuasan-${parsed.data.jenis.toLowerCase()}-${parsed.data.periode}.pdf`;

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${namaFile}"`,
      },
    });
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Gagal membuat PDF", 500);
  }
}