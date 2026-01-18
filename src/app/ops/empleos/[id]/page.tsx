"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [featuredExpiresAt, setFeaturedExpiresAt] = useState<string | null>(null);
    const [pendingPayment, setPendingPayment] = useState<any>(null);

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
        status: "active"
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        title: data.title || "",
                        company: data.company || "",
                        location: data.location || "",
                        type: data.type || "Full Time",
                        description: data.description || "",
                        requirements: Array.isArray(data.requirements) ? data.requirements.join('\n') : "",
                        responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities.join('\n') : "",
                        benefits: Array.isArray(data.benefits) ? data.benefits.join('\n') : "",
                        salary: data.salary || "",
                        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString().split('T')[0] : "",
                        status: data.status || "active"
                    });
                    setIsFeatured(data.isFeatured);
                    setFeaturedExpiresAt(data.featuredExpiresAt);

                    // Find pending payment
                    if (data.payments && Array.isArray(data.payments)) {
                        const pending = data.payments.find((p: any) => p.status === 'pending');
                        setPendingPayment(pending || null);
                    }

                } else {
                    alert("Error al cargar el empleo");
                    router.push("/ops/empleos");
                }
            } catch (error) {
                console.error("Error fetching job:", error);
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
            requirements: formData.requirements.split('\n').filter(line => line.trim() !== ""),
            responsibilities: formData.responsibilities.split('\n').filter(line => line.trim() !== ""),
            benefits: formData.benefits.split('\n').filter(line => line.trim() !== ""),
            expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
            // Only send isFeatured if user explicitly checked it and it wasn't already true/pending
            // Actually, we can send it always if we want to toggle ON. 
            // If toggling OFF, we send false.
            // If it is true, sending true changes nothing.
            // If it is false, sending true triggers payment creation.
            isFeatured: isFeatured
        };

        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const responseData = await res.json();
                if (responseData.createdPayment) {
                    alert("Se ha generado una orden de pago para la publicación destacada. Por favor confirme el pago para activar el beneficio.");
                    setPendingPayment(responseData.createdPayment);
                    // Reload to reflect state? or just trust state
                    // We need to keep isFeatured false in UI until paid?
                    // The API keeps it false.
                    setIsFeatured(false);
                } else {
                    alert("Empleo actualizado exitosamente");
                }
                // Don't redirect immediately so they can see payment info if generated
                if (!responseData.createdPayment) {
                    router.push("/ops/empleos");
                }
            } else {
                alert("Error al actualizar el empleo");
            }
        } catch (error) {
            console.error("Error updating job:", error);
            alert("Error de conexión");
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmPayment = async () => {
        if (!pendingPayment) return;
        if (!confirm("¿Confirmar que se ha recibido el pago de $" + pendingPayment.amount + "?")) return;

        try {
            const res = await fetch(`/api/payments/${pendingPayment.id}/confirm`, {
                method: 'POST'
            });

            if (res.ok) {
                const data = await res.json();
                alert("Pago confirmado. La publicación ahora es DESTACADA.");
                setIsFeatured(true);
                setFeaturedExpiresAt(data.job.featuredExpiresAt);
                setPendingPayment(null);
            } else {
                alert("Error al confirmar el pago");
            }
        } catch (error) {
            console.error("Error confirming payment:", error);
            alert("Error de conexión");
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">Editar Empleo</h2>
                        <p className="text-[var(--text-secondary)]">Modifica los datos de la oferta laboral</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            className={`px-4 py-2 rounded-lg border focus:outline-none font-medium ${formData.status === 'active'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                            <option value="closed">Cerrado</option>
                        </select>
                    </div>
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

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                                        checked={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.checked)}
                                    // Disable unchecking if it's already paid/active? No, allow disabling.
                                    />
                                    <span className="font-medium text-gray-800">Activar "Publicación Destacada Prioritaria"</span>
                                </label>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 ml-7">
                                Al activar esta opción, el anuncio aparecerá en primera posición y resaltado visualmente.
                                Requiere un pago único de <strong>$50.000</strong> por 30 días de exposición.
                            </p>
                        </div>

                        {pendingPayment && (
                            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-4 animate-pulse">
                                <div>
                                    <p className="font-bold text-blue-800">Orden de Pago Generada #{pendingPayment.id}</p>
                                    <p className="text-sm text-blue-600">Estado: <span className="uppercase font-bold">{pendingPayment.status}</span> - Monto: ${pendingPayment.amount}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleConfirmPayment}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm"
                                >
                                    Confirmar Pago
                                </button>
                            </div>
                        )}

                        {isFeatured && featuredExpiresAt && !pendingPayment && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg inline-block">
                                <p className="text-sm text-green-800 font-medium">
                                    ✅ Destacado Activo hasta el {new Date(featuredExpiresAt).toLocaleDateString()}
                                </p>
                            </div>
                        )}
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
                            disabled={saving}
                            className="btn btn-primary flex-1"
                        >
                            {saving ? "Guardando..." : "Guardar Cambios"}
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
