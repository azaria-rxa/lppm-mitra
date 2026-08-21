"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, Mail, Lock, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Form({ callbackUrl, token }: { callbackUrl?: string; token?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [qrLoading, setQrLoading] = useState(Boolean(token));

  async function handleTokenLogin() {
    if (!token) return;
    setQrLoading(true);
    try {
      const res = await signIn("credentials", { token, redirect: false });
      if (res?.error) {
        toast.error("Token akses tidak valid. Silakan hubungi admin LPPM.");
        window.history.replaceState({}, "", "/login");
      } else {
        toast.success("Berhasil masuk.");
        router.push(callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/survei");
        router.refresh();
      }
    } finally {
      setQrLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: fd.get("email"),
        password: fd.get("password"),
        redirect: false,
      });
      if (res?.error) {
        toast.error("Email atau password salah.");
        return;
      }
      setSukses(true);
      toast.success("Berhasil masuk.");
      const tujuan = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : undefined;
      router.push(tujuan ?? "/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-blue-950">Selamat datang kembali</h1>
        <p className="mt-2 text-sm text-slate-500">
          Masuk dengan akun yang diberikan admin LPPM sesuai peran Anda.
        </p>
      </div>

      {token && !qrLoading && (
        <Button className="mb-5 w-full" size="lg" variant="gold" onClick={handleTokenLogin}>
          <QrCode className="h-4 w-4" />
          Masuk dengan Link / QR Perangkat Ini
        </Button>
      )}

      {qrLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-100 bg-slate-50 py-12 text-sm text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          Memverifikasi token akses cepat...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="nama@email.com"
                className="h-11 pl-10 transition-colors focus-visible:ring-blue-900/40"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-11 pl-10 pr-10 transition-colors focus-visible:ring-blue-900/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-blue-900"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading || sukses}
          >
            {sukses ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Berhasil masuk, mengalihkan…</span>
              </>
            ) : loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Memeriksa akun…</span>
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>
      )}

      <p className="mt-8 text-center text-xs text-slate-400">
        Mitra baru menerima tautan atau kode QR akses langsung dari admin LPPM.
      </p>
    </div>
  );
}

export function LoginForm({ callbackUrl, token }: { callbackUrl?: string; token?: string }) {
  return (
    <Suspense>
      <Form callbackUrl={callbackUrl} token={token} />
    </Suspense>
  );
}
