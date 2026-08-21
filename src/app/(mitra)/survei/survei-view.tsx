"use client";

import Link from "next/link";
import useSWR from "swr";
import { CheckCircle2, ClipboardList, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatTanggalPendek } from "@/lib/utils";

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json().then((j) => (r.ok ? j.data : Promise.reject(new Error(j.error)))));

export type SurveiTersedia = {
  id: string;
  judul: string;
  deskripsi: string | null;
  jumlahPertanyaan: number;
  createdAt: string;
  sudahDiisi: boolean;
  diisiPada: string | null;
};

export function SurveiView({ initialData }: { initialData: SurveiTersedia[] }) {
  const { data } = useSWR<SurveiTersedia[]>("/api/survei/tersedia", fetcher, {
    fallbackData: initialData,
    refreshInterval: 20000,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Survei Kepuasan</h1>
        <p className="text-sm text-slate-500">Kuesioner aktif yang bisa Anda isi.</p>
      </div>

      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((s) => (
            <Card key={s.id} className={s.sudahDiisi ? "opacity-80" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold leading-tight">{s.judul}</p>
                      {s.deskripsi && (
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">{s.deskripsi}</p>
                      )}
                      <p className="mt-2 text-xs text-slate-400">
                        {s.jumlahPertanyaan} pertanyaan · dibuat {formatTanggalPendek(s.createdAt)}
                      </p>
                    </div>
                  </div>
                  {s.sudahDiisi ? (
                    <Badge variant="success" className="shrink-0 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Terisi
                    </Badge>
                  ) : (
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
                  )}
                </div>

                {!s.sudahDiisi ? (
                  <Link
                    href={`/survei/${s.id}`}
                    className="mt-3 flex items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    Mulai Isi Survei
                  </Link>
                ) : (
                  <p className="mt-3 rounded-lg bg-emerald-50 py-2.5 text-center text-xs text-emerald-700">
                    Terima kasih telah mengisi pada {formatTanggalPendek(s.diisiPada)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center text-sm text-slate-400">
            Belum ada survei aktif. Silakan kembali lagi nanti.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
