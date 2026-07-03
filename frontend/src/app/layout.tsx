import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAARU - Mode & Beauté",
  description: "Toute la mode et la beauté à portée de clic",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TAARU",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#D4AF37",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <AuthProvider>
          <Header />
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
