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
      <main className="px-4 pb-24 pt-4 lg:ml-72 lg:px-10 lg:pb-10 lg:pt-8">
        <div className="mx-auto w-full max-w-lg lg:max-w-3xl">{children}</div>
      </main>
    </div>
  );
}