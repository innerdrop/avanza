import Image from "next/image";
import prisma from "@/lib/prisma";
import Link from "next/link";
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
    <div className="flex flex-col min-h-screen pt-24 sm:pt-20 pb-12 px-4 sm:px-0 gap-8 sm:gap-8">

      {/* Premium Banner Ad - Level 1 */}
      <section className="container px-4 sm:px-0">
        <PremiumBanner />
      </section>

      {/* Hero Section */}
      <section className="container relative">
        <div className="max-w-4xl mx-auto text-center z-10 relative animate-in">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.1] text-[var(--text-primary)]">
            Conectamos <span className="text-[var(--primary)]">talento</span> <br className="hidden sm:block" />
            con <span className="text-[var(--primary)]">oportunidades!</span>
          </h1>
          <p className="text-base sm:text-xl text-[var(--text-secondary)] mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Te ayudamos a encontrar al <strong className="text-[var(--primary)]">perfil ideal</strong> para tu empresa.
            Difundimos tu aviso <strong className="text-[var(--success)]">SIN COSTO</strong> en nuestras plataformas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link href="/empleos" className="text-[var(--primary)] border border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white px-6 sm:px-8 py-3 rounded-full font-semibold transition-all w-full sm:w-auto text-center">
              Ver Vacantes
            </Link>
            <Link href="/empresas/login" className="btn btn-primary text-white text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto justify-center shadow-lg hover:shadow-xl">
              Publicar Búsqueda
            </Link>
            <Link href="/publicidad" className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-white/80 backdrop-blur-sm text-[var(--text-secondary)] font-semibold border border-gray-200 hover:bg-white hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all w-full sm:w-auto shadow-sm">
              <span>📢</span> Publicita con Nosotros
            </Link>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="container">
        <div className="text-center mb-10 sm:mb-8 px-4 sm:px-0">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight text-[var(--text-primary)]">Soluciones Integrales</h2>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-2xl mx-auto">
            Estrategias personalizadas para potenciar el activo más valioso de tu empresa.
          </p>
        </div>

        <div className="grid-bento">
          {/* Card 1: Reclutamiento (Large) */}
          <div className="bento-card col-span-1 md:col-span-2 md:row-span-2 flex flex-col justify-end min-h-[280px] sm:min-h-[350px] group relative overflow-hidden rounded-3xl">
            <Image
              src="/servicios-reclutamiento.png"
              alt="Reclutamiento y Selección"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 transition-opacity duration-300"></div>

            <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-between">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-4xl text-white border border-white/20">
                👥
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white tracking-tight">Reclutamiento y Selección</h3>
                <p className="text-white/80 text-sm sm:text-lg max-w-lg leading-relaxed font-light">
                  Identificamos el talento que tu empresa necesita. Procesos ágiles, filtrado por cultura y evaluación de potencial para asegurar el match perfecto.
                </p>
              </div>
              <div className="mt-6 w-16 h-1 bg-[var(--accent)] rounded-full group-hover:w-24 transition-all duration-300"></div>
            </div>
          </div>

          {/* Card 2: Evaluaciones (Small) */}
          <div className="bento-card flex flex-col justify-between p-6 sm:p-8 group min-h-[200px] relative overflow-hidden rounded-3xl">
            <Image
              src="/servicios-psicotecnicos.png"
              alt="Psicotécnicos"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 transition-opacity duration-300"></div>

            <div className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-2xl text-[var(--success)] border border-white/20">
              🧠
            </div>
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white tracking-tight">Psicotécnicos</h3>
              <p className="text-white/80 text-sm leading-relaxed font-light">
                Evaluaciones profundas y precisas para garantizar la idoneidad y el bienestar.
              </p>
            </div>
          </div>

          {/* Card 3: Consultoria (Small) */}
          <div className="bento-card flex flex-col justify-between p-6 sm:p-8 group min-h-[200px] relative overflow-hidden rounded-3xl">
            <Image
              src="/servicios-consultoria.png"
              alt="Consultoría HR"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 transition-opacity duration-300"></div>

            <div className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-2xl text-[var(--accent)] border border-white/20">
              📈
            </div>
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white tracking-tight">Consultoría HR</h3>
              <p className="text-white/80 text-sm leading-relaxed font-light">
                Optimización de procesos, clima laboral y desarrollo organizacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ad - Level 2 */}
      <section className="container px-4 sm:px-0">
        <FeaturedAd />
      </section>

      {/* Trust Platform Section */}
      <section className="container bg-[var(--primary)] rounded-3xl py-8 sm:py-12 px-6 sm:px-12 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-gradient-to-r from-white/20 to-transparent transform rotate-12"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 mt-4 sm:mt-0 tracking-tight">Tu plataforma de confianza</h2>
          <p className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed font-light">
            En <strong className="font-bold">Avanza Fueguino</strong>, conectamos el talento con las oportunidades reales.
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
      </section>

      {/* AI-Powered Features Section */}
      <section className="container bg-[var(--primary)] rounded-3xl py-8 sm:py-12 px-6 sm:px-12 text-white text-center relative overflow-hidden">
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
      </section>

      {/* Jobs + Sidebar Section */}
      <section className="container px-4 sm:px-0">
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
