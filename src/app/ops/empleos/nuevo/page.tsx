"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoEmpleoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [isFeatured, setIsFeatured] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        type: "Full Time",
        description: "",
        requirements: "",
        responsibilities: "",
        benefits: "",
        salary: "",
        expiresAt: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, isFeatured }),
            });

            if (response.ok) {
                const data = await response.json();
                if (isFeatured) {
                    alert("Empleo creado. Se ha generado una orden de pago pendiente para la publicación destacada. Vaya a 'Editar' para confirmar el pago.");
                } else {
                    alert("Empleo creado exitosamente");
                }
                router.push("/ops/empleos");
            } else {
                const errorData = await response.json();
                alert(`Error al crear empleo: ${errorData.error || 'Desconocido'}`);
            }
        } catch (error) {
            console.error("Error creating job:", error);
            alert("Error de conexión al crear empleo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Crear Nuevo Empleo</h2>
                    <p className="text-[var(--text-secondary)]">Completa los datos de la oferta laboral</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sección Destacado */}
                    <div className="bento-card bg-white shadow-sm border border-[var(--border-light)] p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)] flex items-center gap-2">
                            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            Publicación Destacada Prioritaria
                        </h3>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                                        checked={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.checked)}
                                    />
                                    <span className="font-medium text-gray-800">Activar "Publicación Destacada Prioritaria"</span>
                                </label>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 ml-7">
                                Al activar esta opción, el anuncio aparecerá en primera posición y resaltado visualmente.
                                Requiere un pago único de <strong>$50.000</strong> por 30 días de exposición.
                            </p>
                        </div>
                    </div>

                    <div className="bento-card bg-white shadow-sm border border-[var(--border-light)] p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Información Básica</h3>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Título del puesto *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ej: Administrativo Contable"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Empresa *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="Nombre de la empresa"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Ubicación *</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
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
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Tipo de contrato *</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Remoto">Remoto</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Salario</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    placeholder="Ej: $800.000 - $1.200.000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Fecha de vencimiento</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bento-card bg-white shadow-sm border border-[var(--border-light)] p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Detalles del Puesto</h3>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Descripción *</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descripción general del puesto..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Requisitos (uno por línea)</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    placeholder="Título universitario&#10;Experiencia 2+ años&#10;Excel avanzado"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Responsabilidades (uno por línea)</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                    value={formData.responsibilities}
                                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                                    placeholder="Gestión de equipos&#10;Control de KPIs&#10;Reportes mensuales"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Beneficios (uno por línea)</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                    value={formData.benefits}
                                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                    placeholder="Obra social&#10;Seguro de vida&#10;Bonos por desempeño"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex-1"
                        >
                            {loading ? "Creando..." : "Crear Empleo"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn btn-glass px-8"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
