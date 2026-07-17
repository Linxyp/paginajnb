import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Toaster from "@/components/Toaster";

const inter = Inter({ subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic", "normal"], variable: "--font-serif-accent" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jnbimportaciones.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "JNB Importaciones | Conectividad y Audio Automotriz Premium",
    template: "%s",
  },
  description: "Especialistas en pantallas Android homologadas, dashcams y accesorios tecnológicos avanzados para vehículos en Colombia.",
  openGraph: {
    siteName: "JNB Importaciones",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${instrumentSerif.variable} bg-[#EDF2F4] text-[#2B2D42] min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  );
}