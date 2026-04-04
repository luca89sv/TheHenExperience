import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { LanguageProvider } from "@/lib/i18n";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Hen Experience — Niezapomniany Wiecz\u00f3r Panie\u0144ski w Warszawie",
  description:
    "Ekskluzywne wieczory panie\u0144skie w Warszawie. Limuzyny, kluby VIP, dekoracje i niezapomniane chwile. Zarezerwuj wymarzon\u0105 noc.",
  openGraph: {
    title: "The Hen Experience — Premium Hen Parties in Warsaw",
    description:
      "Exclusive bachelorette parties in Warsaw. Limousines, VIP clubs, decorations & unforgettable moments.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${cormorant.variable} ${dmSans.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingButtons />
        </LanguageProvider>
      </body>
    </html>
  );
}
