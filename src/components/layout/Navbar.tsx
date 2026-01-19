"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Inicio", href: "/" },
        { label: "Empleos", href: "/empleos" },
        { label: "Servicios", href: "/servicios" },
        { label: "Test Laboral", href: "/test-psicotecnico" },
        { label: "Contacto", href: "/contacto" },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
                        : "bg-white"
                    }`}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-[72px]">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-1">
                            <span
                                className="font-extrabold text-xl sm:text-2xl text-[#e60012] tracking-widest uppercase"
                                style={{ fontFamily: "'Junegull', sans-serif" }}
                            >
                                MOOVY
                            </span>
                            <span
                                className="font-bold text-xl sm:text-2xl text-[#2563EB] tracking-tight"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Jobs
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-600 hover:text-gray-900 text-[15px] font-medium transition-colors relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2563EB] transition-all group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop CTA */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                href="/cargar-cv"
                                className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                            >
                                Cargar CV
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-900"
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
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                    <div className="fixed top-[80px] left-4 right-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-xl">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-lg font-medium text-gray-900 hover:text-[#2563EB] transition-colors py-3 border-b border-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 mt-2">
                                <Link
                                    href="/cargar-cv"
                                    className="btn-primary w-full justify-center px-6 py-3 rounded-xl text-base font-semibold text-white shadow-md"
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
