import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized } from "@/lib/api";
import { requireUser } from "@/lib/session";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(["MITRA"]);
  if (!user) return unauthorized();
  if (!user.mitraId) return fail("Akun Anda belum terhubung ke data mitra");

  const { id } = await params;
  const kuesioner = await prisma.kuesioner.findUnique({
    where: { id },
    include: { pertanyaan: { orderBy: { urutan: "asc" }, include: { opsi: { orderBy: { id: "asc" } } } } },
  });

  if (!kuesioner) return fail("Kuesioner tidak ditemukan", 404);
  if (!kuesioner.isActive) return fail("Kuesioner ini sudah tidak aktif");

  const sudah = await prisma.surveiResponse.findUnique({
    where: { kuesionerId_mitraId: { kuesionerId: id, mitraId: user.mitraId } },
  });
  if (sudah) return fail("Anda sudah mengisi kuesioner ini.", 409);

  return ok(kuesioner);
}