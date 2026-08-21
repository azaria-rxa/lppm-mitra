import { prisma } from "@/lib/prisma";
import { MitraView } from "./mitra-view";

export const dynamic = "force-dynamic";

export default async function MitraPage() {
  const mitra = await prisma.mitra.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, email: true, nama: true } },
      _count: { select: { responses: true } },
    },
  });

  const data = mitra.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }));

  return <MitraView initialData={data} />;
}
