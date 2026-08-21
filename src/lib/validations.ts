import { z } from "zod";
import { JenisMitra, Role, TipePertanyaan } from "@prisma/client";

const roleEnum = z.nativeEnum(Role);
const jenisMitraEnum = z.nativeEnum(JenisMitra);
const tipePertanyaanEnum = z.nativeEnum(TipePertanyaan);

// ===== Kuesioner =====
export const opsiSchema = z.object({
  id: z.string().optional(),
  teks: z.string().min(1, "Teks opsi wajib diisi").max(200, "Teks opsi maksimal 200 karakter"),
});

export const pertanyaanSchema = z.object({
  id: z.string().optional(),
  teks: z.string().min(1, "Teks pertanyaan wajib diisi").max(1000, "Teks pertanyaan maksimal 1000 karakter"),
  tipe: tipePertanyaanEnum,
  urutan: z.number().int().min(0),
  opsi: z.array(opsiSchema),
});

export const kuesionerCreateSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").max(190, "Judul maksimal 190 karakter"),
  deskripsi: z.string().max(2000, "Deskripsi maksimal 2000 karakter").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  pertanyaan: z.array(pertanyaanSchema).min(1, "Minimal 1 pertanyaan"),
});

export const kuesionerUpdateSchema = kuesionerCreateSchema.partial().extend({
  pertanyaan: z.array(pertanyaanSchema).min(1).optional(),
});

// ===== Mitra =====
const mitraObjek = z.object({
  nama: z.string().min(2, "Nama mitra minimal 2 karakter").max(150, "Nama mitra maksimal 150 karakter"),
  jenis: jenisMitraEnum,
  kontak: z.string().min(5, "Kontak (email/telepon) tidak valid").max(190, "Kontak maksimal 190 karakter"),
  emailAkun: z.string().email("Email akun tidak valid").max(190).optional().or(z.literal("")),
  passwordAkun: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
});

export const mitraCreateSchema = mitraObjek.refine(
  (data) => !(data.emailAkun || data.passwordAkun) || (data.emailAkun && data.passwordAkun),
  { message: "Email dan password akun harus diisi keduanya", path: ["emailAkun"] }
);

/** Update bersifat parsial; logika akun ditangani di route handler */
export const mitraUpdateSchema = mitraObjek.partial();

// ===== Submit Survei =====
export const jawabanSubmitSchema = z.discriminatedUnion("tipe", [
  z.object({
    pertanyaanId: z.string().min(1),
    tipe: z.literal(TipePertanyaan.SKALA_1_5),
    nilaiSkala: z.number().int().min(1).max(5),
  }),
  z.object({
    pertanyaanId: z.string().min(1),
    tipe: z.literal(TipePertanyaan.PILIHAN_GANDA),
    opsiId: z.string().min(1, "Pilih salah satu opsi"),
  }),
  z.object({
    pertanyaanId: z.string().min(1),
    tipe: z.literal(TipePertanyaan.TEKS_BEBAS),
    teksBebas: z.string().min(1, "Jawaban tidak boleh kosong").max(2000),
  }),
]);

export const submitSurveiSchema = z.object({
  kuesionerId: z.string().min(1),
  jawaban: z.array(jawabanSubmitSchema).min(1, "Tidak ada jawaban yang dikirim"),
});

// ===== Akun (register manual admin) =====
export const registerSchema = z.object({
  nama: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: roleEnum.default(Role.MITRA),
});

// ===== Pengguna (admin & pimpinan; akun mitra dikelola lewat halaman Mitra) =====
const peranStaf = z.enum([Role.ADMIN, Role.PIMPINAN], {
  message: "Peran harus Admin atau Pimpinan",
});

export const penggunaCreateSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter").max(150, "Nama maksimal 150 karakter"),
  email: z.string().email("Email tidak valid").max(190),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: peranStaf,
});

export const penggunaUpdateSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter").max(150, "Nama maksimal 150 karakter").optional(),
  email: z.string().email("Email tidak valid").max(190).optional(),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  role: peranStaf.optional(),
});

// ===== Laporan =====
export const laporanSchema = z.object({
  jenis: z.enum(["BULANAN", "TAHUNAN"]),
  periode: z.string().min(4), // format "2026-08" atau "2026"
});

export type PertanyaanInput = z.infer<typeof pertanyaanSchema>;
export type KuesionerCreateInput = z.infer<typeof kuesionerCreateSchema>;
export type MitraCreateInput = z.infer<typeof mitraCreateSchema>;
export type SubmitSurveiInput = z.infer<typeof submitSurveiSchema>;