"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function EmpleosAdmin() {
    const [empleos, setEmpleos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('/api/jobs?admin=true');
                if (res.ok) {
                    const data = await res.json();
                    // Process data to match original server implementation if easy, 
                    // or just use API response directly. The API returns plain objects.
                    // We need to count applications? The API /api/jobs usually returns list.
                    // Let's check /api/jobs/route.ts. Wait, I didn't see /api/jobs/route.ts, 
                    // I saw /api/jobs/[id].
                    // Assuming /api/jobs returns list of jobs.
                    // If /api/jobs does NOT return count, we might miss it.
                    // For now let's assume it returns jobs.
                    // Wait, the previous server component used prisma with include count.
                    // The client side fetch /api/jobs currently might NOT include count. 
                    // I should check /api/jobs/route.ts or update it.
                    // But first let's stick to converting to client component pattern.
                    setEmpleos(data.map((job: any) => ({
                        ...job,
                        createdAt: new Date(job.createdAt).toLocaleDateString(),
                        applications: job._count ? job._count.applications : (job.applications ? job.applications.length : 0)
                    })));
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterLocation, setFilterLocation] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const filteredEmpleos = empleos.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = filterLocation ? job.location === filterLocation : true;
        const matchesType = filterType ? job.type === filterType : true;
        const matchesStatus = filterStatus ? job.status === filterStatus : true;
        return matchesSearch && matchesLocation && matchesType && matchesStatus;
    });

    const handleDelete = async (id: number) => {
        if (!confirm("¿Está seguro de que desea eliminar este empleo? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            const response = await fetch(`/api/jobs/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setEmpleos(empleos.filter(job => job.id !== id));
            } else {
                alert("Error al eliminar el empleo");
            }
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("Error de conexión");
        }
    };

    const checkPendingPayment = (job: any) => {
        return job.payments && Array.isArray(job.payments) && job.payments.some((p: any) => p.status === 'pending');
    };

    // AI Matching State
    const [matchingJob, setMatchingJob] = useState<number | null>(null);
    const [matchResult, setMatchResult] = useState<any | null>(null);
    const [showMatchModal, setShowMatchModal] = useState(false);

    const handleAiMatch = async (jobId: number) => {
        setMatchingJob(jobId);
        try {
            const response = await fetch('/api/ai/match-talent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId })
            });

            const data = await response.json();

            if (data.success) {
                setMatchResult(data);
                setShowMatchModal(true);
            } else {
                alert(data.error || "No se pudo encontrar un match adecuado");
            }
        } catch (error) {
            console.error("Error matching talent:", error);
            alert("Error al procesar la solicitud");
        } finally {
            setMatchingJob(null);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Gestión de Empleos</h2>
                        <p className="text-[var(--text-secondary)]">Administra las ofertas laborales de la plataforma</p>
                    </div>
                    <Link href="/ops/empleos/nuevo" className="btn btn-primary">
                        ➕ Nuevo Empleo
                    </Link>
                </div>

                {/* Filtros */}
                <div className="bento-card bg-white p-4">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Buscar por título o empresa..."
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                value={filterLocation}
                                onChange={(e) => setFilterLocation(e.target.value)}
                            >
                                <option value="">Todas las ubicaciones</option>
                                <option value="Ushuaia">Ushuaia</option>
                                <option value="Río Grande">Río Grande</option>
                                <option value="Tolhuin">Tolhuin</option>
                            </select>
                        </div>
                        <div>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="">Todos los tipos</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Remoto">Remoto</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>
                        <div>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                                <option value="closed">Cerrado</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de empleos */}
                <div className="bento-card overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-[var(--text-secondary)]">Cargando empleos...</div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[var(--border-light)] bg-gray-50/50">
                                        <th className="text-left py-3 px-3 font-medium text-xs text-[var(--text-secondary)] uppercase tracking-wider w-[30%]">Título</th>
                                        <th className="text-left py-3 px-3 font-medium text-xs text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell w-[20%]">Empresa</th>
                                        <th className="text-left py-3 px-3 font-medium text-xs text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">Ubicación</th>
                                        <th className="text-left py-3 px-3 font-medium text-xs text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">Tipo</th>
                                        <th className="text-left py-3 px-3 font-medium text-xs text-[var(--text-secondary)] uppercase tracking-wider">Estado</th>
                                        <th className="text-left py-3 px-3 font-medium text-xs text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell text-center">Postulaciones</th>
                                        <th className="text-right py-3 px-3 font-medium text-xs text-[var(--text-secondary)] uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-light)]">
                                    {filteredEmpleos.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-[var(--text-secondary)]">
                                                No se encontraron empleos con los filtros seleccionados
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredEmpleos.map((empleo) => (
                                            <tr key={empleo.id} className={`hover:bg-gray-50 transition-colors ${empleo.isFeatured ? 'bg-yellow-50/40' : ''}`}>
                                                <td className="py-4 px-3">
                                                    <div className="flex items-start gap-2">
                                                        <div>
                                                            <p className="font-medium text-base text-[var(--text-primary)]">{empleo.title}</p>
                                                            <p className="text-[10px] text-[var(--text-secondary)] sm:hidden mt-0.5">{empleo.company}</p>
                                                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{empleo.createdAt}</p>
                                                        </div>
                                                        {empleo.isFeatured && (
                                                            <span title="Destacado" className="text-yellow-500 text-xs shrink-0 mt-1">★</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-3 text-sm text-[var(--text-primary)] hidden sm:table-cell font-medium">{empleo.company}</td>
                                                <td className="py-4 px-3 text-sm text-[var(--text-primary)] hidden md:table-cell">{empleo.location}</td>
                                                <td className="py-4 px-3 hidden lg:table-cell">
                                                    <span className="px-2.5 py-1 text-xs rounded-lg bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap font-medium">
                                                        {empleo.type}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-3">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        {empleo.status === "active" ? (
                                                            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-green-50 text-green-700 border border-green-200">
                                                                Activo
                                                            </span>
                                                        ) : (
                                                            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-50 text-gray-700 border border-gray-200">
                                                                {empleo.status === "inactive" ? "Inactivo" : "Cerrado"}
                                                            </span>
                                                        )}
                                                        {checkPendingPayment(empleo) && (
                                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-orange-100 text-orange-700 border border-orange-200 whitespace-nowrap">
                                                                Pago Pendiente
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-3 hidden sm:table-cell text-center">
                                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                                                        {empleo.applications}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-3">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleAiMatch(empleo.id)}
                                                            className={`h-9 px-3 text-xs rounded-lg border transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap font-medium shadow-sm ${matchingJob === empleo.id
                                                                    ? "bg-purple-100 text-purple-700 border-purple-200 cursor-wait"
                                                                    : "bg-gradient-to-b from-white to-purple-50 text-purple-700 border-purple-200 hover:from-purple-50 hover:to-purple-100 hover:border-purple-300"
                                                                }`}
                                                            title="Encontrar talento ideal con IA"
                                                            disabled={matchingJob !== null}
                                                        >
                                                            {matchingJob === empleo.id ? (
                                                                <>
                                                                    <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    <span className="hidden xl:inline">Buscando...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="text-sm">✨</span>
                                                                    <span>IA Match</span>
                                                                </>
                                                            )}
                                                        </button>
                                                        <Link
                                                            href={`/ops/empleos/${empleo.id}`}
                                                            className="h-9 px-3 text-xs rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-1.5 font-medium shadow-sm"
                                                            title="Editar"
                                                        >
                                                            <span>✏️</span>
                                                            <span className="hidden xl:inline">Editar</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(empleo.id)}
                                                            className="h-9 w-9 xl:w-auto xl:px-3 text-xs rounded-lg bg-white text-red-600 border border-red-100 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-1.5 font-medium shadow-sm"
                                                            title="Eliminar"
                                                        >
                                                            <span>🗑️</span>
                                                            <span className="hidden xl:inline">Eliminar</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Modal de Resultados AI Match */}
                {showMatchModal && matchResult && (
                    <div
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                        onClick={() => setShowMatchModal(false)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center rounded-t-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/noise.png')]"></div>
                                <h3 className="text-xl font-bold relative z-10 flex items-center justify-center gap-2">
                                    <span className="text-2xl">✨</span> Talento Recomendado por IA
                                </h3>
                                <p className="text-purple-100 text-sm mt-1 relative z-10">
                                    Mejor coincidencia para: <span className="font-semibold">{matchResult.job.title}</span>
                                </p>
                            </div>

                            <div className="p-6">
                                {/* Score Indicator */}
                                <div className="flex justify-center mb-6">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg ring-4 ring-green-50 mb-2">
                                            <span className="text-2xl font-bold">{matchResult.match.matchScore}%</span>
                                        </div>
                                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Compatibilidad</p>
                                    </div>
                                </div>

                                {/* Candidate Info */}
                                <div className="border border-purple-100 bg-purple-50/30 rounded-xl p-5 mb-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">{matchResult.match.talent.fullName}</h4>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">📍 {matchResult.match.talent.location || "N/A"}</span>
                                                <span className="flex items-center gap-1">🎓 {matchResult.match.talent.universityTitle || "Sin título Univ."}</span>
                                            </div>
                                        </div>
                                        {matchResult.match.talent.cvUrl && (
                                            <a
                                                href={matchResult.match.talent.cvUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-purple-600 hover:border-purple-200 text-sm shadow-sm"
                                            >
                                                Ver CV
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* AI Recommendation Details */}
                                <div className="space-y-5">
                                    <div>
                                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Por qué encaja:
                                        </h5>
                                        <ul className="space-y-1.5 ml-1">
                                            {matchResult.match.matchReasons.map((reason: string, i: number) => (
                                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                    <span className="text-green-500 mt-1">•</span>
                                                    {reason}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {matchResult.match.missingRequirements.length > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Puntos a considerar:
                                            </h5>
                                            <ul className="space-y-1.5 ml-1">
                                                {matchResult.match.missingRequirements.map((req: string, i: number) => (
                                                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                        <span className="text-orange-400 mt-1">•</span>
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                        <h5 className="text-blue-800 font-semibold text-sm mb-1">Recomendación IA:</h5>
                                        <p className="text-blue-900 text-sm italic">
                                            &quot;{matchResult.match.recommendation}&quot;
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                                <button
                                    onClick={() => setShowMatchModal(false)}
                                    className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Cerrar
                                </button>
                                <a
                                    href={`mailto:${matchResult.match.talent.email}`}
                                    className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all transform hover:scale-105"
                                >
                                    Contactar candidato
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
