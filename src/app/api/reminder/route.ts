import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized } from "@/lib/api";
import { kirimEmail, templateReminderSurvei } from "@/lib/email";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  kuesionerId: z.string().optional(),
});

const HARI_REMINDER = Number(process.env.REMINDER_AFTER_DAYS ?? 3);

/**
 * Endpoint reminder (cron/scheduler eksternal).
 * Panggil secara berkala, misal lewat Windows Task Scheduler / cron:
 *   curl -X POST http://localhost:3000/api/reminder \
 *        -H "x-cron-secret: <REMINDER_CRON_SECRET>"
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.REMINDER_CRON_SECRET) {
    return unauthorized();
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body ?? {});
  if (!parsed.success) return fail("Parameter tidak valid");

  const sekarang = Date.now();
  const batasWaktu = sekarang - HARI_REMINDER * 24 * 60 * 60 * 1000;

  const kuesionerList = parsed.data.kuesionerId
    ? await prisma.kuesioner.findMany({
        where: { id: parsed.data.kuesionerId },
        include: { createdBy: true },
      })
    : await prisma.kuesioner.findMany({
        where: { isActive: true },
        include: { createdBy: true },
      });

  const baseUrl = process.env.NEXTAUTH_URL ?? `http://localhost:3000`;

  let reminderDikirim = 0;

  for (const kuesioner of kuesionerList) {
    // Hanya reminder jika kuesioner sudah berusia minimal HARI_REMINDER hari
    if (kuesioner.createdAt.getTime() > batasWaktu) continue;

    const responsYangAda = await prisma.surveiResponse.findMany({
      where: { kuesionerId: kuesioner.id },
      select: { mitraId: true },
    });
    const sudahIsi = new Set(responsYangAda.map((r) => r.mitraId));

    const mitra = await prisma.mitra.findMany({
      where: {
        NOT: { id: { in: [...sudahIsi] } },
        user: { isNot: null },
      },
      include: { user: { select: { id: true, email: true } } },
    });

    for (const m of mitra) {
      if (!m.user?.email) continue;

      const url = `${baseUrl}/survei/${kuesioner.id}`;
      const hasil = await kirimEmail({
        to: m.user.email,
        subject: `Pengingat: Isi Survei "${kuesioner.judul}"`,
        text: `Yth. Mitra ${m.nama}, Anda belum mengisi survei "${kuesioner.judul}". ${url}`,
        html: templateReminderSurvei({ nama: m.nama, judulKuesioner: kuesioner.judul, url }),
      });

      await prisma.notifikasiEmail.create({
        data: {
          mitraId: m.id,
          kuesionerId: kuesioner.id,
          jenis: "REMINDER",
          status: hasil.skipped ? "DILEWATI" : hasil.ok ? "TERKIRIM" : "GAGAL",
        },
      });

      if (hasil.ok) reminderDikirim += 1;
    }
  }

  return ok({ jumlahKuesioner: kuesionerList.length, reminderDikirim });
}