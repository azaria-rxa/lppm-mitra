import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized, forbidden } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { penggunaCreateSchema } from "@/lib/validations";

const PILIHAN_STAF = { in: ["ADMIN", "PIMPINAN"] as Role[] };

export async function GET() {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const pengguna = await prisma.user.findMany({
    where: { role: PILIHAN_STAF },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nama: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { kuesioners: true } },
    },
  });

  return ok(pengguna);
}

export async function POST(req: NextRequest) {
  const user = await requireUser(["ADMIN"]);
  if (!user) return user ? forbidden() : unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = penggunaCreateSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const data = parsed.data;
  const email = data.email.trim().toLowerCase();

  const ada = await prisma.user.findUnique({ where: { email } });
  if (ada) return fail("Email sudah dipakai oleh pengguna lain");

  try {
    const baru = await prisma.user.create({
      data: {
        nama: data.nama.trim(),
        email,
        passwordHash: await bcrypt.hash(data.password, 10),
        role: data.role,
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
    return ok(baru);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return fail("Email sudah dipakai oleh pengguna lain");
    }
    throw e;
  }
}
