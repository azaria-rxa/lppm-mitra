"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PertanyaanDraft } from "@/components/admin/kuesioner-builder";

const TIPE_LABEL: Record<string, string> = {
  SKALA_1_5: "Skala 1-5",
  PILIHAN_GANDA: "Pilihan Ganda",
  TEKS_BEBAS: "Teks Bebas",
};

interface Props {
  data: {
    judul: string;
    deskripsi: string | null;
    isActive: boolean;
    pertanyaan: PertanyaanDraft[];
    _count: { responses: number };
  };
}

export function DetailKuesioner({ data }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{data.judul}</h3>
          {data.isActive ? (
            <Badge variant="success">Aktif</Badge>
          ) : (
            <Badge variant="secondary">Nonaktif</Badge>
          )}
        </div>
        <p className="text-sm text-slate-500">
          {data.deskripsi || "Tanpa deskripsi"} · {data._count.responses} respons terkumpul
        </p>
      </div>

      <Separator />

      <ol className="space-y-3">
        {data.pertanyaan.map((p, i) => (
          <li key={p.key ?? p.id ?? i} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                {p.teks}
              </p>
              <Badge variant="outline">{TIPE_LABEL[p.tipe]}</Badge>
            </div>
            {p.tipe === "PILIHAN_GANDA" && (
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {p.opsi.map((o, oi) => (
                  <li key={oi} className="rounded bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    • {o.teks}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}