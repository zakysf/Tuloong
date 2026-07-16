import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tuloong — Jasa Suruh Terdekat",
  description:
    "Platform reverse marketplace jasa suruh yang menghubungkan pelanggan dengan mitra terverifikasi di sekitarmu.",
  keywords: ["jasa suruh", "jasa harian", "mitra lokal", "tuloong"],
  openGraph: {
    title: "Tuloong — Jasa Suruh Terdekat",
    description: "Temukan mitra terpercaya untuk urusan harianmu.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-dvh antialiased overflow-y-scroll">{children}</body>
    </html>
  );
}
