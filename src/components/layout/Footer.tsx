export default function Footer() {
    return (
        <footer className="bg-[var(--card-bg)] py-8 mt-auto">
            <div className="container text-center text-[var(--muted)]">
                <p className="mb-4">
                    &copy; {new Date().getFullYear()} Avanza Fueguino. Todos los derechos reservados.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left max-w-4xl mx-auto border-b border-[var(--border-light)] pb-8">
                    <div>
                        <h4 className="font-bold text-[var(--text-primary)] mb-4">Avanza Fueguino</h4>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Conectando talento con oportunidades en Tierra del Fuego.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-[var(--text-primary)] mb-4">Servicios de Interés</h4>
                        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                            <li><a href="/publicidad" className="hover:text-[var(--primary)] transition-colors">Publicidad</a></li>
                            <li><a href="/empleos" className="hover:text-[var(--primary)] transition-colors">Buscar Empleo</a></li>
                            <li><a href="/empresas/login" className="hover:text-[var(--primary)] transition-colors">Publicar Oferta</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-[var(--text-primary)] mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                            <li><a href="/contacto" className="hover:text-[var(--primary)] transition-colors">Formulario de Contacto</a></li>
                            <li>info@avanzafueguino.com</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
