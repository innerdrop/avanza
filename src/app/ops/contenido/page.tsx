"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";

interface CVEntry {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    area: string;
    experiencia: string;
    cvUrl: string;
    createdAt: string;
    jobPosting?: {
        title: string;
        company: string;
    };
}

export default function ContenidoAdmin() {
    const [cvs, setCvs] = useState<CVEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroArea, setFiltroArea] = useState("todos");
    const [filtroExperiencia, setFiltroExperiencia] = useState("todos");

    useEffect(() => {
        const fetchCVs = async () => {
            try {
                const response = await fetch('/api/applications');
                if (response.ok) {
                    const data = await response.json();
                    // Filter only applications with CV
                    const withCV = data.filter((app: any) => app.cvUrl);
                    setCvs(withCV);
                }
            } catch (error) {
                console.error('Error fetching CVs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCVs();
    }, []);

    // Get unique areas for filter
    const uniqueAreas = Array.from(new Set(cvs.map(cv => cv.area).filter(Boolean)));
    const uniqueExperiencias = Array.from(new Set(cvs.map(cv => cv.experiencia).filter(Boolean)));

    // Filter logic
    const filteredCVs = cvs.filter(cv => {
        const matchesSearch = searchTerm === "" ||
            cv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cv.area?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesArea = filtroArea === "todos" || cv.area === filtroArea;
        const matchesExp = filtroExperiencia === "todos" || cv.experiencia === filtroExperiencia;

        return matchesSearch && matchesArea && matchesExp;
    });

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">📁 Biblioteca de CVs</h1>
                    <p className="text-[var(--text-secondary)]">
                        {cvs.length} currículums en la plataforma
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-2 bg-[rgba(42,157,143,0.1)] text-[var(--accent)] rounded-lg text-sm font-medium border border-[var(--accent)]">
                        {filteredCVs.length} resultados
                    </span>
                </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {/* Search */}
                <div className="bento-card p-4 md:col-span-2">
                    <label className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-2 block">🔍 Buscar</label>
                    <input
                        type="text"
                        placeholder="Nombre, email o área..."
                        className="w-full bg-transparent border-none text-[var(--text-primary)] focus:ring-0 p-0 font-medium placeholder:text-[var(--text-secondary)]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Area filter */}
                <div className="bento-card p-4">
                    <label className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-2 block">Área</label>
                    <select
                        className="w-full bg-transparent border-none text-[var(--text-primary)] focus:ring-0 p-0 font-medium"
                        value={filtroArea}
                        onChange={(e) => setFiltroArea(e.target.value)}
                    >
                        <option value="todos">Todas las áreas</option>
                        {uniqueAreas.map(area => (
                            <option key={area} value={area}>{area}</option>
                        ))}
                    </select>
                </div>

                {/* Experience filter */}
                <div className="bento-card p-4">
                    <label className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-2 block">Experiencia</label>
                    <select
                        className="w-full bg-transparent border-none text-[var(--text-primary)] focus:ring-0 p-0 font-medium"
                        value={filtroExperiencia}
                        onChange={(e) => setFiltroExperiencia(e.target.value)}
                    >
                        <option value="todos">Toda la experiencia</option>
                        {uniqueExperiencias.map(exp => (
                            <option key={exp} value={exp}>{exp}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* CV Grid */}
            {loading ? (
                <div className="bento-card p-12 text-center text-[var(--text-secondary)]">
                    Cargando currículums...
                </div>
            ) : filteredCVs.length === 0 ? (
                <div className="bento-card p-12 text-center">
                    <div className="text-5xl mb-4 opacity-50">📄</div>
                    <h3 className="text-xl font-semibold mb-2">No hay CVs que coincidan</h3>
                    <p className="text-[var(--text-secondary)]">
                        {cvs.length === 0 ? "Aún no se han subido currículums a la plataforma." : "Intenta ajustar los filtros de búsqueda."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCVs.map((cv) => (
                        <div key={cv.id} className="bento-card p-5 hover:scale-[1.01] transition-transform">
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-black flex items-center justify-center font-bold text-lg flex-shrink-0">
                                    {cv.nombre.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[var(--text-primary)] truncate">{cv.nombre}</h3>
                                    <p className="text-xs text-[var(--text-secondary)] truncate">{cv.email}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{cv.telefono}</p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-[var(--text-secondary)]">📋 Área:</span>
                                    <span className="text-xs font-medium text-[var(--text-primary)] capitalize">{cv.area || 'No especificada'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-[var(--text-secondary)]">⏱️ Experiencia:</span>
                                    <span className="text-xs font-medium text-[var(--text-primary)]">{cv.experiencia || 'No especificada'}</span>
                                </div>
                                {cv.jobPosting && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-[var(--text-secondary)]">💼 Postulado a:</span>
                                        <span className="text-xs font-medium text-[var(--accent)]">{cv.jobPosting.title}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-[var(--text-secondary)]">📅 Fecha:</span>
                                    <span className="text-xs text-[var(--text-primary)]">{formatDate(cv.createdAt)}</span>
                                </div>
                            </div>

                            {/* Action */}
                            <a
                                href={cv.cvUrl}
                                target="_blank"
                                download
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[rgba(255,215,0,0.1)] text-[var(--primary)] border border-[var(--primary)] rounded-lg hover:bg-[rgba(255,215,0,0.2)] transition-colors text-sm font-medium"
                            >
                                📥 Descargar CV
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
