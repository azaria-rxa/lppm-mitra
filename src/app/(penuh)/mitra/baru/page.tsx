import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { isAdmin, isMitra } from "@/lib/rbac";
import { TambahMitraView } from "./tambah-mitra-view";

export const metadata: Metadata = {
  title: "Tambah Mitra",
};

export default async function TambahMitraPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?callbackUrl=/mitra/baru");
  if (isMitra(user.role)) redirect("/survei");
  if (!isAdmin(user.role)) redirect("/dashboard");

  return <TambahMitraView />;
}
