"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        type: "Full Time",
        description: "",
        requirements: "",
        responsibilities: "",
        benefits: "",
        salary: ""
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/company/jobs/${id}`);
                if (res.status === 401) {
                    router.push('/empresas/login');
                    return;
                }
                if (res.status === 403) {
                    alert("No tienes permiso para editar este empleo");
                    router.push('/empresas/dashboard');
                    return;
                }
                if (res.ok) {
                    const data = await res.json();

                    // Parse JSON arrays if needed
                    let requirements = "";
                    let responsibilities = "";
                    let benefits = "";

                    try {
                        const reqArray = typeof data.requirements === 'string' ? JSON.parse(data.requirements) : data.requirements;
                        requirements = Array.isArray(reqArray) ? reqArray.join('\n') : "";
                    } catch { requirements = ""; }

                    try {
                        const respArray = typeof data.responsibilities === 'string' ? JSON.parse(data.responsibilities) : data.responsibilities;
                        responsibilities = Array.isArray(respArray) ? respArray.join('\n') : "";
                    } catch { responsibilities = ""; }

                    try {
                        const benArray = typeof data.benefits === 'string' ? JSON.parse(data.benefits) : data.benefits;
                        benefits = Array.isArray(benArray) ? benArray.join('\n') : "";
                    } catch { benefits = ""; }

                    setFormData({
                        title: data.title || "",
                        company: data.company || "",
                        location: data.location || "",
                        type: data.type || "Full Time",
                        description: data.description || "",
                        requirements,
                        responsibilities,
                        benefits,
                        salary: data.salary || ""
                    });
                } else {
                    alert("Error al cargar el empleo");
                    router.push("/empresas/dashboard");
                }
            } catch (error) {
                console.error("Error fetching job:", error);
                alert("Error de conexión");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            ...formData,
            requirements: JSON.stringify(formData.requirements.split('\n').filter(line => line.trim() !== "")),
            responsibilities: JSON.stringify(formData.responsibilities.split('\n').filter(line => line.trim() !== "")),
            benefits: JSON.stringify(formData.benefits.split('\n').filter(line => line.trim() !== ""))
        };

        try {
            const res = await fetch(`/api/company/jobs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("Empleo actualizado exitosamente");
                router.push("/empresas/dashboard");
            } else {
                const error = await res.json();
                alert(error.error || "Error al actualizar el empleo");
            }
        } catch (error) {
            console.error("Error updating job:", error);
            alert("Error de conexión");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/empresas/dashboard" className="text-gray-500 hover:text-gray-700">
                            ← Volver
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Editar Empleo</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold mb-6 text-gray-900">Información Básica</h3>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Título del puesto *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ej: Administrativo Contable"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Empresa *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="Nombre de la empresa"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Ubicación *</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                >
                                    <option value="">Selecciona ubicación</option>
                                    <option value="Ushuaia">Ushuaia</option>
                                    <option value="Río Grande">Río Grande</option>
                                    <option value="Tolhuin">Tolhuin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Tipo de contrato *</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Remoto">Remoto</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2 text-gray-600">Salario</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    placeholder="Ej: $800.000 - $1.200.000"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold mb-6 text-gray-900">Detalles del Puesto</h3>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Descripción *</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descripción general del puesto..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Requisitos (uno por línea)</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    placeholder="Título universitario&#10;Experiencia 2+ años&#10;Excel avanzado"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Responsabilidades (uno por línea)</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                    value={formData.responsibilities}
                                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                                    placeholder="Gestión de equipos&#10;Control de KPIs&#10;Reportes mensuales"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-600">Beneficios (uno por línea)</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                    value={formData.benefits}
                                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                    placeholder="Obra social&#10;Seguro de vida&#10;Bonos por desempeño"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info box */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Nota:</strong> Los cambios en tu anuncio serán revisados por nuestro equipo. Si el empleo ya está aprobado, los cambios se reflejarán automáticamente.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                        >
                            {saving ? "Guardando..." : "Guardar Cambios"}
                        </button>
                        <Link
                            href="/empresas/dashboard"
                            className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-center"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    );
}
