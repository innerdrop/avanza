import Image from "next/image";

export default function ServiciosPage() {
    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container max-w-6xl">
                {/* Header */}
                <div className="mb-20 text-center">
                    <h1 className="text-5xl font-bold mb-4 text-[var(--text-primary)]">
                        Nuestros <span className="text-[var(--primary)]">Servicios</span>
                    </h1>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Soluciones integrales de Recursos Humanos para potenciar tu empresa
                    </p>
                </div>

                {/* Services Grid */}
                <div className="space-y-16">
                    {/* Service 1: Reclutamiento */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-block px-4 py-1 rounded-full bg-[rgba(255,215,0,0.1)] text-[var(--primary)] text-sm font-medium mb-4">
                                Servicio Principal
                            </div>
                            <h2 className="text-4xl font-bold mb-6">Reclutamiento y Selección</h2>
                            <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
                                Encontramos el talento perfecto para tu empresa. Utilizamos metodologías ágiles,
                                entrevistas estructuradas y bases de datos actualizadas para identificar candidatos
                                que se alineen con tu cultura organizacional.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Difusión SIN COSTO en nuestras redes sociales</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Filtrado de CVs y preselección de candidatos</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Entrevistas por competencias</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Informes detallados de candidatos finalistas</span>
                                </li>
                            </ul>
                            <a href="/contacto" className="btn btn-primary">
                                Solicitar este servicio
                            </a>
                        </div>
                        <div className="bento-card min-h-[400px] relative overflow-hidden group">
                            <Image
                                src="/servicio-reclutamiento.png"
                                alt="Reclutamiento y Selección"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* Service 2: Evaluaciones */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="bento-card min-h-[400px] relative overflow-hidden group order-2 md:order-1">
                            <Image
                                src="/servicio-evaluacion.png"
                                alt="Evaluación Psicotécnica"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-4xl font-bold mb-6">Evaluación Psicotécnica</h2>
                            <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
                                Aplicamos herramientas psicométricas validadas para evaluar aptitudes cognitivas,
                                rasgos de personalidad y competencias específicas del puesto.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Test de aptitudes y habilidades</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Evaluación de personalidad</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Assessment Center para posiciones gerenciales</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Informes técnicos detallados</span>
                                </li>
                            </ul>
                            <a href="/contacto" className="btn btn-primary">
                                Solicitar este servicio
                            </a>
                        </div>
                    </div>

                    {/* Service 3: Consultoría */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Consultoría en RRHH</h2>
                            <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
                                Acompañamos a tu empresa en la gestión del capital humano. Desde mediación de
                                conflictos hasta diseño de planes de desarrollo organizacional.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Diagnóstico de clima laboral</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Diseño de planes de capacitación</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Mediación de conflictos laborales</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[var(--primary)] mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">Evaluación de desempeño</span>
                                </li>
                            </ul>
                            <a href="/contacto" className="btn btn-primary">
                                Solicitar este servicio
                            </a>
                        </div>
                        <div className="bento-card min-h-[400px] relative overflow-hidden group">
                            <Image
                                src="/servicio-consultoria.png"
                                alt="Consultoría en RRHH"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-24 text-center bento-card">
                    <h2 className="text-3xl font-bold mb-4">¿Necesitas una solución personalizada?</h2>
                    <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
                        Cada empresa es única. Armamos propuestas a medida según tus necesidades.
                    </p>
                    <a href="/contacto" className="btn btn-primary text-lg px-8">
                        Contactanos
                    </a>
                </div>
            </div>
        </div>
    );
}
