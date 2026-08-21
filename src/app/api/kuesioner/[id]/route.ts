import { NextRequest } from "next/server";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized, forbidden } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { kuesionerUpdateSchema, type PertanyaanInput } from "@/lib/validations";

const BOLEH_AKSES: Role[] = ["ADMIN", "PIMPINAN"];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(BOLEH_AKSES);
  if (!user) return user ? forbidden() : unauthorized();

  const { id } = await params;
  const kuesioner = await prisma.kuesioner.findUnique({
    where: { id },
    include: {
      pertanyaan: {
        orderBy: { urutan: "asc" },
        include: { opsi: { orderBy: { id: "asc" } } },
      },
      _count: { select: { responses: true } },
    },
  });

  if (!kuesioner) return fail("Kuesioner tidak ditemukan", 404);
  return ok(kuesioner);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = kuesionerUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const data = parsed.data;
  const existing = await prisma.kuesioner.findUnique({
    where: { id },
    include: { pertanyaan: { include: { opsi: true, _count: { select: { jawaban: true } } } } },
  });
  if (!existing) return fail("Kuesioner tidak ditemukan", 404);

  const pertanyaanPayload = data.pertanyaan?.map((p: PertanyaanInput, idx: number) => ({
    ...p,
    urutan: idx,
  }));

  await prisma.$transaction(async (tx) => {
    await tx.kuesioner.update({
      where: { id },
      data: {
        judul: data.judul ?? existing.judul,
        deskripsi:
          data.deskripsi !== undefined ? data.deskripsi || null : existing.deskripsi,
        isActive: data.isActive ?? existing.isActive,
      },
    });

    if (!pertanyaanPayload) return;

    const idPayload = pertanyaanPayload.filter((p) => p.id).map((p) => p.id as string);
    const idLama = existing.pertanyaan.map((p) => p.id);

    // Hapus pertanyaan lama yang tidak ada di payload & belum punya jawaban
    const hapusAman = idLama.filter((pid) => !idPayload.includes(pid));
    for (const pid of hapusAman) {
      const p = existing.pertanyaan.find((x) => x.id === pid);
      if (p && p._count.jawaban === 0) {
        await tx.pertanyaan.delete({ where: { id: pid } });
      }
    }

    for (const p of pertanyaanPayload) {
      if (p.id) {
        // Update pertanyaan yang sudah ada
        await tx.pertanyaan.update({
          where: { id: p.id },
          data: { teks: p.teks, tipe: p.tipe, urutan: p.urutan },
        });

        // Kelola opsi: hapus yang tidak ada & belum dipakai, upsert sisanya
        const opsiLama = await tx.opsi.findMany({ where: { pertanyaanId: p.id } });
        const idOpsiPayload = p.opsi.filter((o) => o.id).map((o) => o.id as string);
        const hapusOpsi = opsiLama.filter((o) => !idOpsiPayload.includes(o.id));
        for (const o of hapusOpsi) {
          const dipakai = await tx.jawabanResponse.count({ where: { opsiId: o.id } });
          if (dipakai === 0) await tx.opsi.delete({ where: { id: o.id } });
        }
        for (const o of p.opsi) {
          if (o.id) {
            await tx.opsi.update({ where: { id: o.id }, data: { teks: o.teks } });
          } else {
            await tx.opsi.create({ data: { pertanyaanId: p.id, teks: o.teks } });
          }
        }
      } else {
        // Pertanyaan baru
        await tx.pertanyaan.create({
          data: {
            kuesionerId: id,
            teks: p.teks,
            tipe: p.tipe,
            urutan: p.urutan,
            opsi: {
              create: p.tipe === "PILIHAN_GANDA" ? p.opsi.map((o) => ({ teks: o.teks })) : [],
            },
          },
        });
      }
    }
  });

  const updated = await prisma.kuesioner.findUnique({
    where: { id },
    include: {
      pertanyaan: { orderBy: { urutan: "asc" }, include: { opsi: { orderBy: { id: "asc" } } } },
    },
  });

  return ok(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const { id } = await params;
  const existed = await prisma.kuesioner.findUnique({ where: { id } });
  if (!existed) return fail("Kuesioner tidak ditemukan", 404);

  await prisma.kuesioner.delete({ where: { id } });
  return ok({ id });
}