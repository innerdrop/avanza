import Link from 'next/link';


export default function TestPsicotecnicoLanding() {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">


            <main className="flex-grow container !pt-28 !sm:pt-32 pb-20 px-4 sm:px-0">
                <div className="max-w-4xl mx-auto text-center animate-in">
                    <div className="inline-block px-4 py-1 rounded-full border border-[var(--primary)] bg-[rgba(31,78,216,0.05)] text-[var(--primary)] text-sm font-medium mb-6">
                        🧠 Conócete mejor
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-[var(--text-primary)]">
                        Test de Perfil <span className="text-[var(--primary)]">Laboral</span>
                    </h1>
                    <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
                        Descubre tus fortalezas y áreas de mejora con nuestro test psicotécnico gratuito.
                        Obtén un análisis detallado de tu perfil profesional en minutos.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-16 text-left">
                        <div className="bento-card p-6 bg-white">
                            <div className="text-3xl mb-4">⏱️</div>
                            <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Rápido</h3>
                            <p className="text-[var(--text-secondary)]">Solo te tomará 5 minutos completarlo.</p>
                        </div>
                        <div className="bento-card p-6 bg-white">
                            <div className="text-3xl mb-4">📊</div>
                            <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Detallado</h3>
                            <p className="text-[var(--text-secondary)]">Recibe un informe completo con tu perfil.</p>
                        </div>
                        <div className="bento-card p-6 bg-white">
                            <div className="text-3xl mb-4">💾</div>
                            <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Descargable</h3>
                            <p className="text-[var(--text-secondary)]">Guarda tus resultados en PDF.</p>
                        </div>
                    </div>

                    <Link
                        href="/test-psicotecnico/cuestionario"
                        className="btn btn-primary text-white text-lg px-10 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                    >
                        Comenzar Test Ahora
                    </Link>
                </div>
            </main>

        </div>
    );
}
