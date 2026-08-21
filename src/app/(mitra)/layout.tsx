import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { isMitra } from "@/lib/rbac";
import { MitraNav } from "@/components/mitra/mitra-nav";

export default async function MitraLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!isMitra(user.role)) redirect("/dashboard");

  return (
    <div className="min-h-dvh bg-slate-50">
      <MitraNav user={user} />
      <main className="mx-auto max-w-lg px-4 pb-24 pt-4 safe-bottom">{children}</main>
    </div>
  );
}