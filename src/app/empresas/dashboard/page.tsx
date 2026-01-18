"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PremiumLockModal from "@/components/premium/PremiumLockModal";

type Tab = 'empleos' | 'postulaciones';

export default function DashboardEmpresaPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('empleos');
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [companyName, setCompanyName] = useState<string>("");
    const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
    const [filtroEmpleo, setFiltroEmpleo] = useState("todos");
    const [filtroEstado, setFiltroEstado] = useState("todos");

    // AI Analysis States
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any | null>(null);

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedJobForPayment, setSelectedJobForPayment] = useState<any | null>(null);

    // AI Match States
    const [matchingJob, setMatchingJob] = useState<number | null>(null);
    const [matchResult, setMatchResult] = useState<any | null>(null);
    const [showMatchModal, setShowMatchModal] = useState(false);

    // Premium States
    const [companyPlan, setCompanyPlan] = useState<string>("basic");
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [pendingSubscription, setPendingSubscription] = useState<any | null>(null);

    useEffect(() => {
        fetchData();
    }, [router]);

    // Fetch analysis when opening modal
    useEffect(() => {
        if (selectedApplication) {
            setAnalysisResult(null);
            fetchAnalysis(selectedApplication.id);
        }
    }, [selectedApplication]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const jobsRes = await fetch('/api/company/jobs');
            if (jobsRes.status === 401) {
                router.push('/empresas/login');
                return;
            }
            if (jobsRes.ok) {
                const jobsData = await jobsRes.json();
                setJobs(jobsData);
                console.log('Jobs data:', jobsData); // Debug
            }

            // Fetch company profile
            const profileRes = await fetch('/api/company/profile');
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setCompanyName(profileData.name || 'Mi Empresa');
                setCompanyPlan(profileData.plan || 'basic');
            }

            const appsRes = await fetch('/api/company/applications');
            if (appsRes.ok) {
                const appsData = await appsRes.json();
                setApplications(appsData);
            }

            // Fetch subscription status
            const subRes = await fetch('/api/company/subscribe');
            if (subRes.ok) {
                const subData = await subRes.json();
                if (subData.subscription?.status === 'pending') {
                    setPendingSubscription(subData.subscription);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalysis = async (id: number) => {
        try {
            const res = await fetch(`/api/ai/get-analysis?applicationId=${id}`);
            if (res.ok) {
                const data = await res.json();
                setAnalysisResult(data);
            }
        } catch (error) {
            console.error("Error fetching analysis", error);
        }
    };

    const handleAnalyze = async (id: number) => {
        if (companyPlan !== 'premium') {
            setShowPremiumModal(true);
            return;
        }
        setAnalyzing(true);
        try {
            const response = await fetch('/api/ai/analyze-cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: id }),
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysisResult(data);
                alert("Análisis completado con éxito");
            } else {
                const err = await response.json();
                alert(`Error: ${err.error || 'Error al analizar CV'}`);
            }
        } catch (error) {
            console.error("Error analyzing CV:", error);
            alert("Error de conexión");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleLogout = async () => {
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        router.push('/empresas/login');
    };

    const handleDeleteJob = async (id: number) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este empleo? Se eliminarán también todas las postulaciones asociadas.")) return;
        try {
            const res = await fetch(`/api/company/jobs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setJobs(jobs.filter(j => j.id !== id));
                setApplications(applications.filter(a => a.jobPostingId !== id));
            } else {
                alert('Error al eliminar el empleo');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Error de conexión');
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        if (!confirm("¿Cambiar el estado de esta postulación?")) return;
        try {
            const res = await fetch(`/api/company/applications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setApplications(applications.map(a =>
                    a.id === id ? { ...a, status: newStatus } : a
                ));
            } else {
                alert('Error al actualizar el estado');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error de conexión');
        }
    };

    const handleDeleteApplication = async (id: number) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta postulación? Esta acción no se puede deshacer.")) return;
        try {
            const res = await fetch(`/api/company/applications/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setApplications(applications.filter(a => a.id !== id));
                setSelectedApplication(null);
            } else {
                alert('Error al eliminar la postulación');
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            alert('Error de conexión');
        }
    };

    const handleAiMatch = async (jobId: number) => {
        if (companyPlan !== 'premium') {
            setShowPremiumModal(true);
            return;
        }
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

    const getJobStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="px-2.5 py-1 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">⏳ Pendiente</span>;
            case 'active':
                return <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">✓ Aprobado</span>;
            case 'rejected':
                return <span className="px-2.5 py-1 text-xs rounded-full bg-red-50 text-red-600 border border-red-200 font-medium">✕ Rechazado</span>;
            case 'closed':
                return <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">Cerrado</span>;
            default:
                return <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">{status}</span>;
        }
    };

    const getAppStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-amber-50 text-amber-700 border-amber-300";
            case "reviewed": return "bg-blue-50 text-blue-700 border-blue-300";
            case "rejected": return "bg-red-50 text-red-600 border-red-300";
            case "accepted": return "bg-emerald-50 text-emerald-700 border-emerald-300";
            case "interviewed": return "bg-violet-50 text-violet-700 border-violet-300";
            case "hired": return "bg-teal-50 text-teal-700 border-teal-300";
            default: return "bg-slate-100 text-slate-600 border-slate-300";
        }
    };

    const getAppStatusLabel = (status: string) => {
        switch (status) {
            case "pending": return "Pendiente";
            case "reviewed": return "Revisada";
            case "rejected": return "Rechazada";
            case "accepted": return "Aceptada";
            case "interviewed": return "Entrevistado";
            case "hired": return "Contratado";
            default: return status;
        }
    };

    // Helper function to check if a job has pending payment
    const hasPendingPayment = (job: any): boolean => {
        if (!job.payments || !Array.isArray(job.payments)) return false;
        return job.payments.some((p: any) => p.status === 'pending');
    };

    const filteredApplications = applications.filter(a => {
        const matchesEmpleo = filtroEmpleo === "todos" || a.jobPosting?.id?.toString() === filtroEmpleo;
        const matchesEstado = filtroEstado === "todos" || a.status === filtroEstado;
        return matchesEmpleo && matchesEstado;
    });

    const totalPendingApps = applications.filter(a => a.status === 'pending').length;

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white sticky top-0 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-md">
                            🏢
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Panel de Empresa</h1>
                            <p className="text-xs text-slate-400">Gestiona tus empleos y postulaciones</p>
                        </div>
                    </div>

                    {/* Company Name - Center */}
                    <div className="hidden md:flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-xl">
                        <span className="text-slate-400 text-sm">Empresa:</span>
                        <span className="font-bold text-white">{companyName}</span>
                        {companyPlan === 'premium' && (
                            <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 text-xs font-bold rounded-full shadow-sm">
                                👑 Premium
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-slate-600 rounded-lg hover:bg-slate-700 transition-all"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-medium mb-1">Total Empleos</p>
                        <p className="text-2xl font-bold text-slate-800">{jobs.length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-medium mb-1">Activos</p>
                        <p className="text-2xl font-bold text-emerald-600">{jobs.filter(j => j.status === 'active').length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-medium mb-1">Postulaciones</p>
                        <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-medium mb-1">Pendientes</p>
                        <p className="text-2xl font-bold text-amber-600">{totalPendingApps}</p>
                    </div>
                </div>

                {/* Pending Subscription Banner */}
                {pendingSubscription && (
                    <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-xl p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">💳</div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-amber-800 mb-1">Suscripción Premium Pendiente</h3>
                                <p className="text-amber-700 text-sm mb-3">
                                    Realiza la transferencia para activar las funciones de IA.
                                </p>
                                <div className="bg-white rounded-lg p-4 border border-amber-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                    <div>
                                        <span className="text-slate-500 block">Monto:</span>
                                        <span className="font-bold text-emerald-600">${pendingSubscription.amount?.toLocaleString('es-AR')}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Alias:</span>
                                        <span className="font-bold text-slate-800">iyad.bbva</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Titular:</span>
                                        <span className="font-medium text-slate-700">Iyad Marmoud</span>
                                    </div>
                                    <div>
                                        <Link href="/empresas/premium" className="text-blue-600 font-medium hover:underline text-sm">
                                            Ver detalles →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl border border-slate-200 p-1.5 mb-6 shadow-sm inline-flex">
                    <button
                        onClick={() => setActiveTab('empleos')}
                        className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'empleos'
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        📋 Mis Empleos
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'empleos' ? 'bg-slate-600' : 'bg-slate-200 text-slate-600'}`}>{jobs.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('postulaciones')}
                        className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'postulaciones'
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        👥 Postulaciones
                        {totalPendingApps > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-500 text-white animate-pulse">{totalPendingApps}</span>
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800"></div>
                    </div>
                ) : (
                    <>
                        {/* ==================== EMPLEOS TAB ==================== */}
                        {activeTab === 'empleos' && (
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">Mis Publicaciones</h2>
                                        <p className="text-slate-500 text-sm mt-1">Gestiona tus ofertas de empleo</p>
                                    </div>
                                    <Link
                                        href="/empresas/nuevo-anuncio"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02]"
                                    >
                                        <span className="text-lg">+</span>
                                        Publicar Empleo
                                    </Link>
                                </div>

                                {jobs.length === 0 ? (
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                                        <div className="text-5xl mb-4 opacity-50">📋</div>
                                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No tienes publicaciones</h3>
                                        <p className="text-slate-500 mb-6">Crea tu primera oferta de empleo para empezar a recibir candidatos.</p>
                                        <Link
                                            href="/empresas/nuevo-anuncio"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                                        >
                                            Crear mi primer anuncio
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-200 bg-slate-50">
                                                    <th className="text-left py-4 px-5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Puesto</th>
                                                    <th className="text-left py-4 px-5 font-semibold text-xs text-slate-500 uppercase tracking-wider hidden sm:table-cell">Ubicación</th>
                                                    <th className="text-left py-4 px-5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Estado</th>
                                                    <th className="text-center py-4 px-5 font-semibold text-xs text-slate-500 uppercase tracking-wider hidden md:table-cell">Postulaciones</th>
                                                    <th className="text-left py-4 px-5 font-semibold text-xs text-slate-500 uppercase tracking-wider hidden lg:table-cell">Fecha</th>
                                                    <th className="text-right py-4 px-5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {jobs.map((job) => (
                                                    <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="py-4 px-5">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-semibold text-slate-800">{job.title}</p>
                                                                {job.isFeatured && (
                                                                    <span className="text-amber-500 text-sm" title="Destacado">★</span>
                                                                )}
                                                                {hasPendingPayment(job) && (
                                                                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-orange-100 text-orange-700 border border-orange-200 font-bold animate-pulse">💳 Pago Pendiente</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-slate-500 sm:hidden">{job.location}</p>
                                                        </td>
                                                        <td className="py-4 px-5 text-slate-600 hidden sm:table-cell">{job.location}</td>
                                                        <td className="py-4 px-5">{getJobStatusBadge(job.status)}</td>
                                                        <td className="py-4 px-5 text-center hidden md:table-cell">
                                                            <button
                                                                onClick={() => {
                                                                    setFiltroEmpleo(job.id.toString());
                                                                    setActiveTab('postulaciones');
                                                                }}
                                                                className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 border border-blue-200 transition-colors"
                                                            >
                                                                {job._count?.applications || 0}
                                                            </button>
                                                        </td>
                                                        <td className="py-4 px-5 text-slate-500 text-sm hidden lg:table-cell">
                                                            {new Date(job.createdAt).toLocaleDateString('es-AR')}
                                                        </td>
                                                        <td className="py-4 px-5">
                                                            <div className="flex gap-1 justify-end">
                                                                {hasPendingPayment(job) && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedJobForPayment(job);
                                                                            setShowPaymentModal(true);
                                                                        }}
                                                                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-200 animate-pulse"
                                                                        title="Ver datos de pago"
                                                                    >
                                                                        💳
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleAiMatch(job.id)}
                                                                    className={`p-2 rounded-lg transition-colors border ${matchingJob === job.id
                                                                        ? "bg-purple-100 text-purple-700 border-purple-200 cursor-wait"
                                                                        : "text-purple-600 hover:bg-purple-50 border-transparent hover:border-purple-200"
                                                                        }`}
                                                                    title="Encontrar talento ideal con IA"
                                                                    disabled={matchingJob !== null}
                                                                >
                                                                    {matchingJob === job.id ? (
                                                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                    ) : "✨"}
                                                                </button>
                                                                <Link
                                                                    href={`/empresas/dashboard/editar/${job.id}`}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                                                                    title="Editar"
                                                                >
                                                                    ✏️
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDeleteJob(job.id)}
                                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                                                    title="Eliminar"
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Info Card */}
                                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
                                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                        <span>💡</span> ¿Cómo funciona?
                                    </h4>
                                    <ul className="text-sm text-blue-700 space-y-1.5">
                                        <li>• Tus anuncios son revisados por nuestro equipo antes de publicarse.</li>
                                        <li>• Una vez aprobados, aparecerán en la sección de empleos de la plataforma.</li>
                                        <li>• Los anuncios <strong>Destacados</strong> aparecen primero en los resultados.</li>
                                        <li>• Puedes ver y gestionar las postulaciones directamente desde este panel.</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* ==================== POSTULACIONES TAB ==================== */}
                        {activeTab === 'postulaciones' && (
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-800">Postulaciones Recibidas</h2>
                                    <p className="text-slate-500 text-sm mt-1">Gestiona los candidatos que se postularon a tus empleos</p>
                                </div>

                                {/* Filters */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                        <label className="text-xs text-slate-500 uppercase font-semibold mb-2 block">Filtrar por Empleo</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 font-medium"
                                            value={filtroEmpleo}
                                            onChange={(e) => setFiltroEmpleo(e.target.value)}
                                        >
                                            <option value="todos">Todos los empleos</option>
                                            {jobs.map(job => (
                                                <option key={job.id} value={job.id.toString()}>{job.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                        <label className="text-xs text-slate-500 uppercase font-semibold mb-2 block">Estado</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 font-medium"
                                            value={filtroEstado}
                                            onChange={(e) => setFiltroEstado(e.target.value)}
                                        >
                                            <option value="todos">Todos los estados</option>
                                            <option value="pending">Pendiente</option>
                                            <option value="reviewed">Revisado</option>
                                            <option value="interviewed">Entrevistado</option>
                                            <option value="rejected">Rechazado</option>
                                            <option value="hired">Contratado</option>
                                        </select>
                                    </div>
                                </div>

                                {applications.length === 0 ? (
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                                        <div className="text-5xl mb-4 opacity-50">👥</div>
                                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No hay postulaciones</h3>
                                        <p className="text-slate-500">Aún no has recibido postulaciones para tus empleos.</p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="border-b border-slate-200 bg-slate-50">
                                                    <tr className="text-left text-xs text-slate-500 uppercase">
                                                        <th className="py-4 px-4 font-semibold">Candidato</th>
                                                        <th className="py-4 px-4 font-semibold">Empleo</th>
                                                        <th className="py-4 px-4 font-semibold hidden md:table-cell">Área</th>
                                                        <th className="py-4 px-4 font-semibold hidden lg:table-cell">Exp.</th>
                                                        <th className="py-4 px-4 font-semibold">Estado</th>
                                                        <th className="py-4 px-4 font-semibold">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {filteredApplications.map((app) => (
                                                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                                                                        {app.nombre.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-slate-800">{app.nombre}</p>
                                                                        <p className="text-xs text-slate-500">{app.email}</p>
                                                                        <p className="text-xs text-slate-400">{app.telefono}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <p className="text-sm font-medium text-slate-700">{app.jobPosting?.title || 'Sin empleo'}</p>
                                                                <p className="text-xs text-slate-400">
                                                                    {new Date(app.createdAt).toLocaleDateString('es-AR')}
                                                                </p>
                                                            </td>
                                                            <td className="py-4 px-4 text-sm capitalize text-slate-600 hidden md:table-cell">{app.area}</td>
                                                            <td className="py-4 px-4 text-sm text-slate-600 hidden lg:table-cell">{app.experiencia}</td>
                                                            <td className="py-4 px-4">
                                                                <select
                                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${getAppStatusColor(app.status)}`}
                                                                    value={app.status}
                                                                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                                >
                                                                    <option value="pending">Pendiente</option>
                                                                    <option value="reviewed">Revisado</option>
                                                                    <option value="interviewed">Entrevistado</option>
                                                                    <option value="rejected">Rechazado</option>
                                                                    <option value="hired">Contratado</option>
                                                                </select>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex flex-col sm:flex-row gap-1.5">
                                                                    <button
                                                                        onClick={() => setSelectedApplication(app)}
                                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors whitespace-nowrap"
                                                                    >
                                                                        Ver Detalle
                                                                    </button>
                                                                    {app.cvUrl && (
                                                                        <a
                                                                            href={app.cvUrl}
                                                                            target="_blank"
                                                                            download
                                                                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors text-center whitespace-nowrap"
                                                                        >
                                                                            📄 CV
                                                                        </a>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleDeleteApplication(app.id)}
                                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors whitespace-nowrap"
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Application Detail Modal */}
            {selectedApplication && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedApplication(null);
                    }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-slate-800">Detalle del Candidato</h2>
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Header Info */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                                        {selectedApplication.nombre.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">{selectedApplication.nombre}</h3>
                                        <p className="text-slate-500">{selectedApplication.jobPosting?.title}</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${getAppStatusColor(selectedApplication.status)}`}>
                                    {getAppStatusLabel(selectedApplication.status)}
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-5 rounded-xl">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">📧 Email</label>
                                    <p className="font-medium text-slate-800">{selectedApplication.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">📱 Teléfono</label>
                                    <p className="font-medium text-slate-800">{selectedApplication.telefono}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">💼 LinkedIn</label>
                                    {selectedApplication.linkedin ? (
                                        <a href={selectedApplication.linkedin} target="_blank" className="text-blue-600 hover:underline font-medium">Ver Perfil →</a>
                                    ) : (
                                        <span className="text-slate-400">No proporcionado</span>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">📅 Fecha de Postulación</label>
                                    <p className="font-medium text-slate-800">{new Date(selectedApplication.createdAt).toLocaleDateString('es-AR')}</p>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <label className="text-xs text-slate-500 uppercase block mb-1 font-bold">🏷️ Área</label>
                                    <p className="font-medium capitalize text-slate-800">{selectedApplication.area}</p>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <label className="text-xs text-slate-500 uppercase block mb-1 font-bold">📊 Experiencia</label>
                                    <p className="font-medium text-slate-800">{selectedApplication.experiencia}</p>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <label className="text-xs text-slate-500 uppercase block mb-1 font-bold">⏰ Disponibilidad</label>
                                    <p className="font-medium text-slate-800">{selectedApplication.disponibilidad}</p>
                                </div>
                            </div>

                            {/* Presentation */}
                            {selectedApplication.presentacion && (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                                    <label className="text-sm font-bold text-slate-700 uppercase block mb-3 pb-2 border-b border-slate-200">
                                        📝 Presentación Personal
                                    </label>
                                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">
                                        {selectedApplication.presentacion}
                                    </p>
                                </div>
                            )}

                            {/* AI Analysis Section */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
                                        ✨ Análisis de IA
                                    </h4>
                                    {!analysisResult && selectedApplication.cvUrl && (
                                        <button
                                            onClick={() => handleAnalyze(selectedApplication.id)}
                                            disabled={analyzing}
                                            className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
                                        >
                                            {analyzing ? '⏳ Analizando...' : '🔍 Analizar CV'}
                                        </button>
                                    )}
                                </div>

                                {analysisResult ? (
                                    <div className="space-y-4">
                                        {analysisResult.professionalSummary && (
                                            <div className="bg-white/60 rounded-lg p-4 border border-indigo-100">
                                                <h5 className="text-sm font-bold text-indigo-700 mb-2">📋 Resumen Profesional</h5>
                                                <p className="text-sm text-slate-700 italic">{analysisResult.professionalSummary}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {analysisResult.skills && analysisResult.skills.length > 0 && (
                                                <div className="bg-white/60 rounded-lg p-4 border border-indigo-100">
                                                    <h5 className="text-sm font-bold text-indigo-700 mb-2">💡 Habilidades</h5>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {analysisResult.skills.map((skill: string, i: number) => (
                                                            <span key={i} className="px-2 py-1 text-xs bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-md font-medium">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {analysisResult.languages && analysisResult.languages.length > 0 && (
                                                <div className="bg-white/60 rounded-lg p-4 border border-indigo-100">
                                                    <h5 className="text-sm font-bold text-indigo-700 mb-2">🌍 Idiomas</h5>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {analysisResult.languages.map((lang: string, i: number) => (
                                                            <span key={i} className="px-2 py-1 text-xs bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-md font-medium">
                                                                {lang}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {analysisResult.education && (
                                                <div className="bg-white/60 rounded-lg p-4 border border-indigo-100">
                                                    <h5 className="text-sm font-bold text-indigo-700 mb-2">🎓 Educación</h5>
                                                    <p className="text-sm text-slate-700">{analysisResult.education}</p>
                                                </div>
                                            )}
                                            {analysisResult.workExperience && (
                                                <div className="bg-white/60 rounded-lg p-4 border border-indigo-100">
                                                    <h5 className="text-sm font-bold text-indigo-700 mb-2">💼 Experiencia Reciente</h5>
                                                    <p className="text-sm text-slate-700">{analysisResult.workExperience}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        {selectedApplication.cvUrl ? (
                                            <p className="text-indigo-600 text-sm">
                                                Haz clic en "Analizar CV" para obtener habilidades, resumen e insights automáticos del candidato.
                                            </p>
                                        ) : (
                                            <p className="text-slate-500 text-sm">
                                                El candidato no subió CV, no es posible realizar el análisis.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
                                {selectedApplication.cvUrl && (
                                    <a
                                        href={selectedApplication.cvUrl}
                                        target="_blank"
                                        download
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
                                    >
                                        📄 Descargar CV
                                    </a>
                                )}
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Information Modal */}
            {showPaymentModal && selectedJobForPayment && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowPaymentModal(false);
                            setSelectedJobForPayment(null);
                        }
                    }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-200">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">💳 Pago Pendiente</h2>
                                    <p className="text-amber-100 text-sm">Publicación Destacada</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setSelectedJobForPayment(null);
                                    }}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Job Info */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Empleo</p>
                                <p className="font-semibold text-slate-800">{selectedJobForPayment.title}</p>
                                <p className="text-sm text-slate-500">{selectedJobForPayment.company}</p>
                            </div>

                            {/* Payment Amount */}
                            {(() => {
                                const pendingPayment = selectedJobForPayment.payments?.find((p: any) => p.status === 'pending');
                                const amount = pendingPayment?.amount || 0;
                                const days = Math.round(amount / 2500);
                                return (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                                        <p className="text-xs text-amber-600 uppercase font-bold mb-1">Monto a transferir</p>
                                        <p className="text-3xl font-bold text-amber-700">${amount.toLocaleString('es-AR')}</p>
                                        <p className="text-xs text-amber-600 mt-1">Publicación destacada por {days} días</p>
                                    </div>
                                );
                            })()}

                            {/* Bank Details */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                                    🏦 Datos de Transferencia
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                                        <span className="text-sm text-blue-700">Alias:</span>
                                        <span className="font-bold text-blue-900 bg-white px-3 py-1 rounded-lg border border-blue-200">iyad.bbva</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                                        <span className="text-sm text-blue-700">Tipo de cuenta:</span>
                                        <span className="font-medium text-blue-900">Caja de Ahorro</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                                        <span className="text-sm text-blue-700">Titular:</span>
                                        <span className="font-medium text-blue-900">Iyad Marmoud</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-blue-700">DNI:</span>
                                        <span className="font-medium text-blue-900">19.094.022</span>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                <p className="text-sm text-emerald-700">
                                    <strong>📋 Instrucciones:</strong> Una vez realizada la transferencia, envíanos el comprobante por WhatsApp o email. Activaremos tu publicación destacada en menos de 24 horas.
                                </p>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setSelectedJobForPayment(null);
                                }}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-colors"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Match Results Modal */}
            {showMatchModal && matchResult && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                    onClick={() => setShowMatchModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center rounded-t-2xl relative overflow-hidden">
                            <h3 className="text-xl font-bold flex items-center justify-center gap-2">
                                <span className="text-2xl">✨</span> Talento Recomendado por IA
                            </h3>
                            <p className="text-purple-100 text-sm mt-1">
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
                                <div className="flex items-start justify-between gap-4 flex-wrap">
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
                                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-purple-600 hover:border-purple-200 text-sm rounded-lg shadow-sm transition-colors"
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
                                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all"
                            >
                                Contactar candidato
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Lock Modal */}
            {showPremiumModal && (
                <PremiumLockModal onClose={() => setShowPremiumModal(false)} />
            )}
        </div>
    );
}
