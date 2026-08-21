"use client";

import useSWR from "swr";
import { History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KartuRiwayat, type RiwayatItem } from "@/components/mitra/kartu-riwayat";

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json().then((j) => (r.ok ? j.data : Promise.reject(new Error(j.error)))));

export default function RiwayatPage() {
  const { data, error, isLoading } = useSWR<RiwayatItem[]>("/api/survei/riwayat", fetcher);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Riwayat Survei</h1>
        <p className="text-sm text-slate-500">Daftar kuesioner yang sudah Anda isi.</p>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-red-600">Gagal memuat riwayat.</CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((item) => (
            <KartuRiwayat key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center text-sm text-slate-400">
            <History className="h-8 w-8 text-slate-300" />
            Belum ada survei yang Anda isi. Kunjungi menu <strong>Survei</strong>.
          </CardContent>
        </Card>
      )}
    </div>
  );
}