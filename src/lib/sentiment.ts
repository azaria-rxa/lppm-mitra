import type { Sentimen } from "@prisma/client";

const KATA_POSITIF = [
  "baik", "puas", "bagus", "membantu", "cepat", "responsif", "lancar",
  "memuaskan", "profesional", "terima kasih", "transparan", "akurat",
  "andal", "menyenangkan", "ramah", "terbantu", "efektif", "efisien",
  "hebat", "sangat baik", "mantap", "puas sekali",
];

const KATA_NEGATIF = [
  "buruk", "lambat", "lama", "tidak puas", "kecewa", "gagal", "macet",
  "sulit", "rumit", "tidak membantu", "tidak jelas", "mengeluh", "kurang",
  "parah", "tidak responsif", "mengecewakan", "banyak kendala", "kurang baik",
  "tidak memuaskan", "tidak profesional",
];

/**
 * Sentiment tagging sederhana berbasis kata kunci Bahasa Indonesia.
 * Skor dihitung dari selisih kemunculan kata positif vs negatif.
 */
export function analisisSentimen(
  teks: string
): { sentimen: Sentimen; skor: number } {
  const lower = teks.toLowerCase();
  let skor = 0;

  for (const kata of KATA_POSITIF) {
    if (lower.includes(kata)) skor += 1;
  }
  for (const kata of KATA_NEGATIF) {
    if (lower.includes(kata)) skor -= 1;
  }

  const sentimen: Sentimen = skor > 0 ? "POSITIF" : skor < 0 ? "NEGATIF" : "NETRAL";
  return { sentimen, skor };
}