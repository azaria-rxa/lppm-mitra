import type { JenisMitra, Sentimen, TipePertanyaan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  DataLaporan,
  SkorPerJenisMitra,
  SkorPerPertanyaan,
  TrenBulanan,
} from "@/types";

export const LABEL_JENIS_MITRA: Record<JenisMitra, string> = {
  DESA_BINAAN: "Desa Binaan",
  INDUSTRI: "Industri",
  INSTANSI_PEMERINTAH: "Instansi Pemerintah",
};

export const WARNA_JENIS_MITRA: Record<JenisMitra, string> = {
  DESA_BINAAN: "bg-emerald-100 text-emerald-800",
  INDUSTRI: "bg-sky-100 text-sky-800",
  INSTANSI_PEMERINTAH: "bg-violet-100 text-violet-800",
};

export const LABEL_TIPE_PERTANYAAN: Record<TipePertanyaan, string> = {
  SKALA_1_5: "Skala 1-5",
  PILIHAN_GANDA: "Pilihan Ganda",
  TEKS_BEBAS: "Teks Bebas",
};

export const LABEL_SENTIMEN: Record<Sentimen, string> = {
  POSITIF: "Positif",
  NETRAL: "Netral",
  NEGATIF: "Negatif",
};

const KUNCI_BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function kunciBulan(tahun: number, bulan: number): string {
  return `${tahun}-${String(bulan).padStart(2, "0")}`;
}

export function labelBulan(kunci: string): string {
  const [tahun, bulan] = kunci.split("-").map(Number);
  return `${KUNCI_BULAN[bulan - 1]} ${tahun}`;
}

/** Deretan kunci bulan (mis. 6 atau 12 bulan terakhir), paling baru di akhir */
export function deretBulan(akhir: Date, jumlah: number): string[] {
  const hasil: string[] = [];
  for (let i = jumlah - 1; i >= 0; i--) {
    const d = new Date(akhir.getFullYear(), akhir.getMonth() - i, 1);
    hasil.push(kunciBulan(d.getFullYear(), d.getMonth() + 1));
  }
  return hasil;
}

type RawResponse = Awaited<
  ReturnType<typeof prisma.surveiResponse.findMany>
>;

function rataRata(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export async function hitungDataDashboard(): Promise<{
  indeksKepuasan: number | null;
  totalResponse: number;
  totalMitra: number;
  totalKuesionerAktif: number;
  tren: TrenBulanan[];
  perJenis: SkorPerJenisMitra[];
  perPertanyaan: SkorPerPertanyaan[];
}> {
  const [responses, totalMitra, totalKuesionerAktif] = await Promise.all([
    prisma.surveiResponse.findMany({
      include: {
        mitra: true,
        jawaban: { include: { pertanyaan: true } },
      },
    }),
    prisma.mitra.count(),
    prisma.kuesioner.count({ where: { isActive: true } }),
  ]);

  const skalaSemua: number[] = [];
  const perJenisMap = new Map<JenisMitra, number[]>();
  const perPertanyaanMap = new Map<
    string,
    { id: string; teks: string; tipe: TipePertanyaan; nilai: number[]; total: number }
  >();
  const perBulanMap = new Map<string, number[]>();

  for (const r of responses) {
    for (const j of r.jawaban) {
      if (j.nilaiSkala !== null) {
        skalaSemua.push(j.nilaiSkala);
        const arr = perJenisMap.get(r.mitra.jenis) ?? [];
        arr.push(j.nilaiSkala);
        perJenisMap.set(r.mitra.jenis, arr);

        const p = perPertanyaanMap.get(j.pertanyaanId) ?? {
          id: j.pertanyaanId,
          teks: j.pertanyaan.teks,
          tipe: j.pertanyaan.tipe,
          nilai: [],
          total: 0,
        };
        p.nilai.push(j.nilaiSkala);
        p.total += 1;
        perPertanyaanMap.set(j.pertanyaanId, p);

        const kunci = kunciBulan(r.submittedAt.getFullYear(), r.submittedAt.getMonth() + 1);
        const arrBulan = perBulanMap.get(kunci) ?? [];
        arrBulan.push(j.nilaiSkala);
        perBulanMap.set(kunci, arrBulan);
      }
    }
  }

  const akhirBulan = new Date();
  const deret = deretBulan(akhirBulan, 12);
  const tren: TrenBulanan[] = deret.map((k) => {
    const nilai = perBulanMap.get(k) ?? [];
    return {
      bulan: labelBulan(k),
      skor: nilai.length ? rataRata(nilai) : null,
      jumlah: nilai.length,
    };
  });

  const perJenis: SkorPerJenisMitra[] = (Object.keys(LABEL_JENIS_MITRA) as JenisMitra[]).map(
    (jenis) => {
      const nilai = perJenisMap.get(jenis) ?? [];
      return {
        jenis,
        skor: nilai.length ? rataRata(nilai) : null,
        jumlah: nilai.length,
      };
    }
  );

  const perPertanyaan: SkorPerPertanyaan[] = [...perPertanyaanMap.values()].map((p) => ({
    pertanyaanId: p.id,
    teks: p.teks,
    tipe: p.tipe,
    rataRata: p.nilai.length ? rataRata(p.nilai) : null,
    totalRespons: p.total,
  }));

  return {
    indeksKepuasan: rataRata(skalaSemua),
    totalResponse: responses.length,
    totalMitra,
    totalKuesionerAktif,
    tren,
    perJenis,
    perPertanyaan,
  };
}

export async function hitungLaporanPeriode(params: {
  jenis: "BULANAN" | "TAHUNAN";
  periode: string;
}): Promise<DataLaporan> {
  const { jenis, periode } = params;
  const window: { gte: Date; lt: Date } =
    jenis === "BULANAN"
      ? (() => {
          const [tahun, bulan] = periode.split("-").map(Number);
          if (!tahun || !bulan) throw new Error("Format periode tidak valid (Gunakan YYYY-MM)");
          return { gte: new Date(tahun, bulan - 1, 1), lt: new Date(tahun, bulan, 1) };
        })()
      : (() => {
          const tahun = Number(periode);
          if (!tahun) throw new Error("Format periode tidak valid (Gunakan YYYY)");
          return { gte: new Date(tahun, 0, 1), lt: new Date(tahun + 1, 0, 1) };
        })();

  const [responses, totalMitra] = await Promise.all([
    prisma.surveiResponse.findMany({
      where: { submittedAt: window },
      include: {
        mitra: true,
        jawaban: { include: { opsi: true, pertanyaan: true } },
      },
    }),
    prisma.mitra.count(),
  ]);

  const skalaSemua: number[] = [];
  const perBulanMap = new Map<string, number[]>();
  const perJenisMap = new Map<JenisMitra, number[]>();
  const perPertanyaanMap = new Map<
    string,
    { teks: string; tipe: TipePertanyaan; nilai: number[]; total: number }
  >();
  const komentar: { teks: string; sentimen: Sentimen | null }[] = [];

  for (const r of responses) {
    const kunci = kunciBulan(r.submittedAt.getFullYear(), r.submittedAt.getMonth() + 1);
    for (const j of r.jawaban) {
      if (j.nilaiSkala !== null) {
        skalaSemua.push(j.nilaiSkala);

        const arrBulan = perBulanMap.get(kunci) ?? [];
        arrBulan.push(j.nilaiSkala);
        perBulanMap.set(kunci, arrBulan);

        const arrJenis = perJenisMap.get(r.mitra.jenis) ?? [];
        arrJenis.push(j.nilaiSkala);
        perJenisMap.set(r.mitra.jenis, arrJenis);

        const p = perPertanyaanMap.get(j.pertanyaanId) ?? {
          teks: j.pertanyaan.teks,
          tipe: j.pertanyaan.tipe,
          nilai: [],
          total: 0,
        };
        p.nilai.push(j.nilaiSkala);
        p.total += 1;
        perPertanyaanMap.set(j.pertanyaanId, p);
      }
      if (j.teksBebas) {
        komentar.push({ teks: j.teksBebas, sentimen: j.sentimen });
      }
    }
  }

  const bulanAkhir =
    jenis === "BULANAN"
      ? (() => {
          const [tahun, bulan] = periode.split("-").map(Number);
          return new Date(tahun, bulan - 1, 1);
        })()
      : new Date(Number(periode), 11, 1);

  const deret = deretBulan(bulanAkhir, jenis === "BULANAN" ? 6 : 12);
  const tren: TrenBulanan[] = deret.map((k) => {
    const nilai = perBulanMap.get(k) ?? [];
    return {
      bulan: labelBulan(k),
      skor: nilai.length ? rataRata(nilai) : null,
      jumlah: nilai.length,
    };
  });

  const perJenis: SkorPerJenisMitra[] = (Object.keys(LABEL_JENIS_MITRA) as JenisMitra[]).map(
    (jenisKey) => {
      const nilai = perJenisMap.get(jenisKey) ?? [];
      return {
        jenis: jenisKey,
        skor: nilai.length ? rataRata(nilai) : null,
        jumlah: nilai.length,
      };
    }
  );

  const perPertanyaan: SkorPerPertanyaan[] = [...perPertanyaanMap.values()]
    .sort((a, b) => b.total - a.total)
    .map((p) => ({
      pertanyaanId: p.teks,
      teks: p.teks,
      tipe: p.tipe,
      rataRata: p.nilai.length ? rataRata(p.nilai) : null,
      totalRespons: p.total,
    }));

  const periodeLabel =
    jenis === "BULANAN"
      ? labelBulan(periode)
      : `Tahun ${periode}`;

  return {
    periodeJenis: jenis,
    periodeLabel,
    dibuatPada: new Date().toISOString(),
    totalResponse: responses.length,
    totalMitra,
    indeksKepuasan: rataRata(skalaSemua),
    tren,
    perJenis,
    perPertanyaan,
    komentar,
  };
}