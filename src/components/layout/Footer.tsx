import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Logo & Description */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-1 mb-4">
                            <span
                                className="font-extrabold text-xl text-[#e60012] tracking-widest uppercase"
                                style={{ fontFamily: "'Junegull', sans-serif" }}
                            >
                                MOOVY
                            </span>
                            <span
                                className="font-bold text-xl text-[#2563EB] tracking-tight"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Jobs
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Tu plataforma de confianza para buscar empleo y talento en Tierra del Fuego.
                        </p>
                    </div>

                    {/* Para Candidatos */}
                    <div>
                        <h4 className="text-gray-900 font-semibold mb-4">Para Candidatos</h4>
                        <ul className="space-y-2">
                            <li><Link href="/empleos" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Buscar Empleos</Link></li>
                            <li><Link href="/cargar-cv" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Cargar CV</Link></li>
                            <li><Link href="/test-psicotecnico" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Test Laboral</Link></li>
                        </ul>
                    </div>

                    {/* Para Empresas */}
                    <div>
                        <h4 className="text-gray-900 font-semibold mb-4">Para Empresas</h4>
                        <ul className="space-y-2">
                            <li><Link href="/empresas/login" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Portal Empresas</Link></li>
                            <li><Link href="/servicios" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Servicios</Link></li>
                            <li><Link href="/publicidad" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Publicidad</Link></li>
                        </ul>
                    </div>

                    {/* Ecosistema MOOVY */}
                    <div>
                        <h4 className="text-gray-900 font-semibold mb-4">Ecosistema MOOVY</h4>
                        <ul className="space-y-2">
                            <li><a href="https://somosmoovy.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#e60012] transition-colors text-sm">MOOVY Store</a></li>
                            <li><a href="https://x.somosmoovy.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#00D4AA] transition-colors text-sm">MOOVY X</a></li>
                            <li><Link href="/contacto" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Contacto</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} MOOVY Jobs™ · Ushuaia, Tierra del Fuego · Parte del ecosistema MOOVY
                    </p>
                </div>
            </div>
        </footer>
    );
}
