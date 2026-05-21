import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sonata Tiles | Premium B2B Architectural Porcelain Slabs",
  description: "Discover Sonata Tiles. The pinnacle of luxury ceramic, marble, slate, and textured porcelain tiles. Built with high vitrification and resilient architecture for professional developments.",
  keywords: "porcelain tiles, luxury marble tiles, outdoor slate pavers, herringbone wood tiles, ceramic wall tiles, B2B architecture tiles",
  authors: [{ name: "Sonata Tiles Architectural Team" }]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50/50 text-slate-900">
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
