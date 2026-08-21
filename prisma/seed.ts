import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@lppm.ac.id";
const ADMIN_PASS = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";
const PIMPINAN_EMAIL = process.env.SEED_PIMPINAN_EMAIL ?? "pimpinan@lppm.ac.id";
const PIMPINAN_PASS = process.env.SEED_PIMPINAN_PASSWORD ?? "Pimpinan123!";

function sederhana(target: string, val: string) {
  if (!target || typeof target !== "string") throw new Error(`Nilai seed "${val}" tidak valid`);
}

async function main() {
  console.log("🌱 Seeding SIKAP-LPPM ...");

  // Bersihkan data lama (urutan penting karena foreign key)
  await prisma.jawabanResponse.deleteMany();
  await prisma.surveiResponse.deleteMany();
  await prisma.opsi.deleteMany();
  await prisma.pertanyaan.deleteMany();
  await prisma.kuesioner.deleteMany();
  await prisma.notifikasiEmail.deleteMany();
  await prisma.mitra.deleteMany();
  await prisma.user.deleteMany();

  const hash = (p: string) => bcrypt.hash(p, 10);

  // ===== Pengguna internal =====
  const admin = await prisma.user.create({
    data: {
      nama: "Admin LPPM",
      email: ADMIN_EMAIL.toLowerCase(),
      passwordHash: await hash(ADMIN_PASS),
      role: Role.ADMIN,
    },
  });

  const pimpinan = await prisma.user.create({
    data: {
      nama: "Drs. Pimpinan, M.Si.",
      email: PIMPINAN_EMAIL.toLowerCase(),
      passwordHash: await hash(PIMPINAN_PASS),
      role: Role.PIMPINAN,
    },
  });

  console.log(`  ✓ Admin  : ${admin.email}`);
  console.log(`  ✓ Pimpinan: ${pimpinan.email}`);

  // ===== Mitra + akun masuk =====
  const dataMitra = [
    {
      nama: "Desa Binaan Sejahtera",
      jenis: "DESA_BINAAN" as const,
      kontak: "0852-1111-0001",
      email: "desabinaan.sejahtera@example.com",
      password: "Mitra123!",
    },
    {
      nama: "PT Maju Bersama Industri",
      jenis: "INDUSTRI" as const,
      kontak: "0852-1111-0002",
      email: "humas@majubersama.co.id",
      password: "Mitra123!",
    },
    {
      nama: "Dinas Koperasi Kab. Contoh",
      jenis: "INSTANSI_PEMERINTAH" as const,
      kontak: "0852-1111-0003",
      email: "dinaskop@example.go.id",
      password: "Mitra123!",
    },
    {
      nama: "Desa Binaan Kreatif",
      jenis: "DESA_BINAAN" as const,
      kontak: "0852-1111-0004",
      email: "kreatif.desa@example.com",
      password: "Mitra123!",
    },
  ];

  const mitraTerdaftar = [];
  for (const m of dataMitra) {
    sederhana(m.nama, "nama");
    sederhana(m.kontak, "kontak");
    const mitra = await prisma.mitra.create({
      data: {
        nama: m.nama,
        jenis: m.jenis,
        kontak: m.kontak,
        qrToken: `qr-${m.email.split("@")[0]}-${Date.now()}`,
        user: {
          create: {
            nama: m.nama,
            email: m.email,
            passwordHash: await hash(m.password),
            role: Role.MITRA,
          },
        },
      },
    });
    mitraTerdaftar.push(mitra);
    console.log(`  ✓ Mitra: ${m.nama} (${m.email})`);
  }

  // ===== Kuesioner contoh (5 pertanyaan campuran) =====
  const kuesioner = await prisma.kuesioner.create({
    data: {
      judul: "Survey Kepuasan Mitra LPPM 2026",
      deskripsi:
        "Mohon berikan penilaian Anda terhadap kerja sama, pendampingan, dan layanan LPPM kepada mitra. Setiap masukan sangat kami hargai.",
      isActive: true,
      createdById: admin.id,
      pertanyaan: {
        create: [
          {
            teks: "Bagaimana tingkat kepuasan Anda terhadap proses kerja sama dengan LPPM?",
            tipe: "SKALA_1_5",
            urutan: 0,
          },
          {
            teks: "Bagaimana respons dan kecepatan layanan staf/program LPPM?",
            tipe: "SKALA_1_5",
            urutan: 1,
          },
          {
            teks: "Apakah output kegiatan (pelatihan, pendampingan, pendampingan desa) sesuai harapan?",
            tipe: "PILIHAN_GANDA",
            urutan: 2,
            opsi: {
              create: [
                { teks: "Sangat sesuai" },
                { teks: "Sesuai" },
                { teks: "Cukup sesuai" },
                { teks: "Kurang sesuai" },
                { teks: "Tidak sesuai" },
              ],
            },
          },
          {
            teks: "Seberapa besar manfaat kegiatan LPPM bagi mitra Anda?",
            tipe: "SKALA_1_5",
            urutan: 3,
          },
          {
            teks: "Berikan saran atau kritik untuk perbaikan layanan LPPM ke depan.",
            tipe: "TEKS_BEBAS",
            urutan: 4,
          },
        ],
      },
    },
    include: { pertanyaan: { include: { opsi: true } } },
  });
  console.log(`  ✓ Kuesioner: ${kuesioner.judul} (${kuesioner.pertanyaan.length} pertanyaan)`);

  // ===== Contoh respons (biar dashboard langsung ada data) =====
  const [q1, q2, q3, q4, q5] = kuesioner.pertanyaan.sort((a, b) => a.urutan - b.urutan);
  const contoh = [
    { mitra: mitraTerdaftar[0], skala: [5, 4], pilihan: q3.opsi[1], teks: "Layanan sangat membantu dan responsif. Terima kasih!" },
    { mitra: mitraTerdaftar[1], skala: [4, 4], pilihan: q3.opsi[1], teks: "Kerja sama cukup lancar, hanya butuh kecepatan tindak lanjut." },
    { mitra: mitraTerdaftar[2], skala: [3, 4], pilihan: q3.opsi[2], teks: "Beberapa dokumen lambat diproses, mohon diperbaiki." },
  ];

  for (const c of contoh) {
    await prisma.surveiResponse.create({
      data: {
        kuesionerId: kuesioner.id,
        mitraId: c.mitra.id,
        jawaban: {
          create: [
            { pertanyaanId: q1.id, nilaiSkala: c.skala[0] },
            { pertanyaanId: q2.id, nilaiSkala: c.skala[1] },
            { pertanyaanId: q3.id, opsiId: c.pilihan.id },
            { pertanyaanId: q4.id, nilaiSkala: c.skala[0] === 5 ? 5 : 4 },
            { pertanyaanId: q5.id, teksBebas: c.teks, sentimen: c.skala[0] === 5 ? "POSITIF" : c.skala[0] === 3 ? "NEGATIF" : "NETRAL" },
          ],
        },
      },
    });
  }
  console.log("  ✓ 3 contoh respons survei dibuat");

  console.log("\n✅ Seed selesai.");
  console.log("=============================================");
  console.log(`Admin   : ${ADMIN_EMAIL} / ${ADMIN_PASS}`);
  console.log(`Pimpinan: ${PIMPINAN_EMAIL} / ${PIMPINAN_PASS}`);
  console.log(`Mitra   : ${dataMitra[0].email} / ${dataMitra[0].password}`);
  console.log("=============================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });