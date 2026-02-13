import Image from "next/image";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

import PremiumBanner from "@/components/ads/PremiumBanner";
import FeaturedAd from "@/components/ads/FeaturedAd";
import SidebarAds from "@/components/ads/SidebarAds";

export default async function Home() {
  const latestJobs = await prisma.jobPosting.findMany({
    where: {
      status: "active",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  return (
    <div className="flex flex-col min-h-screen pt-24 sm:pt-20 pb-12 gap-8">

      {/* Premium Banner Ad - Level 1 */}
      <section className="container px-4">
        <PremiumBanner />
      </section>

      {/* Hero Section */}
      <section className="container px-4 relative">
        <div className="max-w-4xl mx-auto text-center z-10 relative animate-in">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.1] text-[var(--text-primary)]">
            Conectamos <span className="text-[var(--primary)]">talento</span> <br className="hidden sm:block" />
            con <span className="text-[var(--primary)]">oportunidades!</span>
          </h1>
        </div>
        {/* Tarjetas Principales - Diseño Horizontal Extendido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12 w-full">
          {/* Card 1: Candidates */}
          <Link href="/empleos" className="group p-6 rounded-2xl bg-white border-4 border-blue-500 shadow-lg hover:scale-[1.01] hover:shadow-2xl transition-all duration-300 flex items-center gap-5 relative overflow-hidden">
            <div className="w-20 h-20 flex-shrink-0 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-4xl shadow-md group-hover:bg-blue-700 transition-colors">
              🎯
            </div>
            <div className="flex flex-col items-start text-left flex-grow">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-1">Candidatos</span>
              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">Busco Trabajo</h3>
              <p className="text-gray-600 text-sm leading-snug mb-2 font-medium">Encontrá tu próxima oportunidad profesional.</p>
              <span className="text-blue-700 font-extrabold text-xs uppercase tracking-tight flex items-center gap-1">
                Buscar Empleo <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </Link>

          {/* Card 2: Companies */}
          <Link href="/empresas/login" className="group p-6 rounded-2xl bg-white border-4 border-emerald-500 shadow-lg hover:scale-[1.01] hover:shadow-2xl transition-all duration-300 flex items-center gap-5 relative overflow-hidden">
            <div className="w-20 h-20 flex-shrink-0 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-4xl shadow-md group-hover:bg-emerald-700 transition-colors">
              🚀
            </div>
            <div className="flex flex-col items-start text-left flex-grow">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-1">Empresas</span>
              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">Soy Empresa</h3>
              <p className="text-gray-600 text-sm leading-snug mb-2 font-medium">Gestioná talento local eficientemente.</p>
              <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-tight flex items-center gap-1">
                Publicar Búsqueda <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </Link>

          {/* Card 3: Ads */}
          <Link href="/contacto" className="group p-6 rounded-2xl bg-white border-4 border-amber-500 shadow-lg hover:scale-[1.01] hover:shadow-2xl transition-all duration-300 flex items-center gap-5 relative overflow-hidden">
            <div className="w-20 h-20 flex-shrink-0 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-4xl shadow-md group-hover:bg-amber-600 transition-colors">
              ✨
            </div>
            <div className="flex flex-col items-start text-left flex-grow">
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-1">Publicidad</span>
              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">Publicidad</h3>
              <p className="text-gray-600 text-sm leading-snug mb-2 font-medium">Potenciá tu marca en Tierra del Fuego.</p>
              <span className="text-amber-700 font-extrabold text-xs uppercase tracking-tight flex items-center gap-1">
                Contactar <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="container px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight text-[var(--text-primary)]">Potenciamos el Talento Fueguino</h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-3xl mx-auto">
            Somos la plataforma líder en conexión laboral de la región, brindando herramientas modernas para candidatos y empresas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
          {/* Card 1: TDF Connectivity (Large) */}
          <div className="md:col-span-2 relative group overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="/tdf-composite.png"
              alt="Conectividad Tierra del Fuego - Ushuaia, Tolhuin, Río Grande"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full z-10">
              <div className="inline-block px-4 py-1 rounded-full bg-blue-500/80 text-white text-xs font-bold mb-3 border border-white/20 backdrop-blur-md uppercase tracking-wide">
                Territorio
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 shadow-sm">Conectividad Local</h3>
              <p className="text-white/90 text-lg max-w-2xl font-medium drop-shadow-md">
                Unimos Ushuaia, Río Grande y Tolhuin en una sola red digital de oportunidades.
              </p>
            </div>
          </div>

          {/* Card 2: Candidate Success (Tall) */}
          <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="/platform-candidate.png"
              alt="Éxito Profesional"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full z-10">
              <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/80 text-white text-xs font-bold mb-3 border border-white/20 backdrop-blur-md uppercase tracking-wide">
                Candidatos
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 shadow-sm">Tu Próximo Desafío</h3>
              <p className="text-white/90 text-sm font-medium drop-shadow-md">
                Accedé a las mejores ofertas laborales de la provincia.
              </p>
            </div>
          </div>

          {/* Card 3: Corporate Solutions */}
          <div className="relative group overflow-hidden rounded-3xl shadow-2xl bg-white">
            <Image
              src="/platform-meeting.png"
              alt="Soluciones Corporativas"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full z-10">
              <div className="inline-block px-4 py-1 rounded-full bg-slate-600/80 text-white text-xs font-bold mb-3 border border-white/20 backdrop-blur-md uppercase tracking-wide">
                Empresas
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 shadow-sm">Gestión Estratégica</h3>
              <p className="text-white/90 text-sm font-medium drop-shadow-md">
                Herramientas de selección modernas para equipos de alto rendimiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ad - Level 2 */}
      <section className="container px-4">
        <FeaturedAd />
      </section>

      {/* Trust Platform Section */}
      <section className="container px-4">
        <div className="bg-[var(--primary)] rounded-3xl py-8 sm:py-12 px-6 sm:px-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-gradient-to-r from-white/20 to-transparent transform rotate-12"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 mt-4 sm:mt-0 tracking-tight">Tu plataforma de confianza</h2>
            <p className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed font-light">
              En <strong className="font-bold">Moovy Jobs</strong>, conectamos el talento con las oportunidades reales.
              Sin intermediarios innecesarios, con total transparencia y el respaldo de un equipo comprometido con el desarrollo profesional de la región.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-bold text-white mb-1">Seguridad</h3>
                <p className="text-sm text-white/80">Datos protegidos y procesos claros.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl mb-2">⭐</div>
                <h3 className="font-bold text-white mb-1">Calidad</h3>
                <p className="text-sm text-white/80">Ofertas verificadas y serias.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-bold text-white mb-1">Crecimiento</h3>
                <p className="text-sm text-white/80">Impulsamos tu carrera profesional.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Features Section */}
      <section className="container px-4">
        <div className="bg-[var(--primary)] rounded-3xl py-8 sm:py-12 px-6 sm:px-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-gradient-to-r from-white/20 to-transparent transform rotate-12"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
                <span className="text-xl">✨</span>
                Potenciado por Inteligencia Artificial
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Reclutamiento del Futuro
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto font-light">
                Utilizamos tecnología de punta para conectar el talento ideal con las oportunidades perfectas.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xl mb-4 shadow-lg">
                  🎯
                </div>
                <h3 className="text-lg font-bold text-white mb-2">IA Match Talento</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Encuentra automáticamente el candidato ideal para cada búsqueda.
                </p>
              </div>

              <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xl mb-4 shadow-lg">
                  📄
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Análisis de CV</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Extracción inteligente de habilidades y experiencia.
                </p>
              </div>

              <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl mb-4 shadow-lg">
                  🧠
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Test Psicotécnico</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-3">
                  Evaluación gratuita con resultados inmediatos.
                </p>
                <Link href="/test-psicotecnico" className="text-emerald-200 text-sm font-medium hover:text-white transition-colors">
                  Hacer test gratis →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs + Sidebar Section */}
      <section className="container px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Jobs */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Agregados Recientemente</h2>
              <Link href="/empleos" className="text-[var(--accent)] text-sm font-medium hover:underline">Ver todas →</Link>
            </div>

            <div className="space-y-3">
              {latestJobs.length > 0 ? (
                latestJobs.map((job) => (
                  <Link key={job.id} href={`/empleos/${job.id}`} className="block">
                    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--primary)] transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 group cursor-pointer shadow-sm hover:shadow-md">
                      <div className="flex-1">
                        <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">{job.title}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {job.company} · {job.location} · {job.type}
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--primary)] text-white group-hover:bg-[var(--accent)] transition-colors shrink-0">
                        Ver detalle →
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-[var(--text-secondary)]">
                  No hay búsquedas activas en este momento.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Ads Level 3 */}
          <div className="lg:w-72 shrink-0">
            <SidebarAds />
          </div>
        </div>
      </section>
    </div>
  );
}
