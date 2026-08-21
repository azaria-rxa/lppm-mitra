"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FormSurveiDinamis, type KuesionerIsi } from "@/components/mitra/form-survei-dinamis";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function IsiSurveiPage() {
  const params = useParams<{ id: string }>();
  const [kuesioner, setKuesioner] = useState<KuesionerIsi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aktif = true;
    fetch(`/api/kuesioner/${params.id}/isi`)
      .then((r) => r.json().then((j) => ({ r, j })))
      .then(({ r, j }) => {
        if (!aktif) return;
        if (r.ok) setKuesioner(j.data);
        else setError(j.error ?? "Gagal memuat kuesioner");
      })
      .catch(() => aktif && setError("Terjadi kesalahan koneksi"))
      .finally(() => aktif && setLoading(false));
    return () => {
      aktif = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !kuesioner) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <Loader2 className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-sm text-slate-600">{error ?? "Data tidak ditemukan"}</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <FormSurveiDinamis kuesioner={kuesioner} />;
}