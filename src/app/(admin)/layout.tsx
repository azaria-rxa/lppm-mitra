import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { isMitra } from "@/lib/rbac";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (isMitra(user.role)) redirect("/survei");

  return (
    <div className="min-h-dvh bg-slate-50">
      <AdminSidebar user={user} />
      <main className="pb-16 pt-16 md:pb-8 md:pt-8 lg:ml-72 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-6xl px-4 md:px-6">{children}</div>
      </main>
    </div>
  );
}