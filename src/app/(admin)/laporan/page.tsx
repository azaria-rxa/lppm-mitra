"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { DataLaporan } from "@/types";
import { formatAngka } from "@/lib/utils";
import { LABEL_JENIS_MITRA, LABEL_SENTIMEN } from "@/lib/laporan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GrafikPerJenis, GrafikTren } from "@/components/admin/grafik-kepuasan";

const TAHUN_NOW = new Date().getFullYear();

export default function LaporanPage() {
  const [jenis, setJenis] = useState<"TAHUNAN" | "BULANAN">("TAHUNAN");
  const [tahun, setTahun] = useState(TAHUN_NOW);
  const [bulan, setBulan] = useState(String(new Date().getMonth() + 1).padStart(2, "0"));
  const [data, setData] = useState<DataLaporan | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const periode = useMemo(() => (jenis === "BULANAN" ? `${tahun}-${bulan}` : String(tahun)), [jenis, tahun, bulan]);

  async function muatLaporan() {
    setLoading(true);
    try {
      const res = await fetch(`/api/laporan/periode?jenis=${jenis}&periode=${periode}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal memuat laporan");
      setData(json.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  }

  async function exportPdf() {
    setPdfLoading(true);
    try {
      const res = await fetch("/api/laporan/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jenis, periode }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? "Gagal membuat PDF");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-kepuasan-${jenis.toLowerCase()}-${periode}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF laporan berhasil diunduh.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat PDF");
    } finally {
      setPdfLoading(false);
    }
  }

  const skorParsen = data?.indeksKepuasan != null ? (data.indeksKepuasan / 5) * 100 : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Laporan Kepuasan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Generate laporan periodik dan export ke PDF (dengan grafik & ringkasan statistik).
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-5">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-500">Jenis Periode</p>
            <Select value={jenis} onValueChange={(v) => setJenis(v as "TAHUNAN" | "BULANAN")}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TAHUNAN">Tahunan</SelectItem>
                <SelectItem value="BULANAN">Bulanan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-500">Tahun</p>
            <Select value={String(tahun)} onValueChange={(v) => setTahun(Number(v))}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[TAHUN_NOW, TAHUN_NOW - 1, TAHUN_NOW - 2, TAHUN_NOW - 3].map((t) => (
                  <SelectItem key={t} value={String(t)}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {jenis === "BULANAN" && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-500">Bulan</p>
              <Select value={bulan} onValueChange={setBulan}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((b) => (
                    <SelectItem key={b} value={b}>
                      {["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"][Number(b) - 1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={muatLaporan} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Tampilkan
            </Button>
            {data && (
              <Button variant="outline" onClick={exportPdf} disabled={pdfLoading}>
                {pdfLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : data ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-primary" />
                Ringkasan {data.periodeLabel}
                <Badge variant={data.indeksKepuasan != null && data.indeksKepuasan >= 4 ? "success" : "warning"}>
                  {skorParsen != null ? `${formatAngka(skorParsen)}% kepuasan` : "belum ada data"}
                </Badge>
              </CardTitle>
              <CardDescription>Dibuat {new Date(data.dibuatPada).toLocaleString("id-ID")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-xs text-slate-500">Indeks Kepuasan</p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    {data.indeksKepuasan != null ? `${formatAngka(data.indeksKepuasan)}` : "N/A"}
                    <span className="text-sm font-normal text-slate-400"> / 5</span>
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4">
                  <p className="text-xs text-slate-500">Survei Terisi</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-700">{data.totalResponse}</p>
                </div>
                <div className="rounded-lg bg-violet-50 p-4">
                  <p className="text-xs text-slate-500">Total Mitra</p>
                  <p className="mt-1 text-2xl font-bold text-violet-700">{data.totalMitra}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tren Skor</CardTitle>
                <CardDescription>
                  {jenis === "BULANAN" ? "6 bulan terakhir" : "12 bulan terakhir"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GrafikTren data={data.tren} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skor per Jenis Mitra</CardTitle>
              </CardHeader>
              <CardContent>
                <GrafikPerJenis data={data.perJenis} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rincian per Pertanyaan</CardTitle>
            </CardHeader>
            <CardContent>
              {data.perPertanyaan.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pertanyaan</TableHead>
                      <TableHead className="w-24">Skor Rata-rata</TableHead>
                      <TableHead className="w-20">Respons</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.perPertanyaan.map((p) => (
                      <TableRow key={p.pertanyaanId}>
                        <TableCell>{p.teks}</TableCell>
                        <TableCell className="font-semibold">
                          {p.rataRata != null ? formatAngka(p.rataRata) : "-"}
                        </TableCell>
                        <TableCell className="text-slate-500">{p.totalRespons}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-4 text-center text-sm text-slate-400">Belum ada data skala pada periode ini.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Komentar & Sentimen</CardTitle>
              <CardDescription>Analisis sentimen otomatis pada jawaban teks bebas</CardDescription>
            </CardHeader>
            <CardContent>
              {data.komentar.length > 0 ? (
                <div className="space-y-2">
                  {data.komentar.map((k, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                      <p className="text-sm text-slate-700">“{k.teks}”</p>
                      <Badge
                        variant={
                          k.sentimen === "POSITIF"
                            ? "success"
                            : k.sentimen === "NEGATIF"
                              ? "destructive"
                              : "secondary"
                        }
                        className="shrink-0"
                      >
                        {k.sentimen ? LABEL_SENTIMEN[k.sentimen] : "—"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-slate-400">Belum ada komentar pada periode ini.</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center text-sm text-slate-400">
            <FileText className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            Pilih periode lalu klik <strong>Tampilkan</strong> untuk melihat ringkasan laporan.
          </CardContent>
        </Card>
      )}
    </div>
  );
}