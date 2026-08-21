"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { JenisMitra } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LABEL_JENIS_MITRA } from "@/lib/laporan";
import type { MitraList } from "@/app/(admin)/mitra/page";

interface Props {
  initial?: MitraList;
  onDone: () => void;
}

export function FormMitra({ initial, onDone }: Props) {
  const [nama, setNama] = useState(initial?.nama ?? "");
  const [jenis, setJenis] = useState<JenisMitra>(initial?.jenis ?? "DESA_BINAAN");
  const [kontak, setKontak] = useState(initial?.kontak ?? "");
  const [emailAkun, setEmailAkun] = useState(initial?.user?.email ?? "");
  const [passwordAkun, setPasswordAkun] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (nama.trim().length < 2 || kontak.trim().length < 5) {
      toast.error("Nama (min 2 karakter) dan kontak (min 5 karakter) wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        nama: nama.trim(),
        jenis,
        kontak: kontak.trim(),
        emailAkun: emailAkun.trim(),
        passwordAkun: passwordAkun,
      };
      const url = initial ? `/api/mitra/${initial.id}` : "/api/mitra";
      const res = await fetch(url, {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Terjadi kesalahan");
      toast.success(initial ? "Data mitra diperbarui." : "Mitra ditambahkan.");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="m-nama">Nama Mitra *</Label>
        <Input id="m-nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="cth. Desa Sukamaju" />
      </div>

      <div className="space-y-1.5">
        <Label>Jenis Mitra *</Label>
        <Select value={jenis} onValueChange={(v) => setJenis(v as JenisMitra)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih jenis" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(LABEL_JENIS_MITRA) as JenisMitra[]).map((j) => (
              <SelectItem key={j} value={j}>
                {LABEL_JENIS_MITRA[j]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="m-kontak">Kontak (email / telepon) *</Label>
        <Input id="m-kontak" value={kontak} onChange={(e) => setKontak(e.target.value)} placeholder="0812-3456-7890" />
      </div>

      <div className="rounded-lg border border-dashed p-3">
        <p className="mb-3 text-xs font-medium text-slate-500">
          Akun masuk (opsional, untuk aplikasi + QR)
        </p>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="m-email">Email Akun</Label>
            <Input
              id="m-email"
              type="email"
              value={emailAkun}
              onChange={(e) => setEmailAkun(e.target.value)}
              placeholder="mitra@email.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="m-password">Password Akun</Label>
            <Input
              id="m-password"
              type="password"
              value={passwordAkun}
              onChange={(e) => setPasswordAkun(e.target.value)}
              placeholder={initial?.user ? "Kosongkan jika tidak diubah" : "Min. 6 karakter"}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {initial ? "Simpan Perubahan" : "Tambah Mitra"}
      </Button>
    </form>
  );
}