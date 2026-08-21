// Menambahkan kuesioner aktif tambahan TANPA menghapus/mengubah data yang sudah ada.
// Idempotent: kuesioner dengan judul yang sama tidak akan dibuat dua kali.
//
// Jalankan: node --tsx  (lihat README) atau:
//   & "D:\DOWLOAD\node.exe" ".\node_modules\tsx\dist\cli.mjs" "prisma\seed-kuesioner.ts"

import { PrismaClient } from "@prisma/client";
import { KUESIONER_TAMBAHAN } from "./data-kuesioner";

const prisma = new PrismaClient();

async function main() {
  console.log("📝 Menambahkan kuesioner aktif ...");

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    throw new Error("Akun ADMIN tidak ditemukan. Jalankan seed utama terlebih dahulu.");
  }

  for (const k of KUESIONER_TAMBAHAN) {
    const sudahAda = await prisma.kuesioner.findFirst({ where: { judul: k.judul } });
    if (sudahAda) {
      console.log(`  ↷ Lewati (sudah ada): ${k.judul}`);
      continue;
    }

    const dibuat = await prisma.kuesioner.create({
      data: {
        judul: k.judul,
        deskripsi: k.deskripsi,
        isActive: true,
        createdById: admin.id,
        pertanyaan: {
          create: k.pertanyaan.map((p) => ({
            teks: p.teks,
            tipe: p.tipe,
            urutan: p.urutan,
            ...(p.tipe === "PILIHAN_GANDA" && p.opsi
              ? { opsi: { create: p.opsi.map((teks) => ({ teks })) } }
              : {}),
          })),
        },
      },
      include: { pertanyaan: true },
    });
    console.log(`  ✓ Dibuat: ${dibuat.judul} (${dibuat.pertanyaan.length} pertanyaan)`);
  }

  const totalAktif = await prisma.kuesioner.count({ where: { isActive: true } });
  console.log(`\n✅ Selesai. Total kuesioner aktif sekarang: ${totalAktif}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
