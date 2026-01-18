import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Publicita con Nosotros | Avanza Fueguino",
    description: "Llega al mejor talento de Tierra del Fuego con nuestras soluciones de publicidad premium.",
};

export default function PublicidadPage() {
    const adTiers = [
        {
            name: "Banner Premium",
            price: "$50.000",
            period: "/semana",
            description: "Máxima visibilidad en la parte superior de la página de inicio.",
            features: [
                "Ubicación Top Hero (Nivel 1)",
                "Formato visual de alto impacto",
                "Rotación prioritaria",
                "Enlace directo a tu sitio web",
            ],
            cta: "Contratar Premium",
            color: "from-purple-600 to-orange-500",
            popular: true,
        },
        {
            name: "Aviso Destacado",
            price: "$25.000",
            period: "/semana",
            description: "Ubicación estratégica en el cuerpo principal de la home.",
            features: [
                "Ubicación Intermedia (Nivel 2)",
                "Diseño integrado al contenido",
                "Alta tasa de clics",
                "Ideal para promociones",
            ],
            cta: "Contratar Destacado",
            color: "from-blue-500 to-cyan-500",
            popular: false,
        },
        {
            name: "Sidebar Lateral",
            price: "$15.000",
            period: "/semana",
            description: "Presencia constante junto al listado de empleos.",
            features: [
                "Visible en escritorio junto a ofertas",
                "Formato vertical compacto",
                "Rotación constante",
                "Económico y efectivo",
            ],
            cta: "Contratar Sidebar",
            color: "from-emerald-500 to-green-500",
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col gap-8">
            {/* Hero Section */}
            <section className="relative py-12 sm:py-20 bg-[var(--primary)] text-white overflow-hidden rounded-b-[3rem]">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--primary)] to-transparent"></div>

                <div className="container px-4 text-center relative z-10 sm:pt-32">
                    {/* Spacer for Mobile Navbar */}
                    <div className="h-24 sm:hidden"></div>

                    <h1 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tight leading-tight">
                        Destacá tu Empresa <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-200">
                            donde importa
                        </span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed mb-10">
                        Llega a miles de candidatos activos en Tierra del Fuego. Nuestras soluciones de publicidad están diseñadas para maximizar tu visibilidad y atraer al talento correcto.
                    </p>
                    <Link
                        href="/contacto"
                        className="inline-flex items-center gap-2 bg-white text-[var(--primary)] px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:transform hover:scale-105 transition-all"
                    >
                        Contactar Equipo de Ventas
                    </Link>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container px-4 sm:px-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="text-4xl font-bold text-[var(--primary)] mb-2">+5.000</div>
                        <p className="text-gray-500 font-medium">Visitas Mensuales</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="text-4xl font-bold text-[var(--accent)] mb-2">+1.200</div>
                        <p className="text-gray-500 font-medium">Candidatos Activos</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="text-4xl font-bold text-[var(--success)] mb-2">98%</div>
                        <p className="text-gray-500 font-medium">Empresas Satisfechas</p>
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="container px-4 sm:px-0">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Planes Flexibles</h2>
                    <p className="text-[var(--text-secondary)]">Elige la opción que mejor se adapte a tu estrategia de reclutamiento.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {adTiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-3xl p-8 border ${tier.popular ? "border-[var(--primary)] shadow-xl scale-105 z-10" : "border-gray-100 shadow-sm"
                                } flex flex-col`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--primary)] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                                    Más Popular
                                </div>
                            )}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} mb-6`}></div>
                            <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">{tier.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-bold text-[var(--text-primary)]">{tier.price}</span>
                                <span className="text-gray-400">{tier.period}</span>
                            </div>
                            <p className="text-gray-500 mb-8 text-sm leading-relaxed">{tier.description}</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                        <span className="text-green-500 font-bold">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/contacto"
                                className={`w-full py-3 rounded-xl font-bold text-center transition-all ${tier.popular
                                    ? "bg-[var(--primary)] text-white hover:shadow-lg hover:-translate-y-1"
                                    : "bg-gray-50 text-[var(--text-primary)] hover:bg-gray-100"
                                    }`}
                            >
                                {tier.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-gray-900 text-white py-16 sm:py-20 mt-auto">
                <div className="container text-center px-4">
                    <h2 className="text-3xl font-bold mb-6">¿Necesitas un plan a medida?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Contactanos para paquetes trimestrales, anuales o combinaciones especiales. Tenemos descuentos para startups y ONGs.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contacto" className="btn btn-primary text-black font-bold px-8">
                            Hablar con un Asesor
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
