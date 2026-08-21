// Definisi kuesioner tambahan — dipakai oleh seed utama & script penambah kuesioner.
// Urutan pertanyaan ditentukan lewat properti `urutan`.

export type DefinisiKuesioner = {
  judul: string;
  deskripsi: string;
  pertanyaan: Array<{
    teks: string;
    tipe: "SKALA_1_5" | "PILIHAN_GANDA" | "TEKS_BEBAS";
    urutan: number;
    opsi?: string[];
  }>;
};

export const KUESIONER_TAMBAHAN: DefinisiKuesioner[] = [
  {
    judul: "Survei Layanan Pendampingan Proposal 2026",
    deskripsi:
      "Survei ini bertujuan menilai kualitas layanan pendampingan penyusunan dan pengajuan proposal kerja sama di LPPM. Waktu pengisian kurang lebih 3 menit.",
    pertanyaan: [
      {
        teks: "Seberapa mudah proses pengajuan proposal yang Anda alami?",
        tipe: "SKALA_1_5",
        urutan: 0,
      },
      {
        teks: "Seberapa jelas informasi dan arahan yang diberikan pendamping proposal?",
        tipe: "SKALA_1_5",
        urutan: 1,
      },
      {
        teks: "Aspek mana yang paling membantu Anda selama proses proposal?",
        tipe: "PILIHAN_GANDA",
        urutan: 2,
        opsi: [
          "Pendampingan penyusunan",
          "Kecepatan review dan revisi",
          "Sosialisasi program",
          "Kemudahan administrasi",
        ],
      },
      {
        teks: "Apa saran Anda agar proses proposal ke depan lebih baik?",
        tipe: "TEKS_BEBAS",
        urutan: 3,
      },
    ],
  },
  {
    judul: "Evaluasi Kegiatan Pengabdian Masyarakat Semester I 2026",
    deskripsi:
      "Mohon evaluasi kegiatan pengabdian kepada masyarakat yang telah dilaksanakan bersama mitra pada semester ini.",
    pertanyaan: [
      {
        teks: "Seberapa besar manfaat kegiatan bagi masyarakat setempat?",
        tipe: "SKALA_1_5",
        urutan: 0,
      },
      {
        teks: "Bagaimana kesiapan dan profesionalitas tim pelaksana di lapangan?",
        tipe: "SKALA_1_5",
        urutan: 1,
      },
      {
        teks: "Bagaimana frekuensi pendampingan yang Anda terima selama kegiatan?",
        tipe: "PILIHAN_GANDA",
        urutan: 2,
        opsi: [
          "Rutin setiap bulan",
          "Setiap semester",
          "Sekali di awal kegiatan",
          "Hampir tidak ada",
        ],
      },
      {
        teks: "Apa harapan Anda untuk kegiatan pengabdian berikutnya?",
        tipe: "TEKS_BEBAS",
        urutan: 3,
      },
    ],
  },
  {
    judul: "Survei Komunikasi & Administrasi Kerja Sama",
    deskripsi:
      "Survei singkat mengenai pengalaman Anda berkomunikasi dan mengurus dokumen kerja sama (MoU/MoA) dengan LPPM.",
    pertanyaan: [
      {
        teks: "Seberapa cepat tanggapan LPPM atas email/pesan yang Anda kirim?",
        tipe: "SKALA_1_5",
        urutan: 0,
      },
      {
        teks: "Seberapa mudah proses pengurusan dokumen kerja sama (MoU/MoA)?",
        tipe: "SKALA_1_5",
        urutan: 1,
      },
      {
        teks: "Media komunikasi apa yang paling nyaman untuk Anda?",
        tipe: "PILIHAN_GANDA",
        urutan: 2,
        opsi: ["Email", "WhatsApp", "Telepon", "Kunjungan langsung"],
      },
      {
        teks: "Ada masukan lain terkait komunikasi atau administrasi kami?",
        tipe: "TEKS_BEBAS",
        urutan: 3,
      },
    ],
  },
];
