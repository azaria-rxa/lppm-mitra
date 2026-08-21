"use client";

import useSWR from "swr";
import { Building2, ClipboardList, Gauge, Send } from "lucide-react";
import type { DataDashboard } from "@/types";
import { formatAngka } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GrafikPerJenis, GrafikTren } from "@/components/admin/grafik-kepuasan";

const fetcher = (url: string) => fetch(url).then((r) => {
  if (!r.ok) throw new Error("Gagal memuat data");
  return r.json().then((j) => j.data as DataDashboard);
});

function KartuStat({
  icon: Icon,
  label,
  nilai,
  sub,
  warna = "text-primary bg-primary/10",
  aksen = "from-blue-900 to-blue-700",
}: {
  icon: React.ElementType;
  label: string;
  nilai: string;
  sub?: string;
  warna?: string;
  aksen?: string;
}) {
  return (
    <Card className="card-hover group relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${aksen}`} />
      <CardContent className="flex items-start gap-4 p-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${warna}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 truncate text-2xl font-bold text-slate-900">{nilai}</p>
          {sub && <p className="truncate text-xs text-slate-400">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function LoadKartu() {
  return (
    <Card>
      <CardContent className="p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-7 w-16" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR<DataDashboard>("/api/laporan/data", fetcher, {
    refreshInterval: 15000, // sinkronisasi otomatis (real-time "soft")
  });

  const skorParsen = data?.indeksKepuasan != null ? (data.indeksKepuasan / 5) * 100 : null;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up flex flex-wrap items-center justify-between gap-3 rounded-xl gradient-unnes p-5 text-white shadow-lg shadow-blue-950/20">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Kepuasan</h1>
          <p className="mt-1 text-sm text-blue-100">
            Indeks kepuasan mitra LPPM — data diperbarui otomatis.
          </p>
        </div>
        {data && (
          <Badge className="gap-1.5 border-transparent bg-white/15 text-white backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            Live
          </Badge>
        )}
      </div>

      {error && (
        <Card className="card-hover">
          <CardContent className="p-4 text-sm text-red-600">
            Gagal memuat data dashboard. Muat ulang halaman.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !data ? (
          <>
            <LoadKartu />
            <LoadKartu />
            <LoadKartu />
            <LoadKartu />
          </>
        ) : (
          <>
            <KartuStat
              icon={Gauge}
              label="Indeks Kepuasan"
              nilai={data.indeksKepuasan != null ? `${formatAngka(data.indeksKepuasan)} / 5` : "N/A"}
              sub={skorParsen != null ? `${formatAngka(skorParsen)}%` : "Belum ada data"}
              warna="text-blue-700 bg-blue-100"
              aksen="from-blue-900 to-blue-600"
            />
            <KartuStat
              icon={Send}
              label="Survei Terisi"
              nilai={String(data.totalResponse)}
              sub="total respons"
              warna="text-emerald-700 bg-emerald-100"
              aksen="from-emerald-700 to-emerald-500"
            />
            <KartuStat
              icon={Building2}
              label="Total Mitra"
              nilai={String(data.totalMitra)}
              sub="terdaftar"
              warna="text-violet-700 bg-violet-100"
              aksen="from-violet-700 to-violet-500"
            />
            <KartuStat
              icon={ClipboardList}
              label="Kuesioner Aktif"
              nilai={String(data.totalKuesionerAktif)}
              sub="sedang berlangsung"
              warna="text-amber-700 bg-amber-100"
              aksen="from-amber-500 to-amber-400"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-base">Tren Skor Kepuasan</CardTitle>
            <CardDescription>Rata-rata skor skala (1-5) per bulan, 12 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <GrafikTren data={data?.tren ?? []} />
            )}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-base">Skor per Jenis Mitra</CardTitle>
            <CardDescription>Desa binaan, industri, dan instansi pemerintah</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[280px] w-full" /> : <GrafikPerJenis data={data?.perJenis ?? []} />}
          </CardContent>
        </Card>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-base">Detail Skor per Pertanyaan</CardTitle>
          <CardDescription>Pertanyaan berjenis skala 1-5</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : data?.perPertanyaan.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pertanyaan</TableHead>
                  <TableHead className="w-20">Skor</TableHead>
                  <TableHead className="w-20">Respons</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.perPertanyaan.map((p) => (
                  <TableRow key={p.pertanyaanId}>
                    <TableCell className="text-slate-700">{p.teks}</TableCell>
                    <TableCell className="font-semibold">
                      {p.rataRata != null ? formatAngka(p.rataRata) : "-"}
                    </TableCell>
                    <TableCell className="text-slate-500">{p.totalRespons}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">
              Belum ada jawaban skala. Ajak mitra untuk mengisi survei.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}