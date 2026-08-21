import { prisma } from "@/lib/prisma";
import { KuesionerView } from "./kuesioner-view";

export const dynamic = "force-dynamic";

export default async function KuesionerPage() {
  const kuesioner = await prisma.kuesioner.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { nama: true } },
      _count: { select: { pertanyaan: true, responses: true } },
    },
  });

  const data = kuesioner.map((k) => ({ ...k, createdAt: k.createdAt.toISOString() }));

  return <KuesionerView initialData={data} />;
}
