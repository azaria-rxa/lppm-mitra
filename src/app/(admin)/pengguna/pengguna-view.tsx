"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ROLE_LABEL } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { FormPengguna, type PenggunaList } from "@/components/admin/form-pengguna";

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json().then((j) => (r.ok ? j.data : Promise.reject(new Error(j.error)))));

const WARNA_PERAN: Record<PenggunaList["role"], string> = {
  ADMIN: "bg-blue-50 text-blue-800 border border-blue-200",
  PIMPINAN: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export function PenggunaView({ initialData }: { initialData: PenggunaList[] }) {
  const { mutate } = useSWRConfig();
  const [openBuat, setOpenBuat] = useState(false);
  const [editData, setEditData] = useState<PenggunaList | null>(null);
  const [hapusData, setHapusData] = useState<PenggunaList | null>(null);

  const { data } = useSWR<PenggunaList[]>("/api/pengguna", fetcher, {
    fallbackData: initialData,
  });

  async function hapusPengguna() {
    if (!hapusData) return;
    try {
      const res = await fetch(`/api/pengguna/${hapusData.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success(`Pengguna "${hapusData.nama}" dihapus.`);
      mutate("/api/pengguna");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus");
    } finally {
      setHapusData(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengguna</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola akun admin dan pimpinan LPPM. Akun mitra dikelola di halaman Mitra.
          </p>
        </div>
        <Dialog open={openBuat} onOpenChange={setOpenBuat}>
          <Button onClick={() => setOpenBuat(true)}>
            <Plus className="h-4 w-4" /> Tambah Pengguna
          </Button>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Pengguna</DialogTitle>
              <DialogDescription>
                Buat akun admin atau pimpinan baru untuk masuk ke panel ini.
              </DialogDescription>
            </DialogHeader>
            <FormPengguna
              onDone={() => {
                setOpenBuat(false);
                mutate("/api/pengguna");
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {data && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead className="hidden sm:table-cell">Peran</TableHead>
                  <TableHead className="hidden md:table-cell">Kuesioner Dibuat</TableHead>
                  <TableHead className="hidden lg:table-cell">Terdaftar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <p className="font-medium">{u.nama}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                          WARNA_PERAN[u.role]
                        )}
                      >
                        {ROLE_LABEL[u.role]}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{u._count.kuesioners}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => setEditData(u)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Hapus"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setHapusData(u)}
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
              Belum ada pengguna. Klik “Tambah Pengguna”.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(editData)} onOpenChange={(o) => !o && setEditData(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Perbarui data, peran, atau ganti password pengguna.
            </DialogDescription>
          </DialogHeader>
          {editData && (
            <FormPengguna
              initial={editData}
              onDone={() => {
                setEditData(null);
                mutate("/api/pengguna");
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(hapusData)} onOpenChange={(o) => !o && setHapusData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pengguna {hapusData?.nama}?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun ini tidak akan bisa masuk lagi ke aplikasi. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={hapusPengguna}
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
