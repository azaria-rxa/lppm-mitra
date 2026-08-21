import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized, forbidden } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { mitraUpdateSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = mitraUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const data = parsed.data;
  const ada = await prisma.mitra.findUnique({ where: { id }, include: { user: true } });
  if (!ada) return fail("Mitra tidak ditemukan", 404);

  const emailAkun = data.emailAkun?.trim().toLowerCase();

  const mitra = await prisma.$transaction(async (tx) => {
    const hasil = await tx.mitra.update({
      where: { id },
      data: {
        nama: data.nama?.trim(),
        jenis: data.jenis,
        kontak: data.kontak?.trim(),
      },
      include: { user: { select: { id: true, email: true, nama: true } } },
    });

    if (emailAkun || (data.passwordAkun && ada.user)) {
      const emailFinal = emailAkun ?? ada.user?.email;
      if (ada.user) {
        await tx.user.update({
          where: { id: ada.user.id },
          data: {
            nama: data.nama?.trim() ?? ada.nama,
            email: emailFinal,
            ...(data.passwordAkun
              ? { passwordHash: await bcrypt.hash(data.passwordAkun, 10) }
              : {}),
          },
        });
      } else if (emailFinal && data.passwordAkun) {
        await tx.user.create({
          data: {
            nama: data.nama?.trim() ?? ada.nama,
            email: emailFinal,
            passwordHash: await bcrypt.hash(data.passwordAkun, 10),
            role: "MITRA",
            mitra: { connect: { id } },
          },
        });
      }
    }

    return hasil;
  });

  return ok(mitra);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const { id } = await params;
  const mitra = await prisma.mitra.findUnique({ where: { id }, include: { user: true } });
  if (!mitra) return fail("Mitra tidak ditemukan", 404);

  await prisma.$transaction(async (tx) => {
    await tx.mitra.delete({ where: { id } });
    if (mitra.user && mitra.user.role === "MITRA") {
      await tx.user.deleteMany({ where: { id: mitra.user.id } });
    }
  });

  return ok({ id });
}