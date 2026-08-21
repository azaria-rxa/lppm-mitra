import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { RiwayatView } from "./riwayat-view";

export const dynamic = "force-dynamic";

export default async function RiwayatPage() {
  const user = await getSessionUser();

  let data: Awaited<ReturnType<typeof muatData>> = [];
  if (user?.mitraId) {
    data = await muatData(user.mitraId);
  }

  return <RiwayatView initialData={data} />;
}

async function muatData(mitraId: string) {
  const riwayat = await prisma.surveiResponse.findMany({
    where: { mitraId },
    orderBy: { submittedAt: "desc" },
    include: {
      kuesioner: { select: { judul: true, pertanyaan: { select: { id: true } } } },
      jawaban: {
        include: { pertanyaan: { select: { teks: true, tipe: true } }, opsi: { select: { teks: true } } },
      },
    },
  });

  return riwayat.map((r) => {
    const skala = r.jawaban.filter((j) => j.nilaiSkala !== null);
    const skor = skala.length
      ? skala.reduce((a, b) => a + (b.nilaiSkala ?? 0), 0) / skala.length
      : null;
    return {
      id: r.id,
      judulKuesioner: r.kuesioner.judul,
      submittedAt: r.submittedAt.toISOString(),
      jumlahPertanyaan: r.kuesioner.pertanyaan.length,
      skor,
    };
  });
}
