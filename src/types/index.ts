import type { JenisMitra, Role, Sentimen, TipePertanyaan } from "@prisma/client";

export { type Role, type JenisMitra, type TipePertanyaan, type Sentimen };

/** Session user yang dipakai klien setelah login */
export interface SessionUser {
  id: string;
  nama: string;
  email: string;
  role: Role;
  mitraId?: string;
}

/** Jawaban yang dikirim klien saat submit survei */
export interface JawabanSubmit {
  pertanyaanId: string;
  tipe: TipePertanyaan;
  nilaiSkala?: number;
  opsiId?: string;
  teksBebas?: string;
}

export interface SubmitSurveiPayload {
  kuesionerId: string;
  jawaban: JawabanSubmit[];
}

/** Skor kepuasan tiap pertanyaan skala */
export interface SkorPerPertanyaan {
  pertanyaanId: string;
  teks: string;
  tipe: TipePertanyaan;
  rataRata: number | null;
  totalRespons: number;
}

/** Data untuk grafik tren bulanan */
export interface TrenBulanan {
  bulan: string;
  skor: number | null;
  jumlah: number;
}

/** Data breakdown per jenis mitra */
export interface SkorPerJenisMitra {
  jenis: JenisMitra;
  skor: number | null;
  jumlah: number;
}

/** Payload laporan penuh untuk export PDF */
export interface DataLaporan {
  periodeJenis: "BULANAN" | "TAHUNAN";
  periodeLabel: string;
  dibuatPada: string;
  totalResponse: number;
  totalMitra: number;
  indeksKepuasan: number | null;
  tren: TrenBulanan[];
  perJenis: SkorPerJenisMitra[];
  perPertanyaan: SkorPerPertanyaan[];
  komentar: { teks: string; sentimen: Sentimen | null }[];
}

/** Data dashboard real-time untuk admin/pimpinan */
export interface DataDashboard {
  indeksKepuasan: number | null;
  totalResponse: number;
  totalMitra: number;
  totalKuesionerAktif: number;
  tren: TrenBulanan[];
  perJenis: SkorPerJenisMitra[];
  perPertanyaan: SkorPerPertanyaan[];
}

export type StatusAPI<T = unknown> = {
  ok: true;
  data: T;
} | {
  ok: false;
  error: string;
};