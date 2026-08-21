"use client";

import { CheckCircle2 } from "lucide-react";
import { formatAngka, formatTanggal } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface RiwayatItem {
  id: string;
  judulKuesioner: string;
  submittedAt: string;
  jumlahPertanyaan: number;
  skor: number | null;
}

export function KartuRiwayat({ item }: { item: RiwayatItem }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold leading-tight">{item.judulKuesioner}</p>
              <p className="mt-1 text-xs text-slate-400">
                Diisi {formatTanggal(item.submittedAt)}
              </p>
              <p className="text-xs text-slate-400">{item.jumlahPertanyaan} pertanyaan</p>
            </div>
          </div>
          <div className="text-right">
            {item.skor != null ? (
              <>
                <p className="text-lg font-bold text-primary">{formatAngka(item.skor)}</p>
                <p className="text-[10px] text-slate-400">skor / 5</p>
              </>
            ) : (
              <Badge variant="secondary">Tanpa skala</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}