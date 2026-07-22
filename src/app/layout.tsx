import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";

export const metadata: Metadata = {
  title: "Cofengo | Cafe & Restoran",
  description:
    "Cofengo - şehrin kalbinde sıcacık bir mola noktası. Menümüzü, etkinliklerimizi keşfedin ve bize ulaşın.",
};

// Tum site SQLite veritabanindan okuyor (menu, etkinlik, ayarlar v.b.).
// Sayfalarin build anindaki verimi degil, her istekte GUNCEL veriyi
// gostermesi icin statik on-uretimi (static prerendering) devre disi
// birakiyoruz - aksi halde admin panelden yapilan degisiklikler siteye
// ancak yeni bir "npm run build" ile yansirdi.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col bg-cream text-espresso">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
