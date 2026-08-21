"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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

export type PenggunaList = {
  id: string;
  nama: string;
  email: string;
  role: "ADMIN" | "PIMPINAN";
  createdAt: string;
  _count: { kuesioners: number };
};

interface Props {
  initial?: PenggunaList;
  onDone: () => void;
}

export function FormPengguna({ initial, onDone }: Props) {
  const [nama, setNama] = useState(initial?.nama ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "PIMPINAN">(initial?.role ?? "PIMPINAN");
  const [kirim, setKirim] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setKirim(true);
    try {
      const isi = initial
        ? { nama, email, role, ...(password ? { password } : {}) }
        : { nama, email, password, role };
      const res = await fetch(initial ? `/api/pengguna/${initial.id}` : "/api/pengguna", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isi),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success(
        initial
          ? password
            ? `Pengguna "${nama}" diperbarui, password diganti.`
            : `Pengguna "${nama}" diperbarui.`
          : `Pengguna "${nama}" berhasil dibuat.`
      );
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setKirim(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pgn-nama">Nama lengkap</Label>
        <Input
          id="pgn-nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="cth. Dr. Budi Santoso"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pgn-email">Email</Label>
        <Input
          id="pgn-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@unnes.ac.id"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pgn-role">Peran</Label>
        <Select value={role} onValueChange={(v) => setRole(v as "ADMIN" | "PIMPINAN")}>
          <SelectTrigger id="pgn-role" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin LPPM</SelectItem>
            <SelectItem value="PIMPINAN">Pimpinan (read-only)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-400">
          Akun mitra dibuat lewat halaman Mitra agar data mitranya ikut tersimpan.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pgn-pass">
          {initial ? "Password baru (opsional)" : "Password"}
        </Label>
        <Input
          id="pgn-pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={initial ? "Kosongkan jika tidak diganti" : "Minimal 6 karakter"}
          minLength={6}
          required={!initial}
        />
      </div>
      <Button type="submit" disabled={kirim} className="w-full">
        {kirim && <Loader2 className="h-4 w-4 animate-spin" />}
        {initial ? "Simpan Perubahan" : "Buat Pengguna"}
      </Button>
    </form>
  );
}
