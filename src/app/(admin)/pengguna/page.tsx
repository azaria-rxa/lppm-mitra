import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PenggunaView } from "./pengguna-view";

export const dynamic = "force-dynamic";

const PILIHAN_STAF = { in: ["ADMIN", "PIMPINAN"] as Role[] };

export default async function PenggunaPage() {
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

  const data = pengguna.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    role: u.role as "ADMIN" | "PIMPINAN",
  }));

  return <PenggunaView initialData={data} />;
}
