import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized, forbidden } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { penggunaUpdateSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = penggunaUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const data = parsed.data;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return fail("Pengguna tidak ditemukan", 404);
  if (target.role === "MITRA") {
    return fail("Akun mitra dikelola lewat halaman Mitra");
  }
  if (target.id === user.id && data.role && data.role !== target.role) {
    return fail("Tidak bisa mengubah peran akun sendiri");
  }

  const email = data.email?.trim().toLowerCase();
  if (email && email !== target.email) {
    const ada = await prisma.user.findUnique({ where: { email } });
    if (ada) return fail("Email sudah dipakai oleh pengguna lain");
  }

  try {
    const hasil = await prisma.user.update({
      where: { id },
      data: {
        nama: data.nama?.trim(),
        email,
        role: data.role,
        ...(data.password ? { passwordHash: await bcrypt.hash(data.password, 10) } : {}),
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { kuesioners: true } },
      },
    });
    return ok(hasil);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return fail("Email sudah dipakai oleh pengguna lain");
    }
    throw e;
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const { id } = await params;
  if (id === user.id) return fail("Tidak bisa menghapus akun sendiri");

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return fail("Pengguna tidak ditemukan", 404);
  if (target.role === "MITRA") {
    return fail("Akun mitra dikelola lewat halaman Mitra");
  }

  try {
    await prisma.user.delete({ where: { id } });
    return ok({ id });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2003"
    ) {
      return fail(
        "Pengguna ini masih tercatat sebagai pembuat kuesioner. Hapus atau buat ulang kuesionernya terlebih dahulu."
      );
    }
    throw e;
  }
}
