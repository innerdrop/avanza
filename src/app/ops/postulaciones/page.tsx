"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";

export default function PostulacionesAdmin() {
    const [filtroEmpleo, setFiltroEmpleo] = useState("todos");
    const [filtroEstado, setFiltroEstado] = useState("todos");

    const [postulaciones, setPostulaciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

    // AI Analysis State
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any | null>(null);

    useEffect(() => {
        const fetchPostulaciones = async () => {
            try {
                const response = await fetch('/api/applications');
                if (response.ok) {
                    const data = await response.json();
                    setPostulaciones(data);
                }
            } catch (error) {
                console.error('Error fetching postulaciones:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostulaciones();
    }, []);

    // Fetch analysis when opening modal
    useEffect(() => {
        if (selectedApplication) {
            setAnalysisResult(null); // Reset
            fetchAnalysis(selectedApplication.id);
        }
    }, [selectedApplication]);

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

    // Filter logic
    const filteredPostulaciones = postulaciones.filter(p => {
        const matchesEmpleo = filtroEmpleo === "todos" ||
            (p.jobPosting?.title === filtroEmpleo) ||
            (filtroEmpleo === "espontanea" && !p.jobPosting);

        const matchesEstado = filtroEstado === "todos" || p.status === filtroEstado;

        return matchesEmpleo && matchesEstado;
    });

    const handleStatusChange = async (id: number, newStatus: string) => {
        if (!confirm("¿Está seguro de que desea cambiar el estado de esta postulación?")) {
            return;
        }

        try {
            const response = await fetch(`/api/applications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setPostulaciones(postulaciones.map(p =>
                    p.id === id ? { ...p, status: newStatus } : p
                ));
            } else {
                alert("Error al actualizar el estado");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error de conexión");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Está seguro de que desea eliminar esta postulación? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            const response = await fetch(`/api/applications/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPostulaciones(postulaciones.filter(p => p.id !== id));
            } else {
                alert("Error al eliminar la postulación");
            }
        } catch (error) {
            console.error("Error deleting application:", error);
            alert("Error de conexión");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-[rgba(255,215,0,0.1)] text-[var(--primary)] border-[var(--primary)]";
            case "reviewed":
                return "bg-[rgba(42,157,143,0.1)] text-[var(--accent)] border-[var(--accent)]";
            case "rejected":
                return "bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)]";
            case "accepted":
                return "bg-[rgba(42,157,143,0.2)] text-[var(--accent)] border-[var(--accent)]";
            case "interviewed":
                return "bg-[rgba(100,100,255,0.1)] text-blue-400 border-blue-400";
            case "hired":
                return "bg-[rgba(0,255,0,0.1)] text-green-400 border-green-400";
            default:
                return "";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "pending":
                return "Pendiente";
            case "reviewed":
                return "Revisada";
            case "rejected":
                return "Rechazada";
            case "accepted":
                return "Aceptada";
            case "interviewed":
                return "Entrevistado";
            case "hired":
                return "Contratado";
            default:
                return status;
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Postulaciones</h1>
                    <p className="text-[var(--text-secondary)]">Gestión de candidatos y procesos de selección</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-glass">
                        📥 Exportar CSV
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bento-card p-4">
                    <label className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-2 block">Filtrar por Empleo</label>
                    <select
                        className="w-full bg-transparent border-none text-[var(--text-primary)] focus:ring-0 p-0 font-medium"
                        value={filtroEmpleo}
                        onChange={(e) => setFiltroEmpleo(e.target.value)}
                    >
                        <option value="todos">Todos los empleos</option>
                        <option value="espontanea">Candidatura Espontánea</option>
                        {Array.from(new Set(postulaciones.filter(p => p.jobPosting).map(p => p.jobPosting.title))).map((title: any) => (
                            <option key={title} value={title}>{title}</option>
                        ))}
                    </select>
                </div>
                <div className="bento-card p-4">
                    <label className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-2 block">Estado</label>
                    <select
                        className="w-full bg-transparent border-none text-[var(--text-primary)] focus:ring-0 p-0 font-medium"
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pending">Pendiente</option>
                        <option value="reviewed">En Revisión</option>
                        <option value="interviewed">Entrevistado</option>
                        <option value="rejected">Rechazado</option>
                        <option value="hired">Contratado</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="bento-card overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-[var(--text-secondary)]">Cargando postulaciones...</div>
                    ) : (
                        <table className="w-full">
                            <thead className="border-b border-[var(--border-light)]">
                                <tr className="text-left text-sm text-[var(--text-secondary)]">
                                    <th className="py-4 px-4 font-medium">Candidato</th>
                                    <th className="py-4 px-4 font-medium">Empleo</th>
                                    <th className="py-4 px-4 font-medium">Área</th>
                                    <th className="py-4 px-4 font-medium">Exp.</th>
                                    <th className="py-4 px-4 font-medium">Estado</th>
                                    <th className="py-4 px-4 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-light)]">
                                {filteredPostulaciones.map((postulacion) => (
                                    <tr key={postulacion.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-black flex items-center justify-center font-bold">
                                                    {postulacion.nombre.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{postulacion.nombre}</p>
                                                    <p className="text-xs text-[var(--text-secondary)]">{postulacion.email}</p>
                                                    <p className="text-xs text-[var(--text-secondary)]">{postulacion.telefono}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-sm">{postulacion.jobPosting?.title || 'Candidatura Espontánea'}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">
                                                {new Date(postulacion.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 text-sm capitalize">{postulacion.area}</td>
                                        <td className="py-4 px-4 text-sm">{postulacion.experiencia}</td>
                                        <td className="py-4 px-4">
                                            <select
                                                className={`px-3 py-1 rounded-full text-xs font-medium border bg-opacity-10 cursor-pointer focus:outline-none ${getStatusColor(postulacion.status)}`}
                                                value={postulacion.status}
                                                onChange={(e) => handleStatusChange(postulacion.id, e.target.value)}
                                            >
                                                <option value="pending">Pendiente</option>
                                                <option value="reviewed">Revisado</option>
                                                <option value="interviewed">Entrevistado</option>
                                                <option value="rejected">Rechazado</option>
                                                <option value="hired">Contratado</option>
                                            </select>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <button
                                                    onClick={() => setSelectedApplication(postulacion)}
                                                    className="px-3 py-1 text-xs font-medium rounded-lg bg-[rgba(255,215,0,0.1)] text-[var(--primary)] border border-[var(--primary)] hover:bg-[rgba(255,215,0,0.2)] transition-colors whitespace-nowrap"
                                                >
                                                    Ver Detalle
                                                </button>
                                                {postulacion.cvUrl && (
                                                    <a
                                                        href={postulacion.cvUrl}
                                                        target="_blank"
                                                        download
                                                        className="px-3 py-1 text-xs font-medium rounded-lg bg-[rgba(255,255,255,0.05)] text-black border border-[var(--border-light)] hover:bg-[rgba(255,255,255,0.1)] transition-colors text-center whitespace-nowrap"
                                                    >
                                                        Descargar CV
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(postulacion.id)}
                                                    className="px-3 py-1 text-xs font-medium rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors whitespace-nowrap"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Details Modal */}
            {selectedApplication && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => {
                    if (e.target === e.currentTarget) setSelectedApplication(null);
                }}>
                    <div className="bg-white border border-[var(--border-light)] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-[var(--border-light)] flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Detalle de Postulación</h2>
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Header Info */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-3xl font-bold text-[var(--primary)] mb-1">{selectedApplication.nombre}</h3>
                                    <p className="text-[var(--text-secondary)]">{selectedApplication.jobPosting?.title || 'Candidatura Espontánea'}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(selectedApplication.status)}`}>
                                    {getStatusLabel(selectedApplication.status)}
                                </div>
                            </div>

                            {/* Contact Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 border border-gray-100 p-5 rounded-xl">
                                <div>
                                    <label className="text-xs text-[var(--text-secondary)] uppercase font-bold text-[10px] tracking-wider mb-1 block">Email</label>
                                    <p className="font-medium text-[var(--text-primary)]">{selectedApplication.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-secondary)] uppercase font-bold text-[10px] tracking-wider mb-1 block">Teléfono</label>
                                    <p className="font-medium text-[var(--text-primary)]">{selectedApplication.telefono}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-secondary)] uppercase font-bold text-[10px] tracking-wider mb-1 block">LinkedIn</label>
                                    <p>{selectedApplication.linkedin ?
                                        <a href={selectedApplication.linkedin} target="_blank" className="text-[var(--primary)] hover:underline font-medium">Ver Perfil</a>
                                        : <span className="text-gray-400">-</span>}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-secondary)] uppercase font-bold text-[10px] tracking-wider mb-1 block">Fecha</label>
                                    <p className="font-medium text-[var(--text-primary)]">{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* AI Analysis Section */}
                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-[var(--primary)] flex items-center gap-2">
                                        ✨ Análisis de IA
                                    </h3>
                                    {!analysisResult && (
                                        <button
                                            onClick={() => handleAnalyze(selectedApplication.id)}
                                            disabled={analyzing}
                                            className="btn btn-sm bg-[var(--primary)] text-white hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {analyzing ? 'Analizando...' : 'Analizar CV'}
                                        </button>
                                    )}
                                </div>

                                {analysisResult ? (
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-1">Resumen Profesional</h4>
                                            <p className="text-sm text-[var(--text-primary)] italic">{analysisResult.professionalSummary}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-1">Habilidades Detectadas</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {analysisResult.skills && analysisResult.skills.map((skill: string, i: number) => (
                                                        <span key={i} className="px-2 py-1 text-xs bg-white border border-blue-200 text-blue-700 rounded-md shadow-sm">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-1">Idiomas</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {analysisResult.languages && analysisResult.languages.map((lang: string, i: number) => (
                                                        <span key={i} className="px-2 py-1 text-xs bg-white border border-green-200 text-green-700 rounded-md shadow-sm">
                                                            {lang}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-1">Educación</h4>
                                                <p className="text-sm">{analysisResult.education || "No detectada"}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-1">Experiencia Reciente</h4>
                                                <p className="text-sm">{analysisResult.workExperience || "No detectada"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-[var(--text-secondary)] text-sm">
                                        Analiza este CV para obtener habilidades, resumen e insights automáticos.
                                    </div>
                                )}
                            </div>

                            {/* Profile Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bento-card p-4 !bg-white !border-gray-200">
                                    <label className="text-xs text-[var(--text-secondary)] uppercase block mb-1 font-bold text-[10px] tracking-wider">Área</label>
                                    <p className="font-medium capitalize text-[var(--text-primary)]">{selectedApplication.area}</p>
                                </div>
                                <div className="bento-card p-4 !bg-white !border-gray-200">
                                    <label className="text-xs text-[var(--text-secondary)] uppercase block mb-1 font-bold text-[10px] tracking-wider">Experiencia</label>
                                    <p className="font-medium text-[var(--text-primary)]">{selectedApplication.experiencia}</p>
                                </div>
                                <div className="bento-card p-4 !bg-white !border-gray-200">
                                    <label className="text-xs text-[var(--text-secondary)] uppercase block mb-1 font-bold text-[10px] tracking-wider">Disponibilidad</label>
                                    <p className="font-medium text-[var(--text-primary)]">{selectedApplication.disponibilidad}</p>
                                </div>
                            </div>

                            {/* Presentation */}
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                                <label className="text-sm font-bold text-[var(--text-primary)] uppercase block mb-3 pb-2 border-b border-gray-200">
                                    Presentación Personal
                                </label>
                                <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed text-sm">
                                    {selectedApplication.presentacion || "Sin presentación."}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-light)]">
                                {selectedApplication.cvUrl && (
                                    <a
                                        href={selectedApplication.cvUrl}
                                        target="_blank"
                                        download
                                        className="btn bg-[var(--primary)] hover:bg-blue-700 text-white shadow-md flex items-center gap-2 px-6"
                                    >
                                        <span>📄</span> Descargar CV
                                    </a>
                                )}
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="btn border border-gray-300 text-[var(--text-primary)] hover:bg-gray-100"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
