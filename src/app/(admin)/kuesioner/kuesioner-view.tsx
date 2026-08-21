"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Loader2, Mail, Pencil, Plus, Trash2, Eye, Circle } from "lucide-react";
import { toast } from "sonner";
import { formatTanggalPendek } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KuesionerBuilder, type PertanyaanDraft } from "@/components/admin/kuesioner-builder";
import { DetailKuesioner } from "@/components/admin/detail-kuesioner";

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json().then((j) => (r.ok ? j.data : Promise.reject(new Error(j.error)))));

export type KuesionerList = {
  id: string;
  judul: string;
  deskripsi: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: { nama: string };
  _count: { pertanyaan: number; responses: number };
};

interface DetailKuesionerData {
  id: string;
  judul: string;
  deskripsi: string | null;
  isActive: boolean;
  pertanyaan: (PertanyaanDraft & { kuesionerId: string })[];
  _count: { responses: number };
}

export function KuesionerView({ initialData }: { initialData: KuesionerList[] }) {
  const { user, isAdmin } = useAuth();
  const { mutate } = useSWRConfig();
  const [openBuat, setOpenBuat] = useState(false);
  const [editData, setEditData] = useState<DetailKuesionerData | null>(null);
  const [detailData, setDetailData] = useState<DetailKuesionerData | null>(null);
  const [hapusId, setHapusId] = useState<string | null>(null);
  const [notifLoading, setNotifLoading] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  const { data } = useSWR<KuesionerList[]>("/api/kuesioner", fetcher, {
    fallbackData: initialData,
  });

  async function muatDetail(id: string, untukEdit = false) {
    try {
      const d = await fetcher(`/api/kuesioner/${id}`);
      const pertanyaan = d.pertanyaan.map((p: any) => ({
        key: p.id,
        id: p.id,
        teks: p.teks,
        tipe: p.tipe,
        opsi: (p.opsi ?? []).map((o: any) => ({ id: o.id, teks: o.teks })),
      }));
      const hasil = { ...d, pertanyaan };
      if (untukEdit) setEditData(hasil);
      else setDetailData(hasil);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memuat detail");
    }
  }

  async function toggleAktif(k: KuesionerList) {
    setToggleLoading(k.id);
    try {
      const res = await fetch(`/api/kuesioner/${k.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !k.isActive }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success(k.isActive ? "Kuesioner dinonaktifkan." : "Kuesioner diaktifkan.");
      mutate("/api/kuesioner");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memperbarui");
    } finally {
      setToggleLoading(null);
    }
  }

  async function kirimUndangan(id: string, judul: string) {
    setNotifLoading(id);
    try {
      const res = await fetch("/api/notifikasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kuesionerId: id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      if (json.data.skipped > 0 && json.data.sukses === 0) {
        toast.warning(
          `Email belum dikirim (${json.data.total} mitra) — SMTP belum dikonfigurasi. Lihat README.`
        );
      } else {
        toast.success(
          `Undangan survei "${judul}" dikirim ke ${json.data.sukses} mitra (${json.data.gagal} gagal).`
        );
      }
      mutate("/api/kuesioner");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal mengirim undangan");
    } finally {
      setNotifLoading(null);
    }
  }

  async function hapusKuesioner() {
    if (!hapusId) return;
    try {
      const res = await fetch(`/api/kuesioner/${hapusId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Kuesioner dihapus.");
      mutate("/api/kuesioner");
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
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Kuesioner</h1>
          <p className="mt-1 text-sm text-slate-500">
            Buat, ubah, dan kelola survei kepuasan untuk mitra LPPM.
          </p>
        </div>
        {isAdmin && (
          <Dialog open={openBuat} onOpenChange={setOpenBuat}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" /> Buat Kuesioner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90dvh] overflow-y-auto max-w-2xl">
              <DialogHeader>
                <DialogTitle>Buat Kuesioner Baru</DialogTitle>
                <DialogDescription>
                  Susun pertanyaan dengan tipe skala 1-5, pilihan ganda, atau teks bebas.
                </DialogDescription>
              </DialogHeader>
              <KuesionerBuilder
                onDone={() => {
                  setOpenBuat(false);
                  mutate("/api/kuesioner");
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {data && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Pertanyaan</TableHead>
                  <TableHead className="text-right">Respons</TableHead>
                  <TableHead className="hidden lg:table-cell">Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell>
                      <p className="font-medium">{k.judul}</p>
                      <p className="text-xs text-slate-400">
                        oleh {k.createdBy.nama} · {formatTanggalPendek(k.createdAt)}
                      </p>
                      <div className="mt-1 lg:hidden">
                        {k.isActive ? (
                          <Badge variant="success">Aktif</Badge>
                        ) : (
                          <Badge variant="secondary">Nonaktif</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {k.isActive ? <Badge variant="success">Aktif</Badge> : <Badge variant="secondary">Nonaktif</Badge>}
                    </TableCell>
                    <TableCell className="text-right">{k._count.pertanyaan}</TableCell>
                    <TableCell className="text-right">{k._count.responses}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatTanggalPendek(k.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Aksi <span className="text-slate-400">▾</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{k.judul}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => muatDetail(k.id)}>
                            <Eye className="h-4 w-4" /> Lihat Detail
                          </DropdownMenuItem>
                          {isAdmin && (
                            <>
                              <DropdownMenuItem onClick={() => muatDetail(k.id, true)}>
                                <Pencil className="h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleAktif(k)}
                                disabled={toggleLoading === k.id}
                              >
                                <Circle className="h-4 w-4" />
                                {k.isActive ? "Nonaktifkan" : "Aktifkan"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => kirimUndangan(k.id, k.judul)} disabled={notifLoading === k.id}>
                                {notifLoading === k.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Mail className="h-4 w-4" />
                                )}
                                Kirim Undangan Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-700"
                                onClick={() => setHapusId(k.id)}
                              >
                                <Trash2 className="h-4 w-4" /> Hapus
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-8 text-center text-sm text-slate-400">
              Belum ada kuesioner. {isAdmin && "Klik “Buat Kuesioner” untuk memulai."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dialog edit */}
      <Dialog open={Boolean(editData)} onOpenChange={(o) => !o && setEditData(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Kuesioner</DialogTitle>
            <DialogDescription>
              Perubahan yang menghapus pertanyaan dengan jawaban akan ditolak otomatis.
            </DialogDescription>
          </DialogHeader>
          {editData && (
            <KuesionerBuilder
              initial={editData}
              onDone={() => {
                setEditData(null);
                mutate("/api/kuesioner");
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog detail */}
      <Dialog open={Boolean(detailData)} onOpenChange={(o) => !o && setDetailData(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto max-w-2xl">
          {detailData && <DetailKuesioner data={detailData} />}
        </DialogContent>
      </Dialog>

      {/* Konfirmasi hapus */}
      <AlertDialog open={Boolean(hapusId)} onOpenChange={(o) => !o && setHapusId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kuesioner?</AlertDialogTitle>
            <AlertDialogDescription>
              Kuesioner beserta seluruh jawaban yang terkumpul akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={hapusKuesioner}>
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
