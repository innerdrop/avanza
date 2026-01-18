"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-4">
                <header className="w-full max-w-4xl bg-[var(--primary)] shadow-xl border border-white/10 rounded-full px-4 sm:px-6 py-3 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="bg-white p-1 rounded-full">
                            <Image
                                src="/logo.png"
                                alt="Avanza Fueguino"
                                width={40}
                                height={40}
                                className="h-6 w-6 sm:h-8 sm:w-8"
                                priority
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base sm:text-xl leading-none tracking-tight text-white">AVANZA</span>
                            <span className="font-bold text-xs sm:text-sm text-white/80 leading-none tracking-wider">FUEGUINO</span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        <Link href="/" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Inicio</Link>
                        <Link href="/empleos" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Empleos</Link>
                        <Link href="/servicios" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Servicios</Link>
                        <Link href="/test-psicotecnico" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Test Laboral</Link>
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3 lg:gap-4">
                        <Link href="/contacto" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
                            Contacto
                        </Link>
                        <Link href="/cargar-cv" className="bg-white text-[var(--primary)] hover:bg-gray-100 px-4 lg:px-5 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105 shadow-md">
                            Cargar CV
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-white"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </header>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                    <div className="fixed top-20 left-4 right-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl">
                        <nav className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-lg font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors py-2 border-b border-gray-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/empleos"
                                className="text-lg font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors py-2 border-b border-gray-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Empleos
                            </Link>
                            <Link
                                href="/servicios"
                                className="text-lg font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors py-2 border-b border-gray-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Servicios
                            </Link>
                            <Link
                                href="/test-psicotecnico"
                                className="text-lg font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors py-2 border-b border-gray-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Test Laboral
                            </Link>
                            <Link
                                href="/contacto"
                                className="text-lg font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors py-2 border-b border-gray-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contacto
                            </Link>
                            <div className="pt-4 mt-2">
                                <Link
                                    href="/cargar-cv"
                                    className="btn-primary w-full justify-center px-6 py-3 rounded-full text-base font-bold text-white shadow-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Cargar CV
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
