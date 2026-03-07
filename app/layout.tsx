import type { Metadata } from "next";
import "./globals.css";
import FirebaseProvider from "@/components/providers/FirebaseProvider";

export const metadata: Metadata = {
  title: "Flash Deals Cameroun - Deals à Prix Cassés",
  description: "Plateforme e-commerce camerounaise de deals flash 24-48h avec réductions jusqu'à -70%",
  manifest: "/manifest.json",
  themeColor: "#FF6600",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Flash Deals",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/icons/icon-32x32.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased">
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
