import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CartDrawer from "@/components/CartDrawer";
import ScrollReset from "@/components/ScrollReset";
import { LanguageProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart-context";
import { CartToastProvider } from "@/components/CartToast";

const GA_ID = "G-2W068XC4E7";

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
  icons: {
    icon: "/favicon.png",
  },
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
      <body className="min-h-full flex flex-col bg-black text-white overflow-x-hidden">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
        <LanguageProvider>
          <CartProvider>
          <CartToastProvider>
            <ScrollReset />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingButtons />
            <CartDrawer />
          </CartToastProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
