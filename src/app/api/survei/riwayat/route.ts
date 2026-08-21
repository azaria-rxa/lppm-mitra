import { prisma } from "@/lib/prisma";
import { ok, unauthorized } from "@/lib/api";
import { requireUser } from "@/lib/session";

export async function GET() {
  const user = await requireUser(["MITRA"]);
  if (!user) return unauthorized();
  if (!user.mitraId) return ok([]);

  const riwayat = await prisma.surveiResponse.findMany({
    where: { mitraId: user.mitraId },
    orderBy: { submittedAt: "desc" },
    include: {
      kuesioner: { select: { judul: true, pertanyaan: { select: { id: true } } } },
      jawaban: {
        include: { pertanyaan: { select: { teks: true, tipe: true } }, opsi: { select: { teks: true } } },
      },
    },
  });

  return ok(
    riwayat.map((r) => {
      const skala = r.jawaban.filter((j) => j.nilaiSkala !== null);
      const skor = skala.length
        ? skala.reduce((a, b) => a + (b.nilaiSkala ?? 0), 0) / skala.length
        : null;
      return {
        id: r.id,
        judulKuesioner: r.kuesioner.judul,
        submittedAt: r.submittedAt,
        jumlahPertanyaan: r.kuesioner.pertanyaan.length,
        skor,
      };
    })
  );
}