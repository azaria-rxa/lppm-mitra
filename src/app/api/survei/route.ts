import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { submitSurveiSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { analisisSentimen } from "@/lib/sentiment";

export async function POST(req: NextRequest) {
  const user = await requireUser(["MITRA"]);
  if (!user) return unauthorized();
  if (!user.mitraId) return fail("Akun Anda belum terhubung ke data mitra");

  // Rate limiting sederhana untuk mencegah spam
  const ip = getClientIp(req);
  const limit = Number(process.env.RATE_LIMIT_MAX ?? 5);
  const rl = rateLimit(`survei:${ip}`, limit, 60_000);
  if (!rl.allowed) {
    return fail(
      `Terlalu banyak pengiriman. Coba lagi dalam ${rl.retryAfterSeconds} detik.`,
      429
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = submitSurveiSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const { kuesionerId, jawaban } = parsed.data;

  const kuesioner = await prisma.kuesioner.findUnique({
    where: { id: kuesionerId },
    include: { pertanyaan: { include: { opsi: true } } },
  });
  if (!kuesioner) return fail("Kuesioner tidak ditemukan", 404);
  if (!kuesioner.isActive) return fail("Kuesioner ini sudah tidak aktif");

  const sudahMengisi = await prisma.surveiResponse.findUnique({
    where: { kuesionerId_mitraId: { kuesionerId, mitraId: user.mitraId } },
  });
  if (sudahMengisi) {
    return fail("Anda sudah mengisi kuesioner ini. Terima kasih.", 409);
  }

  // Validasi konsistensi jawaban terhadap pertanyaan
  const petaPertanyaan = new Map(kuesioner.pertanyaan.map((p) => [p.id, p]));
  for (const j of jawaban) {
    const p = petaPertanyaan.get(j.pertanyaanId);
    if (!p) return fail("Ada pertanyaan yang tidak dikenal.");

    if (j.tipe !== p.tipe) return fail(`Tipe jawaban tidak sesuai untuk "${p.teks}".`);

    if (j.tipe === "PILIHAN_GANDA") {
      const opsiValid = p.opsi.some((o) => o.id === j.opsiId);
      if (!opsiValid) return fail(`Opsi tidak valid untuk "${p.teks}".`);
    }
  }

  // Cek kelengkapan: jumlah jawaban = jumlah pertanyaan (semua wajib)
  if (kuesioner.pertanyaan.length !== jawaban.length) {
    return fail("Semua pertanyaan wajib diisi.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const surveiResponse = await tx.surveiResponse.create({
      data: {
        kuesionerId,
        mitraId: user.mitraId!,
        jawaban: {
          create: jawaban.map((j) => {
            const sama = j.tipe === "TEKS_BEBAS" && j.teksBebas
              ? analisisSentimen(j.teksBebas)
              : null;
            return {
              pertanyaanId: j.pertanyaanId,
              nilaiSkala: j.tipe === "SKALA_1_5" ? j.nilaiSkala : null,
              opsiId: j.tipe === "PILIHAN_GANDA" ? j.opsiId : null,
              teksBebas: j.tipe === "TEKS_BEBAS" ? j.teksBebas : null,
              sentimen: j.tipe === "TEKS_BEBAS" ? (sama?.sentimen ?? null) : null,
            };
          }),
        },
      },
      include: { jawaban: true },
    });
    return surveiResponse;
  });

  return ok({
    id: result.id,
    submittedAt: result.submittedAt,
    jumlahJawaban: result.jawaban.length,
  });
}