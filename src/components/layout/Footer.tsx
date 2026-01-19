export default function Footer() {
    return (
        <footer className="bg-[var(--secondary)] py-10 mt-auto">
            <div className="container text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left max-w-4xl mx-auto pb-8 border-b border-white/10">
                    <div>
                        <div className="flex items-center gap-1 mb-4">
                            <span className="font-extrabold text-xl text-white tracking-widest" style={{ fontFamily: "'Junegull', 'Nunito', 'Quicksand', sans-serif" }}>MOOVY</span>
                            <span className="font-bold text-xl text-[var(--primary)] tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Jobs</span>
                        </div>
                        <p className="text-sm text-white/70">
                            Conectando talento con oportunidades en Tierra del Fuego.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Servicios de Interés</h4>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li><a href="/publicidad" className="hover:text-[var(--primary)] transition-colors">Publicidad</a></li>
                            <li><a href="/empleos" className="hover:text-[var(--primary)] transition-colors">Buscar Empleo</a></li>
                            <li><a href="/empresas/login" className="hover:text-[var(--primary)] transition-colors">Publicar Oferta</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li><a href="/contacto" className="hover:text-[var(--primary)] transition-colors">Formulario de Contacto</a></li>
                            <li>info@avanzafueguino.com</li>
                        </ul>
                    </div>
                </div>
                <p className="text-white/50 text-sm">
                    &copy; {new Date().getFullYear()} Moovy Jobs. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}
