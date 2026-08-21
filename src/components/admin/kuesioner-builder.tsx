"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { TipePertanyaan } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export interface PertanyaanDraft {
  key: string;
  id?: string;
  teks: string;
  tipe: TipePertanyaan;
  opsi: { id?: string; teks: string }[];
}

interface Props {
  initial?: {
    id: string;
    judul: string;
    deskripsi: string | null;
    isActive: boolean;
    pertanyaan: PertanyaanDraft[];
  };
  onDone: () => void;
}

function newKey() {
  return Math.random().toString(36).slice(2, 10);
}

export function KuesionerBuilder({ initial, onDone }: Props) {
  const [judul, setJudul] = useState(initial?.judul ?? "");
  const [deskripsi, setDeskripsi] = useState(initial?.deskripsi ?? "");
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);
  const [loading, setLoading] = useState(false);
  const [pertanyaan, setPertanyaan] = useState<PertanyaanDraft[]>(
    initial?.pertanyaan ??
      [{ key: newKey(), teks: "", tipe: "SKALA_1_5", opsi: [] }]
  );

  const masalah = useMemo(() => {
    const list: string[] = [];
    if (judul.trim().length < 3) list.push("Judul minimal 3 karakter");
    pertanyaan.forEach((p, i) => {
      if (!p.teks.trim()) list.push(`Pertanyaan #${i + 1} belum diisi`);
      if (p.tipe === "PILIHAN_GANDA") {
        if (p.opsi.length < 2) list.push(`Pertanyaan #${i + 1}: pilihan ganda butuh minimal 2 opsi`);
        else {
          const kosong = p.opsi.filter((o) => !o.teks.trim()).length;
          if (kosong > 0) list.push(`Pertanyaan #${i + 1}: ${kosong} opsi masih kosong`);
        }
      }
    });
    return list;
  }, [judul, pertanyaan]);
  const valid = masalah.length === 0;

  function update(i: number, patch: Partial<PertanyaanDraft>) {
    setPertanyaan((arr) => arr.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  function tambahPertanyaan() {
    setPertanyaan((arr) => [...arr, { key: newKey(), teks: "", tipe: "SKALA_1_5", opsi: [] }]);
  }

  function hapusPertanyaan(i: number) {
    setPertanyaan((arr) => arr.filter((_, idx) => idx !== i));
  }

  function pindah(i: number, delta: -1 | 1) {
    setPertanyaan((arr) => {
      const j = i + delta;
      if (j < 0 || j >= arr.length) return arr;
      const baru = [...arr];
      [baru[i], baru[j]] = [baru[j], baru[i]];
      return baru;
    });
  }

  function updateOpsi(pi: number, oi: number, teks: string) {
    setPertanyaan((arr) =>
      arr.map((p, idx) =>
        idx === pi ? { ...p, opsi: p.opsi.map((o, k) => (k === oi ? { ...o, teks } : o)) } : p
      )
    );
  }

  function tambahOpsi(pi: number) {
    setPertanyaan((arr) =>
      arr.map((p, idx) => (idx === pi ? { ...p, opsi: [...p.opsi, { teks: "" }] } : p))
    );
  }

  function hapusOpsi(pi: number, oi: number) {
    setPertanyaan((arr) =>
      arr.map((p, idx) => (idx === pi ? { ...p, opsi: p.opsi.filter((_, k) => k !== oi) } : p))
    );
  }

  async function submit() {
    if (!valid) {
      toast.error("Lengkapi judul dan seluruh pertanyaan.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        judul: judul.trim(),
        deskripsi: deskripsi.trim() || undefined,
        isActive,
        pertanyaan: pertanyaan.map((p, idx) => ({
          id: p.id,
          teks: p.teks.trim(),
          tipe: p.tipe,
          urutan: idx,
          opsi: p.tipe === "PILIHAN_GANDA" ? p.opsi.map((o) => ({ id: o.id, teks: o.teks.trim() })) : [],
        })),
      };

      const url = initial ? `/api/kuesioner/${initial.id}` : "/api/kuesioner";
      const res = await fetch(url, {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Terjadi kesalahan");
      toast.success(initial ? "Kuesioner diperbarui." : "Kuesioner berhasil dibuat.");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="k-judul">Judul Kuesioner</Label>
          <Input
            id="k-judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="cth. Survei Kepuasan Mitra Semester Genap 2026"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="k-deskripsi">Deskripsi (opsional)</Label>
          <Textarea
            id="k-deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={2}
            placeholder="Sampaikan tujuan survei kepada mitra"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(Boolean(v))} />
          Kuesioner aktif (bisa diisi mitra)
        </label>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Daftar Pertanyaan <span className="font-normal text-slate-400">({pertanyaan.length})</span>
          </h3>
          <Button type="button" size="sm" variant="outline" onClick={tambahPertanyaan}>
            <Plus className="h-4 w-4" /> Tambah Pertanyaan
          </Button>
        </div>

        {pertanyaan.map((p, i) => (
          <div key={p.key} className="rounded-lg border p-4">
            <div className="flex items-start gap-2">
              <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div className="flex-1 space-y-3">
                <Input
                  value={p.teks}
                  onChange={(e) => update(i, { teks: e.target.value })}
                  placeholder="Tulis pertanyaan"
                />
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={p.tipe}
                    onValueChange={(v) =>
                      update(i, { tipe: v as TipePertanyaan, opsi: v === "PILIHAN_GANDA" ? p.opsi : [] })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SKALA_1_5">Skala 1-5</SelectItem>
                      <SelectItem value="PILIHAN_GANDA">Pilihan Ganda</SelectItem>
                      <SelectItem value="TEKS_BEBAS">Teks Bebas</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1">
                    <Button type="button" size="icon" variant="ghost" onClick={() => pindah(i, -1)} aria-label="Naik">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="icon" variant="ghost" onClick={() => pindah(i, 1)} aria-label="Turun">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => hapusPertanyaan(i)}
                      aria-label="Hapus pertanyaan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {p.tipe === "SKALA_1_5" && (
                  <p className="rounded bg-slate-50 px-3 py-2 text-xs text-slate-500">
                    Mitra memilih skor 1 (sangat tidak puas) sampai 5 (sangat puas).
                  </p>
                )}

                {p.tipe === "PILIHAN_GANDA" && (
                  <div className="space-y-2 rounded bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">Opsi Jawaban</p>
                    {p.opsi.map((o, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <Input
                          value={o.teks}
                          onChange={(e) => updateOpsi(i, oi, e.target.value)}
                          placeholder={`Opsi ${oi + 1}`}
                          className="h-8 bg-white"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600"
                          onClick={() => hapusOpsi(i, oi)}
                          aria-label="Hapus opsi"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" size="sm" variant="outline" onClick={() => tambahOpsi(i)}>
                      <Plus className="h-3.5 w-3.5" /> Tambah Opsi
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!valid && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <p className="font-medium">Lengkapi dulu sebelum menyimpan:</p>
          <ul className="ml-4 mt-1 list-disc space-y-0.5">
            {masalah.slice(0, 5).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <Button className="w-full" onClick={submit} disabled={!valid || loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {initial ? "Simpan Perubahan" : "Buat Kuesioner"}
      </Button>
    </div>
  );
}