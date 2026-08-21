import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { SurveiView } from "./survei-view";

export const dynamic = "force-dynamic";

export default async function DaftarSurveiPage() {
  const user = await getSessionUser();

  let data: Awaited<ReturnType<typeof muatData>> = [];
  if (user?.mitraId) {
    data = await muatData(user.mitraId);
  }

  return <SurveiView initialData={data} />;
}

async function muatData(mitraId: string) {
  const [kuesioner, responsSaya] = await Promise.all([
    prisma.kuesioner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { pertanyaan: true } } },
    }),
    prisma.surveiResponse.findMany({
      where: { mitraId },
      select: { kuesionerId: true, submittedAt: true },
    }),
  ]);

  const sudahDiisi = new Set(responsSaya.map((r) => r.kuesionerId));

  return kuesioner.map((k) => ({
    id: k.id,
    judul: k.judul,
    deskripsi: k.deskripsi,
    jumlahPertanyaan: k._count.pertanyaan,
    createdAt: k.createdAt.toISOString(),
    sudahDiisi: sudahDiisi.has(k.id),
    diisiPada:
      responsSaya.find((r) => r.kuesionerId === k.id)?.submittedAt.toISOString() ?? null,
  }));
}
