import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import GlobalConfigHandler from "@/components/layout/GlobalConfigHandler";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Avanza Fueguino - Empleo y Talento",
  description: "Tu plataforma de confianza para buscar empleo y talento en Tierra del Fuego.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.variable}>
        <GlobalConfigHandler>
          <ClientLayout>
            {children}
          </ClientLayout>
        </GlobalConfigHandler>
      </body>
    </html>
  );
}
