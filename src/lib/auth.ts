import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 jam
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Kredensial",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "nama@email.com" },
        password: { label: "Password", type: "password" },
        token: { label: "Token QR", type: "text" },
      },
      async authorize(credentials) {
        // Login cepat via QR code (token per mitra, tanpa password manual)
        if (credentials?.token) {
          const mitra = await prisma.mitra.findUnique({
            where: { qrToken: credentials.token },
            include: { user: true },
          });
          if (!mitra?.user) return null;
          return {
            id: mitra.user.id,
            nama: mitra.user.nama,
            email: mitra.user.email,
            role: mitra.user.role,
            mitraId: mitra.id,
          };
        }

        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { mitra: true },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role,
          mitraId: user.mitra?.id ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nama = user.nama;
        token.role = user.role;
        token.mitraId = user.mitraId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.nama = token.nama as string;
        session.user.role = token.role as never;
        session.user.mitraId = token.mitraId as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};