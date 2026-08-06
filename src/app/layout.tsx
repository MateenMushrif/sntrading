import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sntrading.com"),
  title: {
    default: "SN Trading | Wholesale Bakery Ingredients & Raw Materials",
    template: "%s | SN Trading Wholesale",
  },
  description:
    "Direct wholesale catalogue and inquiry portal for commercial bakeries. Premium cocoa powders, chocolate compounds, industrial fats, emulsifiers, and pre-mixes.",
  keywords: [
    "bakery raw materials wholesale",
    "wholesale cocoa powder supplier",
    "industrial margarine bulk",
    "SN Trading",
    "commercial bakery ingredients",
    "bakery premixes supplier",
  ],
  authors: [{ name: "SN Trading" }],
  openGraph: {
    title: "SN Trading | Wholesale Bakery Ingredients & Raw Materials",
    description:
      "Direct B2B wholesale supply of premium chocolate, cocoa powders, specialty fats, and bakery pre-mixes.",
    url: "https://sntrading.com",
    siteName: "SN Trading",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SN Trading | Wholesale Bakery Ingredients",
    description:
      "Direct B2B wholesale supply of premium chocolate, cocoa powders, specialty fats, and bakery pre-mixes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        <CartProvider>
          <Header />
          <Breadcrumbs />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}