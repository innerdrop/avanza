"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Rutas donde NO queremos mostrar el Navbar y Footer públicos
    const isExcludedPath = pathname?.startsWith('/ops') || pathname?.startsWith('/empresas');

    const showPublicNav = pathname && !isExcludedPath;

    return (
        <>
            {showPublicNav && <Navbar />}
            <main className={`${showPublicNav ? 'min-h-screen' : ''}`}>
                {children}
            </main>
            {showPublicNav && <Footer />}
        </>
    );
}
