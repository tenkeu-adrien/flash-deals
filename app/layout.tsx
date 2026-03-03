import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flash Deals Cameroun - Deals à Prix Cassés",
  description: "Plateforme e-commerce camerounaise de deals flash 24-48h avec réductions jusqu'à -70%",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
