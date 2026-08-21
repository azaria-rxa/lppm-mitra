import nodemailer from "nodemailer";

const EMAIL_FROM = process.env.EMAIL_FROM ?? "SIKAP LPPM <no-reply@sikap-lppm.ac.id>";

function buatTransporter() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD ?? "",
        }
      : undefined,
  });
}

export interface KirimEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Kirim email. Jika SMTP belum dikonfigurasi (SMTP_HOST kosong),
 * email akan di-"skip" dan ditandai agar tidak menggagalkan proses.
 */
export async function kirimEmail(params: KirimEmailParams): Promise<{
  ok: boolean;
  skipped: boolean;
  message: string;
}> {
  const transporter = buatTransporter();
  if (!transporter) {
    return {
      ok: true,
      skipped: true,
      message: "SMTP belum dikonfigurasi; email dilewati",
    };
  }

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return { ok: true, skipped: false, message: "Email terkirim" };
  } catch (err) {
    return {
      ok: false,
      skipped: false,
      message: err instanceof Error ? err.message : "Gagal mengirim email",
    };
  }
}

export function templateNotifikasiSurvei(params: {
  nama: string;
  judulKuesioner: string;
  deskripsi?: string | null;
  url: string;
}): string {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px">
  <h2 style="color:#1e3a8a;margin:0 0 8px">Undangan Survei Kepuasan</h2>
  <p>Yth. Mitra <strong>${params.nama}</strong>,</p>
  <p>Kami mengundang Anda untuk mengisi survei kepuasan mitra <strong>"${params.judulKuesioner}"</strong>.</p>
  ${params.deskripsi ? `<p style="color:#475569">${params.deskripsi}</p>` : ""}
  <p>Silakan klik tombol di bawah ini untuk mulai mengisi survei:</p>
  <p style="text-align:center;margin:24px 0">
    <a href="${params.url}" style="background:#1e3a8a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold">Isi Survei Sekarang</a>
  </p>
  <p style="color:#64748b;font-size:12px">Jika tombol tidak berfungsi, salin tautan berikut: ${params.url}</p>
  <p style="color:#94a3b8;font-size:12px">— SIKAP LPPM, Lembaga Penelitian dan Pengabdian kepada Masyarakat</p>
</div>`;
}

export function templateReminderSurvei(params: {
  nama: string;
  judulKuesioner: string;
  url: string;
}): string {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #fde68a;border-radius:12px;background:#fffbeb">
  <h2 style="color:#92400e;margin:0 0 8px">Pengingat: Survei Belum Diisi</h2>
  <p>Yth. Mitra <strong>${params.nama}</strong>,</p>
  <p>Kami melihat Anda belum mengisi survei <strong>"${params.judulKuesioner}"</strong>. Partisipasi Anda sangat membantu perbaikan layanan kami.</p>
  <p style="text-align:center;margin:24px 0">
    <a href="${params.url}" style="background:#d97706;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold">Isi Survei Sekarang</a>
  </p>
  <p style="color:#64748b;font-size:12px">— SIKAP LPPM</p>
</div>`;
}