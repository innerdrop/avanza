"use client";

import { useState, useMemo } from 'react';

type AnalysisData = {
    id: number;
    fullName: string | null;
    dni: string | null;
    location: string | null;
    maritalStatus: string | null;
    phone: string | null;
    email: string | null;
    hasPrimaryEducation: boolean;
    hasSecondaryEducation: boolean;
    hasTertiaryEducation: boolean;
    hasUniversityEducation: boolean;
    universityTitle: string | null;
    knowledge: string[];
    skills: string[];
    createdAt: Date;
    application: {
        id: number;
        cvUrl: string | null;
    } | null;
};

export default function DataClient({ data }: { data: AnalysisData[] }) {
    // States for filters
    const [searchTerm, setSearchTerm] = useState("");
    const [educationFilter, setEducationFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [selectedKnowledge, setSelectedKnowledge] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<"name" | "date" | "education">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Modal state
    const [selectedCandidate, setSelectedCandidate] = useState<AnalysisData | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Extract unique values for filter dropdowns
    const uniqueLocations = useMemo(() => {
        const locations = data.map(item => item.location).filter(Boolean) as string[];
        return [...new Set(locations)].sort();
    }, [data]);

    const allKnowledge = useMemo(() => {
        const knowledge = data.flatMap(item => item.knowledge);
        return [...new Set(knowledge)].sort();
    }, [data]);

    const allSkills = useMemo(() => {
        const skills = data.flatMap(item => item.skills);
        return [...new Set(skills)].sort();
    }, [data]);

    // Statistics
    const stats = useMemo(() => {
        const total = data.length;
        const withUniversity = data.filter(d => d.hasUniversityEducation).length;
        const withTertiary = data.filter(d => d.hasTertiaryEducation).length;
        const withSecondary = data.filter(d => d.hasSecondaryEducation).length;

        const locationCounts: Record<string, number> = {};
        data.forEach(d => {
            if (d.location) {
                locationCounts[d.location] = (locationCounts[d.location] || 0) + 1;
            }
        });
        const topLocations = Object.entries(locationCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        return { total, withUniversity, withTertiary, withSecondary, topLocations };
    }, [data]);

    // Filter Logic
    const filteredData = useMemo(() => {
        let result = data.filter(item => {
            // Text search
            const matchesSearch =
                (item.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (item.dni?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (item.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());

            // Education filter
            let matchesEducation = true;
            if (educationFilter === "university") matchesEducation = item.hasUniversityEducation;
            if (educationFilter === "tertiary") matchesEducation = item.hasTertiaryEducation;
            if (educationFilter === "secondary") matchesEducation = item.hasSecondaryEducation;

            // Location filter
            const matchesLocation = locationFilter === "all" || item.location === locationFilter;

            // Knowledge filter
            const matchesKnowledge = selectedKnowledge.length === 0 ||
                selectedKnowledge.some(k => item.knowledge.includes(k));

            // Skills filter
            const matchesSkills = selectedSkills.length === 0 ||
                selectedSkills.some(s => item.skills.includes(s));

            return matchesSearch && matchesEducation && matchesLocation && matchesKnowledge && matchesSkills;
        });

        // Sorting
        result.sort((a, b) => {
            let comparison = 0;
            if (sortBy === "name") {
                comparison = (a.fullName || "").localeCompare(b.fullName || "");
            } else if (sortBy === "date") {
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else if (sortBy === "education") {
                const eduLevel = (item: AnalysisData) =>
                    item.hasUniversityEducation ? 4 :
                        item.hasTertiaryEducation ? 3 :
                            item.hasSecondaryEducation ? 2 :
                                item.hasPrimaryEducation ? 1 : 0;
                comparison = eduLevel(a) - eduLevel(b);
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

        return result;
    }, [data, searchTerm, educationFilter, locationFilter, selectedKnowledge, selectedSkills, sortBy, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Helper functions
    const getEducationLevel = (item: AnalysisData) => {
        if (item.hasUniversityEducation) return { label: "Universitario", color: "bg-purple-100 text-purple-700" };
        if (item.hasTertiaryEducation) return { label: "Terciario", color: "bg-blue-100 text-blue-700" };
        if (item.hasSecondaryEducation) return { label: "Secundario", color: "bg-green-100 text-green-700" };
        if (item.hasPrimaryEducation) return { label: "Primario", color: "bg-gray-100 text-gray-700" };
        return { label: "No especificado", color: "bg-gray-100 text-gray-500" };
    };

    const clearFilters = () => {
        setSearchTerm("");
        setEducationFilter("all");
        setLocationFilter("all");
        setSelectedKnowledge([]);
        setSelectedSkills([]);
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm || educationFilter !== "all" || locationFilter !== "all" ||
        selectedKnowledge.length > 0 || selectedSkills.length > 0;

    const toggleKnowledgeFilter = (knowledge: string) => {
        setSelectedKnowledge(prev =>
            prev.includes(knowledge)
                ? prev.filter(k => k !== knowledge)
                : [...prev, knowledge]
        );
        setCurrentPage(1);
    };

    const toggleSkillFilter = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-blue-100 text-sm font-medium">Total Talentos</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="text-3xl font-bold">{stats.withUniversity}</div>
                    <div className="text-purple-100 text-sm font-medium">Universitarios</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="text-3xl font-bold">{stats.withTertiary}</div>
                    <div className="text-green-100 text-sm font-medium">Terciarios</div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
                    <div className="text-sm font-medium text-gray-500 mb-2">Top Localidades</div>
                    <div className="space-y-1">
                        {stats.topLocations.map(([loc, count]) => (
                            <div key={loc} className="flex justify-between text-sm">
                                <span className="text-gray-700 truncate">{loc}</span>
                                <span className="text-gray-400 ml-2">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-wrap gap-4 items-start">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[250px]">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Buscar</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Nombre, DNI, email..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Education Filter */}
                    <div className="min-w-[160px]">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Nivel Educativo</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            value={educationFilter}
                            onChange={(e) => { setEducationFilter(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="all">Todos</option>
                            <option value="university">Universitario</option>
                            <option value="tertiary">Terciario</option>
                            <option value="secondary">Secundario</option>
                        </select>
                    </div>

                    {/* Location Filter */}
                    <div className="min-w-[180px]">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Localidad</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            value={locationFilter}
                            onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="all">Todas</option>
                            {uniqueLocations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="min-w-[140px]">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Ordenar por</label>
                        <div className="flex gap-1">
                            <select
                                className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "name" | "date" | "education")}
                            >
                                <option value="date">Fecha</option>
                                <option value="name">Nombre</option>
                                <option value="education">Educación</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                                className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                                title={sortOrder === "asc" ? "Ascendente" : "Descendente"}
                            >
                                {sortOrder === "asc" ? "↑" : "↓"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Knowledge & Skills Filters */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Knowledge */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">
                                Filtrar por Conocimientos
                                {selectedKnowledge.length > 0 && (
                                    <span className="ml-2 text-blue-600">({selectedKnowledge.length} seleccionados)</span>
                                )}
                            </label>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-100">
                                {allKnowledge.slice(0, 20).map(k => (
                                    <button
                                        key={k}
                                        onClick={() => toggleKnowledgeFilter(k)}
                                        className={`px-2 py-1 rounded text-xs transition-all ${selectedKnowledge.includes(k)
                                                ? "bg-blue-500 text-white"
                                                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                                            }`}
                                    >
                                        {k}
                                    </button>
                                ))}
                                {allKnowledge.length > 20 && (
                                    <span className="text-xs text-gray-400 px-2 py-1">+{allKnowledge.length - 20} más</span>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">
                                Filtrar por Habilidades
                                {selectedSkills.length > 0 && (
                                    <span className="ml-2 text-purple-600">({selectedSkills.length} seleccionadas)</span>
                                )}
                            </label>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-100">
                                {allSkills.slice(0, 20).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => toggleSkillFilter(s)}
                                        className={`px-2 py-1 rounded text-xs transition-all ${selectedSkills.includes(s)
                                                ? "bg-purple-500 text-white"
                                                : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                                {allSkills.length > 20 && (
                                    <span className="text-xs text-gray-400 px-2 py-1">+{allSkills.length - 20} más</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Filters & Clear */}
                {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs text-gray-500">Filtros activos:</span>
                            {searchTerm && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                                    Búsqueda: &quot;{searchTerm}&quot;
                                    <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">×</button>
                                </span>
                            )}
                            {educationFilter !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                                    Educación: {educationFilter}
                                    <button onClick={() => setEducationFilter("all")} className="text-gray-400 hover:text-gray-600">×</button>
                                </span>
                            )}
                            {locationFilter !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                                    Localidad: {locationFilter}
                                    <button onClick={() => setLocationFilter("all")} className="text-gray-400 hover:text-gray-600">×</button>
                                </span>
                            )}
                            {selectedKnowledge.map(k => (
                                <span key={k} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                    {k}
                                    <button onClick={() => toggleKnowledgeFilter(k)} className="text-blue-400 hover:text-blue-600">×</button>
                                </span>
                            ))}
                            {selectedSkills.map(s => (
                                <span key={s} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                    {s}
                                    <button onClick={() => toggleSkillFilter(s)} className="text-purple-400 hover:text-purple-600">×</button>
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-red-500 hover:text-red-600 font-medium"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}

                {/* Results Count */}
                <div className="mt-3 text-sm text-gray-500">
                    Mostrando <span className="font-semibold text-gray-700">{paginatedData.length}</span> de <span className="font-semibold text-gray-700">{filteredData.length}</span> resultados
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedData.map((item) => {
                    const eduLevel = getEducationLevel(item);
                    return (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all overflow-hidden group"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                            {item.fullName || "Sin nombre"}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {item.location || "Sin ubicación"}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${eduLevel.color}`}>
                                        {eduLevel.label}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-3">
                                {/* University Title */}
                                {item.universityTitle && (
                                    <div className="text-sm">
                                        <span className="text-gray-500">Título:</span>
                                        <p className="text-[var(--accent)] font-medium mt-0.5 line-clamp-2">
                                            {item.universityTitle}
                                        </p>
                                    </div>
                                )}

                                {/* Knowledge Tags */}
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1.5">Conocimientos</span>
                                    <div className="flex flex-wrap gap-1">
                                        {item.knowledge.slice(0, 4).map((k, i) => (
                                            <button
                                                key={i}
                                                onClick={() => toggleKnowledgeFilter(k)}
                                                className={`px-2 py-0.5 rounded text-xs transition-colors ${selectedKnowledge.includes(k)
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100"
                                                    }`}
                                            >
                                                {k}
                                            </button>
                                        ))}
                                        {item.knowledge.length > 4 && (
                                            <span className="px-2 py-0.5 text-xs text-gray-400">
                                                +{item.knowledge.length - 4}
                                            </span>
                                        )}
                                        {item.knowledge.length === 0 && (
                                            <span className="text-xs text-gray-400">Sin datos</span>
                                        )}
                                    </div>
                                </div>

                                {/* Skills Tags */}
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1.5">Habilidades</span>
                                    <div className="flex flex-wrap gap-1">
                                        {item.skills.slice(0, 4).map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => toggleSkillFilter(s)}
                                                className={`px-2 py-0.5 rounded text-xs transition-colors ${selectedSkills.includes(s)
                                                        ? "bg-purple-500 text-white"
                                                        : "bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                        {item.skills.length > 4 && (
                                            <span className="px-2 py-0.5 text-xs text-gray-400">
                                                +{item.skills.length - 4}
                                            </span>
                                        )}
                                        {item.skills.length === 0 && (
                                            <span className="text-xs text-gray-400">Sin datos</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <button
                                    onClick={() => setSelectedCandidate(item)}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Ver perfil completo
                                </button>
                                {item.application?.cvUrl && (
                                    <a
                                        href={item.application.cvUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        CV
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {paginatedData.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No se encontraron talentos</h3>
                    <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Anterior
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
                                        ? "bg-blue-500 text-white"
                                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {/* Modal */}
            {selectedCandidate && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedCandidate(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white rounded-t-2xl">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {selectedCandidate.fullName || "Sin nombre"}
                                    </h2>
                                    <p className="text-blue-100 mt-1 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        {selectedCandidate.location || "Sin ubicación"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedCandidate(null)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEducationLevel(selectedCandidate).color}`}>
                                    {getEducationLevel(selectedCandidate).label}
                                </span>
                                {selectedCandidate.application?.cvUrl && (
                                    <a
                                        href={selectedCandidate.application.cvUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Descargar CV
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Personal Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-gray-500 block">DNI</span>
                                        <span className="font-medium">{selectedCandidate.dni || "-"}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block">Estado Civil</span>
                                        <span className="font-medium">{selectedCandidate.maritalStatus || "-"}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-gray-500 block">Teléfono</span>
                                        <span className="font-medium">{selectedCandidate.phone || "-"}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block">Email</span>
                                        <span className="font-medium text-sm break-all">{selectedCandidate.email || "-"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Education */}
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Educación</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={`px-2 py-1 rounded text-xs ${selectedCandidate.hasPrimaryEducation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                        Primario {selectedCandidate.hasPrimaryEducation ? '✓' : '✗'}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs ${selectedCandidate.hasSecondaryEducation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                        Secundario {selectedCandidate.hasSecondaryEducation ? '✓' : '✗'}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs ${selectedCandidate.hasTertiaryEducation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                        Terciario {selectedCandidate.hasTertiaryEducation ? '✓' : '✗'}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs ${selectedCandidate.hasUniversityEducation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                        Universitario {selectedCandidate.hasUniversityEducation ? '✓' : '✗'}
                                    </span>
                                </div>
                                {selectedCandidate.universityTitle && (
                                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                                        <span className="text-xs text-orange-600 block mb-1">Título</span>
                                        <span className="text-orange-700 font-medium">{selectedCandidate.universityTitle}</span>
                                    </div>
                                )}
                            </div>

                            {/* Knowledge */}
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-gray-900 mb-3">
                                    Conocimientos
                                    <span className="text-gray-400 font-normal ml-2">({selectedCandidate.knowledge.length})</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCandidate.knowledge.length > 0 ? (
                                        selectedCandidate.knowledge.map((k, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                                                {k}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">Sin conocimientos registrados</span>
                                    )}
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-gray-900 mb-3">
                                    Habilidades Inferidas
                                    <span className="text-gray-400 font-normal ml-2">({selectedCandidate.skills.length})</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCandidate.skills.length > 0 ? (
                                        selectedCandidate.skills.map((s, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm border border-purple-100">
                                                {s}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">Sin habilidades registradas</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t rounded-b-2xl flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedCandidate(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cerrar
                            </button>
                            {selectedCandidate.application?.cvUrl && (
                                <a
                                    href={selectedCandidate.application.cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Ver CV Completo
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
