"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { z, type ZodTypeAny } from "zod";
import { toast } from "sonner";
import type { TipePertanyaan } from "@prisma/client";
import type { JawabanSubmit } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface PertanyaanIsi {
  id: string;
  teks: string;
  tipe: TipePertanyaan;
  opsi: { id: string; teks: string }[];
}

export interface KuesionerIsi {
  id: string;
  judul: string;
  deskripsi: string | null;
  isActive: boolean;
  pertanyaan: PertanyaanIsi[];
}

const LABEL_SKALA = ["Sangat Tidak Puas", "Tidak Puas", "Cukup", "Puas", "Sangat Puas"];

type FormValues = Record<string, string | number>;

function buatSchema(pertanyaan: PertanyaanIsi[]) {
  const shape: Record<string, ZodTypeAny> = {};
  for (const p of pertanyaan) {
    if (p.tipe === "SKALA_1_5") {
      shape[p.id] = z.coerce.number({ message: "Skor wajib dipilih" }).int().min(1).max(5);
    } else if (p.tipe === "PILIHAN_GANDA") {
      shape[p.id] = z.string().min(1, "Pilih salah satu opsi");
    } else {
      shape[p.id] = z.string().min(1, "Jawaban wajib diisi").max(2000, "Maksimal 2000 karakter");
    }
  }
  return z.object(shape);
}

export function FormSurveiDinamis({ kuesioner }: { kuesioner: KuesionerIsi }) {
  const schema = useMemo(() => buatSchema(kuesioner.pertanyaan), [kuesioner.pertanyaan]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const [selesai, setSelesai] = useState(false);
  const nilai = watch();
  const jumlahTerisi = useMemo(
    () =>
      kuesioner.pertanyaan.filter((p) => {
        const v = nilai[p.id];
        return v !== undefined && v !== null && v !== "";
      }).length,
    [nilai, kuesioner.pertanyaan]
  );
  const progress = Math.round((jumlahTerisi / kuesioner.pertanyaan.length) * 100);

  async function onSubmit(data: FormValues) {
    const jawaban: JawabanSubmit[] = kuesioner.pertanyaan.map((p) => {
      const nilaiKunci = data[p.id];
      if (p.tipe === "SKALA_1_5") {
        return { pertanyaanId: p.id, tipe: p.tipe, nilaiSkala: Number(nilaiKunci) };
      }
      if (p.tipe === "PILIHAN_GANDA") {
        return { pertanyaanId: p.id, tipe: p.tipe, opsiId: String(nilaiKunci) };
      }
      return { pertanyaanId: p.id, tipe: p.tipe, teksBebas: String(nilaiKunci) };
    });

    try {
      const res = await fetch("/api/survei", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kuesionerId: kuesioner.id, jawaban }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal mengirim survei");
      setSelesai(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim survei");
    }
  }

  if (selesai) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          <h2 className="text-xl font-bold">Survei Berhasil Dikirim</h2>
          <p className="text-sm text-slate-500">
            Terima kasih, <strong>{kuesioner.judul}</strong> sudah kami terima. Masukan Anda sangat
            berarti bagi peningkatan layanan LPPM.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Kembali ke Daftar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardContent className="space-y-3 p-4">
          <h1 className="text-lg font-bold leading-tight">{kuesioner.judul}</h1>
          {kuesioner.deskripsi && <p className="text-sm text-slate-500">{kuesioner.deskripsi}</p>}
          <div className="space-y-1.5">
            <Progress value={progress} />
            <p className="text-xs text-slate-500">
              {jumlahTerisi} / {kuesioner.pertanyaan.length} pertanyaan terjawab ({progress}%)
            </p>
          </div>
        </CardContent>
      </Card>

      {kuesioner.pertanyaan.map((p, i) => {
        const err = errors[p.id];
        return (
          <Card key={p.id}>
            <CardContent className="space-y-4 p-4">
              <p className="flex items-start gap-2 text-sm font-medium">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                {p.teks}
                {err && <span className="sr-only">wajib</span>}
              </p>

              {p.tipe === "SKALA_1_5" && (
                <Controller
                  control={control}
                  name={p.id}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => field.onChange(n)}
                            className={cn(
                              "flex h-14 items-center justify-center rounded-xl border-2 text-lg font-bold transition-all active:scale-95",
                              field.value === n
                                ? "border-primary bg-primary text-primary-foreground shadow"
                                : "border-slate-200 bg-white text-slate-600"
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Sangat Tidak Puas</span>
                        <span>Sangat Puas</span>
                      </div>
                      {err && <p className="text-xs text-red-600">{err.message as string}</p>}
                    </div>
                  )}
                />
              )}

              {p.tipe === "PILIHAN_GANDA" && (
                <Controller
                  control={control}
                  name={p.id}
                  render={({ field }) => (
                    <div>
                      <RadioGroup value={field.value as string} onValueChange={field.onChange}>
                        {p.opsi.map((o) => (
                          <label
                            key={o.id}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-sm transition-all",
                              field.value === o.id
                                ? "border-primary bg-primary/5"
                                : "border-slate-200"
                            )}
                          >
                            <RadioGroupItem value={o.id} id={`opt-${o.id}`} />
                            <Label htmlFor={`opt-${o.id}`} className="flex-1 cursor-pointer font-normal">
                              {o.teks}
                            </Label>
                          </label>
                        ))}
                      </RadioGroup>
                      {err && <p className="mt-1 text-xs text-red-600">{err.message as string}</p>}
                    </div>
                  )}
                />
              )}

              {p.tipe === "TEKS_BEBAS" && (
                <Controller
                  control={control}
                  name={p.id}
                  render={({ field }) => (
                    <div>
                      <Textarea
                        rows={4}
                        placeholder="Tuliskan jawaban Anda di sini..."
                        value={field.value as string}
                        onChange={field.onChange}
                        className={cn(err && "border-red-400")}
                      />
                      {err && <p className="mt-1 text-xs text-red-600">{err.message as string}</p>}
                    </div>
                  )}
                />
              )}
            </CardContent>
          </Card>
        );
      })}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Kirim Jawaban
      </Button>
    </form>
  );
}