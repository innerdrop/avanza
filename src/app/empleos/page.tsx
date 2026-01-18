"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import JobShareButton from "@/components/jobs/JobShareButton";

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    salary: string;
    posted: string;
    isFeatured: boolean;
}

export default function EmpleosPage() {
    const [filtroActivo, setFiltroActivo] = useState("todos");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('/api/jobs');
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Filtrar empleos
    const empleosFiltrados = jobs.filter(job => {
        if (filtroActivo === "todos") return true;
        if (filtroActivo === "full-time") return job.type === "Full Time";
        if (filtroActivo === "remoto") return job.type === "Remoto";
        if (filtroActivo === "ushuaia") return job.location.includes("Ushuaia");
        if (filtroActivo === "rio-grande") return job.location.includes("Río Grande");
        return true;
    });

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container max-w-5xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-5xl font-bold mb-4 text-[var(--text-primary)]">
                        Oportunidades <span className="text-[var(--primary)]">Laborales</span>
                    </h1>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Encuentra tu próximo desafío profesional en Tierra del Fuego
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-10">
                    <button
                        onClick={() => setFiltroActivo("todos")}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${filtroActivo === "todos"
                            ? "bg-[var(--primary)] text-white font-medium"
                            : "bg-white border border-[var(--border-light)] hover:border-[var(--primary)] text-[var(--text-secondary)]"
                            }`}
                    >
                        Todos ({jobs.length})
                    </button>
                    <button
                        onClick={() => setFiltroActivo("full-time")}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${filtroActivo === "full-time"
                            ? "bg-[var(--primary)] text-white font-medium"
                            : "bg-white border border-[var(--border-light)] hover:border-[var(--primary)] text-[var(--text-secondary)]"
                            }`}
                    >
                        Full Time
                    </button>
                    <button
                        onClick={() => setFiltroActivo("remoto")}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${filtroActivo === "remoto"
                            ? "bg-[var(--primary)] text-white font-medium"
                            : "bg-white border border-[var(--border-light)] hover:border-[var(--primary)] text-[var(--text-secondary)]"
                            }`}
                    >
                        Remoto
                    </button>
                    <button
                        onClick={() => setFiltroActivo("ushuaia")}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${filtroActivo === "ushuaia"
                            ? "bg-[var(--primary)] text-white font-medium"
                            : "bg-white border border-[var(--border-light)] hover:border-[var(--primary)] text-[var(--text-secondary)]"
                            }`}
                    >
                        Ushuaia
                    </button>
                    <button
                        onClick={() => setFiltroActivo("rio-grande")}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${filtroActivo === "rio-grande"
                            ? "bg-[var(--primary)] text-white font-medium"
                            : "bg-white border border-[var(--border-light)] hover:border-[var(--primary)] text-[var(--text-secondary)]"
                            }`}
                    >
                        Río Grande
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
                        <p className="text-[var(--text-secondary)]">Cargando empleos...</p>
                    </div>
                )}

                {/* Job Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {!loading && empleosFiltrados.map((job) => (
                        <div key={job.id}
                            style={job.isFeatured ? {
                                border: '4px solid #FACC15', // yellow-400 - Thicker border
                                boxShadow: '0 0 20px rgba(250, 204, 21, 0.3)'
                            } : {}}
                            className={`bento-card group shadow-sm hover:shadow-md border relative overflow-hidden transition-all
                             ${job.isFeatured
                                    ? 'bg-gradient-to-r from-yellow-50/80 to-white'
                                    : 'bg-white border-gray-100'
                                }`}>

                            {job.isFeatured && (
                                <div className="absolute top-0 right-0 z-10">
                                    <span className="bg-yellow-400 text-yellow-900 text-sm tracking-wider font-bold px-6 py-2 rounded-bl-3xl shadow-md flex items-center gap-1">
                                        <span className="text-base">★</span> DESTACADO
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3 relative z-0">
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                        <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                                            {job.title}
                                        </h3>
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-[var(--primary)] border border-blue-100 w-fit">
                                            {job.type}
                                        </span>
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-sm mb-1">
                                        {job.company} · {job.location}
                                    </p>
                                    <p className="text-xs text-[var(--text-secondary)]">{job.posted}</p>
                                </div>
                            </div>

                            <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-4 leading-relaxed line-clamp-2">
                                {job.description}
                            </p>

                            <div className="mb-4">
                                <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Requisitos:</p>
                                <div className="flex flex-wrap gap-2">
                                    {job.requirements.slice(0, 3).map((req, idx) => (
                                        <span key={idx} className="px-3 py-1 text-xs rounded-full bg-gray-50 text-[var(--text-secondary)] border border-gray-100">
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-end justify-between gap-4 mt-auto">
                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                    <Link
                                        href={`/cargar-cv?jobId=${job.id}&jobTitle=${encodeURIComponent(job.title)}`}
                                        className="btn btn-primary bg-[var(--success)] hover:bg-green-600 text-white text-sm px-6 w-full sm:w-auto justify-center shadow-md hover:shadow-lg border-none"
                                    >
                                        Postularme
                                    </Link>
                                    <button
                                        onClick={() => setSelectedJob(job)}
                                        className="btn btn-glass text-[var(--primary)] border-[var(--primary)] hover:bg-blue-50 text-sm px-6 w-full sm:w-auto justify-center"
                                    >
                                        Ver más
                                    </button>
                                </div>
                                <p className="text-sm font-bold text-[var(--success)] whitespace-nowrap mb-2 sm:mb-0">
                                    {job.salary}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {!loading && empleosFiltrados.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">No hay resultados</h3>
                        <p className="text-[var(--text-secondary)] mb-6">
                            No encontramos empleos con ese filtro
                        </p>
                        <button
                            onClick={() => setFiltroActivo("todos")}
                            className="btn btn-primary"
                        >
                            Ver todos los empleos
                        </button>
                    </div>
                )}
            </div>
            {/* Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => {
                    if (e.target === e.currentTarget) setSelectedJob(null);
                }}>
                    <div className="bg-white border border-[var(--border-light)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-[var(--border-light)] flex justify-between items-start sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{selectedJob.title}</h2>
                                <p className="text-[var(--text-secondary)]">{selectedJob.company}</p>
                            </div>
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-[var(--primary)] border border-blue-100">
                                    {selectedJob.type}
                                </span>
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-50 text-[var(--text-secondary)] border border-gray-100">
                                    {selectedJob.location}
                                </span>
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-50 text-green-600 border border-green-100">
                                    {selectedJob.salary}
                                </span>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">Descripción del Puesto</h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                                    {selectedJob.description}
                                </p>
                            </div>

                            {/* Requirements */}
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">Requisitos</h3>
                                <ul className="space-y-2">
                                    {selectedJob.requirements.map((req, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-[var(--text-secondary)]">
                                            <span className="text-[var(--primary)] mt-1">•</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Posted Date */}
                            <div className="text-sm text-[var(--text-secondary)] pt-4 border-t border-[var(--border-light)]">
                                Publicado: {selectedJob.posted}
                            </div>
                        </div>

                        <div className="p-6 border-t border-[var(--border-light)] flex gap-3 sticky bottom-0 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                            <Link
                                href={`/cargar-cv?jobId=${selectedJob.id}&jobTitle=${encodeURIComponent(selectedJob.title)}`}
                                className="btn btn-primary bg-[var(--success)] hover:bg-green-600 text-white flex-1 justify-center text-center shadow-lg border-none"
                            >
                                Postularme Ahora
                            </Link>
                            <JobShareButton
                                jobId={selectedJob.id}
                                jobTitle={selectedJob.title}
                                jobCompany={selectedJob.company}
                                className="btn btn-glass text-[var(--primary)] border-[var(--primary)] px-6"
                            >
                                Compartir
                            </JobShareButton>
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="btn btn-glass text-[var(--text-primary)] hover:bg-gray-100"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
