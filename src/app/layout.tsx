import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import GlobalConfigHandler from "@/components/layout/GlobalConfigHandler";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "MOOVY Jobs - Empleo y Talento en Tierra del Fuego",
  description: "Tu plataforma de confianza para buscar empleo y talento en Ushuaia, Río Grande y Tolhuin. Parte del ecosistema MOOVY.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link href="https://fonts.cdnfonts.com/css/junegull" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <GlobalConfigHandler>
          <ClientLayout>
            {children}
          </ClientLayout>
        </GlobalConfigHandler>
      </body>
    </html>
  );
}
