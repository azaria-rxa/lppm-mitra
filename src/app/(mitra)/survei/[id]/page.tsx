import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { FormSurveiDinamis } from "@/components/mitra/form-survei-dinamis";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function IsiSurveiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();

  let galat: string | null = null;
  let kuesioner: Awaited<ReturnType<typeof muatKuesioner>> = null;

  if (!user) galat = "Sesi berakhir. Silakan masuk kembali.";
  else if (!user.mitraId) galat = "Akun Anda belum terhubung ke data mitra";
  else {
    kuesioner = await muatKuesioner(id, user.mitraId);
    if (kuesioner === null) {
      const ada = await prisma.kuesioner.findUnique({ where: { id }, select: { isActive: true } });
      if (!ada) galat = "Kuesioner tidak ditemukan";
      else if (!ada.isActive) galat = "Kuesioner ini sudah tidak aktif";
      else galat = "Anda sudah mengisi kuesioner ini.";
    }
  }

  if (galat || !kuesioner) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-sm text-slate-600">{galat ?? "Data tidak ditemukan"}</p>
          <Button variant="outline" asChild>
            <Link href="/survei">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Survei
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <FormSurveiDinamis kuesioner={kuesioner} />;
}

async function muatKuesioner(id: string, mitraId: string) {
  const kuesioner = await prisma.kuesioner.findUnique({
    where: { id },
    include: { pertanyaan: { orderBy: { urutan: "asc" }, include: { opsi: { orderBy: { id: "asc" } } } } },
  });

  if (!kuesioner || !kuesioner.isActive) return null;

  const sudah = await prisma.surveiResponse.findUnique({
    where: { kuesionerId_mitraId: { kuesionerId: id, mitraId } },
  });
  if (sudah) return null;

  return {
    id: kuesioner.id,
    judul: kuesioner.judul,
    deskripsi: kuesioner.deskripsi,
    isActive: kuesioner.isActive,
    pertanyaan: kuesioner.pertanyaan.map((p) => ({
      id: p.id,
      teks: p.teks,
      tipe: p.tipe,
      opsi: p.opsi.map((o) => ({ id: o.id, teks: o.teks })),
    })),
  };
}
