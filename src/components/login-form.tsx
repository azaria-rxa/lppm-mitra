"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Form({ callbackUrl, token }: { callbackUrl?: string; token?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      toast.success("Berhasil masuk.");
      const tujuan = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : undefined;
      router.push(tujuan ?? "/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {token && !qrLoading && (
        <Button className="mb-4 w-full" size="lg" onClick={handleTokenLogin}>
          Masuk dengan Link / QR Perangkat Ini
        </Button>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Masuk ke SIKAP LPPM</CardTitle>
          <CardDescription>
            Gunakan akun yang diberikan oleh admin LPPM sesuai peran Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {qrLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-sm text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              Memverifikasi token akses cepat...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" placeholder="nama@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Masuk"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
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