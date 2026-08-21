import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/session-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "SIKAP LPPM",
    template: "%s | SIKAP LPPM",
  },
  description:
    "SIKAP-LPPM — Sistem Kepuasan Mitra LPPM. Platform survei digital untuk mengukur indeks kepuasan mitra eksternal (desa binaan, industri, instansi pemerintah).",
  applicationName: "SIKAP LPPM",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-512.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SIKAP LPPM",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0f2c56",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}