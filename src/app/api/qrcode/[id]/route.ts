import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { fail, unauthorized, forbidden } from "@/lib/api";
import { requireUser } from "@/lib/session";

export const runtime = "nodejs";

/**
 * Menghasilkan QR code per mitra yang mengarah ke halaman survei
 * dengan token akses cepat (tanpa login manual).
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const { id } = await params;
  const mitra = await prisma.mitra.findUnique({ where: { id }, select: { id: true, qrToken: true } });
  if (!mitra) return fail("Mitra tidak ditemukan", 404);

  const baseUrl = process.env.NEXTAUTH_URL ?? `http://localhost:3000`;
  const payload = `${baseUrl}/login?token=${mitra.qrToken}&callbackUrl=/survei`;

  const buffer = await QRCode.toBuffer(payload, {
    type: "png",
    width: 512,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#1e3a8a", light: "#ffffff" },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}