import { getServerSession } from "next-auth";
import type { Role } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import type { SessionUser } from "@/types";

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return {
    id: session.user.id,
    nama: session.user.nama,
    email: session.user.email ?? "",
    role: session.user.role,
    mitraId: session.user.mitraId,
  };
}

/** Wajib login; opsional filter role */
export async function requireUser(roles?: Role[]): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user) return null;
  if (roles && !roles.includes(user.role)) return null;
  return user;
}