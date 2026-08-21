import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized, forbidden } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { kirimEmail, templateNotifikasiSurvei } from "@/lib/email";
import { z } from "zod";

const bodySchema = z.object({ kuesionerId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return fail("Parameter tidak valid");

  const { kuesionerId } = parsed.data;
  const kuesioner = await prisma.kuesioner.findUnique({ where: { id: kuesionerId } });
  if (!kuesioner) return fail("Kuesioner tidak ditemukan", 404);

  const mitra = await prisma.mitra.findMany({
    where: { user: { isNot: null } },
    include: { user: { select: { email: true, nama: true } } },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? `http://localhost:3000`;
  const url = `${baseUrl}/survei/${kuesioner.id}`;

  let sukses = 0;
  let skipped = 0;
  let gagal = 0;

  for (const m of mitra) {
    const email = m.user?.email;
    if (!email) {
      skipped += 1;
      continue;
    }
    const hasil = await kirimEmail({
      to: email,
      subject: `Undangan Mengisi Survei: ${kuesioner.judul}`,
      text: `Yth. Mitra ${m.nama}, mohon isi survei "${kuesioner.judul}" ${url}`,
      html: templateNotifikasiSurvei({
        nama: m.nama,
        judulKuesioner: kuesioner.judul,
        deskripsi: kuesioner.deskripsi,
        url,
      }),
    });

    await prisma.notifikasiEmail.create({
      data: {
        mitraId: m.id,
        kuesionerId,
        jenis: "UNDANGAN",
        status: hasil.skipped ? "DILEWATI" : hasil.ok ? "TERKIRIM" : "GAGAL",
      },
    });

    if (hasil.skipped) skipped += 1;
    else if (hasil.ok) sukses += 1;
    else gagal += 1;
  }

  return ok({ total: mitra.length, sukses, skipped, gagal });
}