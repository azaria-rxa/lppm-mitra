import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nama: string;
      role: Role;
      mitraId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    nama: string;
    role: Role;
    mitraId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nama: string;
    role: Role;
    mitraId?: string;
  }
}