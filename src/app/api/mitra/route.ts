import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized, forbidden } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { mitraCreateSchema } from "@/lib/validations";

export async function GET() {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const mitra = await prisma.mitra.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, email: true, nama: true } },
      _count: { select: { responses: true } },
    },
  });

  return ok(mitra);
}

export async function POST(req: NextRequest) {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = mitraCreateSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const data = parsed.data;

  // Validasi duplikat email akun
  const emailAkun = data.emailAkun?.trim().toLowerCase();
  if (emailAkun) {
    const ada = await prisma.user.findUnique({ where: { email: emailAkun } });
    if (ada) return fail("Email akun sudah dipakai oleh pengguna lain");
  }

  const qrToken = randomUUID();

  const mitra = await prisma.$transaction(async (tx) => {
    const baru = await tx.mitra.create({
      data: {
        nama: data.nama.trim(),
        jenis: data.jenis,
        kontak: data.kontak.trim(),
        qrToken,
        user: emailAkun
          ? {
              create: {
                nama: data.nama.trim(),
                email: emailAkun,
                passwordHash: await bcrypt.hash(data.passwordAkun!, 10),
                role: "MITRA",
              },
            }
          : undefined,
      },
      include: { user: { select: { id: true, email: true, nama: true } } },
    });
    return baru;
  });

  return ok(mitra);
}