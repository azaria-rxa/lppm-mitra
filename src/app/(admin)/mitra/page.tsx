"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Loader2, Pencil, Plus, QrCode, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { JenisMitra } from "@prisma/client";
import { cn } from "@/lib/utils";
import { LABEL_JENIS_MITRA, WARNA_JENIS_MITRA } from "@/lib/laporan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FormMitra } from "@/components/admin/form-mitra";

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json().then((j) => (r.ok ? j.data : Promise.reject(new Error(j.error)))));

export type MitraList = {
  id: string;
  nama: string;
  jenis: JenisMitra;
  kontak: string;
  qrToken: string | null;
  createdAt: string;
  user: { id: string; email: string; nama: string } | null;
  _count: { responses: number };
};

export default function MitraPage() {
  const { mutate } = useSWRConfig();
  const [openBuat, setOpenBuat] = useState(false);
  const [editData, setEditData] = useState<MitraList | null>(null);
  const [qrData, setQrData] = useState<MitraList | null>(null);
  const [hapusId, setHapusId] = useState<MitraList | null>(null);

  const { data, error, isLoading } = useSWR<MitraList[]>("/api/mitra", fetcher);

  async function hapusMitra() {
    if (!hapusId) return;
    try {
      const res = await fetch(`/api/mitra/${hapusId.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success(`Mitra "${hapusId.nama}" dihapus.`);
      mutate("/api/mitra");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus");
    } finally {
      setHapusId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Mitra</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola desa binaan, industri, dan instansi pemerintah yang bekerja sama dengan LPPM.
          </p>
        </div>
        <Dialog open={openBuat} onOpenChange={setOpenBuat}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Tambah Mitra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Mitra Baru</DialogTitle>
              <DialogDescription>
                Opsional: buatkan akun masuk agar mitra bisa mengisi survei via aplikasi.
              </DialogDescription>
            </DialogHeader>
            <FormMitra
              onDone={() => {
                setOpenBuat(false);
                mutate("/api/mitra");
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-red-600">Gagal memuat data.</CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : data && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Mitra</TableHead>
                  <TableHead className="hidden sm:table-cell">Jenis</TableHead>
                  <TableHead className="hidden md:table-cell">Akun</TableHead>
                  <TableHead className="text-right">Respons</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <p className="font-medium">{m.nama}</p>
                      <p className="text-xs text-slate-400">{m.kontak}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                          WARNA_JENIS_MITRA[m.jenis]
                        )}
                      >
                        {LABEL_JENIS_MITRA[m.jenis]}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {m.user ? (
                        <span className="text-xs text-emerald-700">{m.user.email}</span>
                      ) : (
                        <Badge variant="secondary">Tanpa akun</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{m._count.responses}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="QR Code" onClick={() => setQrData(m)}>
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => setEditData(m)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Hapus"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setHapusId(m)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-8 text-center text-sm text-slate-400">
              Belum ada mitra terdaftar. Klik “Tambah Mitra”.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(editData)} onOpenChange={(o) => !o && setEditData(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Mitra</DialogTitle>
            <DialogDescription>Perbarui informasi dan akun masuk mitra.</DialogDescription>
          </DialogHeader>
          {editData && (
            <FormMitra
              initial={editData}
              onDone={() => {
                setEditData(null);
                mutate("/api/mitra");
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(qrData)} onOpenChange={(o) => !o && setQrData(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code — {qrData?.nama}</DialogTitle>
            <DialogDescription>
              Scan untuk membuka form survei tanpa login manual. Cetak dan tempel di koperasi/desa/industri.
            </DialogDescription>
          </DialogHeader>
          {qrData && (
            <div className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/qrcode/${qrData.id}`}
                alt={`QR Code ${qrData.nama}`}
                className="h-56 w-56 rounded-lg border"
              />
              <p className="text-center text-xs text-slate-500">
                Tautan yang disematkan: masuk otomatis sebagai <strong>{qrData.nama}</strong> lalu ditampilkan
                daftar survei aktif.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(hapusId)} onOpenChange={(o) => !o && setHapusId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus mitra {hapusId?.nama}?</AlertDialogTitle>
            <AlertDialogDescription>
              Seluruh respons survei milik mitra ini beserta akun masuknya akan ikut dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={hapusMitra}
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}