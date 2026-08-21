import { NextRequest } from "next/server";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized, forbidden } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { kuesionerCreateSchema } from "@/lib/validations";

const BOLEH_AKSES: Role[] = ["ADMIN", "PIMPINAN"];

export async function GET() {
  const user = await requireUser(BOLEH_AKSES);
  if (!user) return user ? forbidden() : unauthorized();

  const kuesioner = await prisma.kuesioner.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { nama: true } },
      _count: { select: { pertanyaan: true, responses: true } },
    },
  });

  return ok(kuesioner);
}

export async function POST(req: NextRequest) {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = kuesionerCreateSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const data = parsed.data;

  const kuesioner = await prisma.kuesioner.create({
    data: {
      judul: data.judul,
      deskripsi: data.deskripsi || null,
      isActive: data.isActive,
      createdById: user.id,
      pertanyaan: {
        create: data.pertanyaan
          .sort((a, b) => a.urutan - b.urutan)
          .map((p) => ({
            teks: p.teks,
            tipe: p.tipe,
            urutan: p.urutan,
            opsi: {
              create: p.tipe === "PILIHAN_GANDA" ? p.opsi.map((o) => ({ teks: o.teks })) : [],
            },
          })),
      },
    },
    include: { pertanyaan: { include: { opsi: true } } },
  });

  return ok(kuesioner);
}