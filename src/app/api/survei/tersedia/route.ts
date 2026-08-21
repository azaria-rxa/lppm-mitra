import { prisma } from "@/lib/prisma";
import { ok, unauthorized } from "@/lib/api";
import { requireUser } from "@/lib/session";

export async function GET() {
  const user = await requireUser(["MITRA"]);
  if (!user) return unauthorized();
  if (!user.mitraId) return ok([]);

  const [kuesioner, responsSaya] = await Promise.all([
    prisma.kuesioner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { pertanyaan: true } } },
    }),
    prisma.surveiResponse.findMany({
      where: { mitraId: user.mitraId },
      select: { kuesionerId: true, submittedAt: true },
    }),
  ]);

  const sudahDiisi = new Set(responsSaya.map((r) => r.kuesionerId));

  return ok(
    kuesioner.map((k) => ({
      id: k.id,
      judul: k.judul,
      deskripsi: k.deskripsi,
      jumlahPertanyaan: k._count.pertanyaan,
      createdAt: k.createdAt,
      sudahDiisi: sudahDiisi.has(k.id),
      diisiPada: responsSaya.find((r) => r.kuesionerId === k.id)?.submittedAt ?? null,
    }))
  );
}