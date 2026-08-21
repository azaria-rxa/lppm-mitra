import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Sebarkan submittedAt seluruh respons yang ada ke rentang 12 bulan terakhir
 * agar grafik tren di dashboard terlihat berisi. Tidak ada data yang dihapus.
 */
async function main() {
  console.log("📈 Menyebarkan respons ke 12 bulan terakhir ...");

  const responses = await prisma.surveiResponse.findMany({
    orderBy: { submittedAt: "asc" },
  });
  if (responses.length === 0) {
    console.log("Tidak ada respons untuk disebarkan.");
    return;
  }

  const n = responses.length;
  const now = new Date();

  let i = 0;
  for (const r of responses) {
    const offset = n === 1 ? 0 : Math.round((i / (n - 1)) * 11);
    const submittedAt = new Date(
      now.getFullYear(),
      now.getMonth() - offset,
      10 + ((i * 2) % 15),
      r.submittedAt.getHours(),
      r.submittedAt.getMinutes()
    );
    await prisma.surveiResponse.update({
      where: { id: r.id },
      data: { submittedAt },
    });
    console.log(`  ✓ respons ${r.id.slice(-6)} -> ${submittedAt.toISOString().slice(0, 10)}`);
    i++;
  }

  console.log(`\n✅ ${n} respons disebar. Grafik tren dashboard kini berisi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
