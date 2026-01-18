"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoAnuncioPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        location: 'Ushuaia',
        type: 'Full Time',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        salary: '',
        isFeatured: false,
        featuredDays: 7
    });

    const PRICE_PER_DAY = 2500;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Convert multiline text to JSON arrays
            const reqArray = formData.requirements.split('\n').filter(r => r.trim());
            const respArray = formData.responsibilities.split('\n').filter(r => r.trim());
            const benArray = formData.benefits.split('\n').filter(r => r.trim());

            const res = await fetch('/api/company/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    requirements: JSON.stringify(reqArray),
                    responsibilities: JSON.stringify(respArray),
                    benefits: JSON.stringify(benArray)
                })
            });

            if (res.status === 401) {
                router.push('/empresas/login');
                return;
            }

            const data = await res.json();

            if (res.ok) {
                if (data.createdPayment) {
                    // Featured job requested - show payment info
                    alert("¡Tu anuncio fue enviado! Se ha generado una orden de pago para la Publicación Destacada. Ve a tu dashboard para ver los datos de transferencia.");
                }
                router.push('/empresas/dashboard?created=true');
            } else {
                setError(data.error || 'Error al crear el anuncio');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Publicar Nuevo Empleo</h1>
                    <p className="text-gray-600 mt-1">Completa los datos de la oferta laboral</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Título del Puesto *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Ej: Desarrollador Frontend"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Ubicación *
                                </label>
                                <select
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                                >
                                    <option value="Ushuaia">Ushuaia</option>
                                    <option value="Río Grande">Río Grande</option>
                                    <option value="Tolhuin">Tolhuin</option>
                                    <option value="Remoto">Remoto</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Tipo de Empleo *
                                </label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                                >
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Remoto">Remoto</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Salario
                                </label>
                                <input
                                    type="text"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Ej: $150.000 - $200.000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Descripción del Puesto *
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                placeholder="Describe las principales funciones y el perfil buscado..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Requisitos (uno por línea)
                            </label>
                            <textarea
                                rows={3}
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                placeholder="Ej: 3 años de experiencia&#10;Título universitario&#10;Inglés intermedio"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Responsabilidades (una por línea)
                            </label>
                            <textarea
                                rows={3}
                                value={formData.responsibilities}
                                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                placeholder="Ej: Desarrollar nuevas funcionalidades&#10;Mantener código existente&#10;Participar en reuniones de equipo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Beneficios (uno por línea)
                            </label>
                            <textarea
                                rows={3}
                                value={formData.benefits}
                                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                placeholder="Ej: Obra social&#10;Horario flexible&#10;Home office"
                            />
                        </div>

                        {/* Featured Option */}
                        <div className={`border rounded-xl p-5 transition-all ${formData.isFeatured ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                            <label className="flex items-start gap-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="mt-1 w-5 h-5 rounded border-yellow-300 text-yellow-500 focus:ring-yellow-500"
                                />
                                <div className="flex-1">
                                    <span className="font-semibold text-yellow-800 flex items-center gap-2">
                                        ⭐ Publicación Destacada
                                    </span>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Tu anuncio aparecerá en las primeras posiciones con mayor visibilidad.
                                    </p>
                                </div>
                            </label>

                            {/* Days selector - only visible when featured is checked */}
                            {formData.isFeatured && (
                                <div className="mt-4 pt-4 border-t border-yellow-200">
                                    <label className="block text-sm font-medium text-yellow-800 mb-2">
                                        ¿Cuántos días deseas destacar tu publicación?
                                    </label>
                                    <select
                                        value={formData.featuredDays}
                                        onChange={(e) => setFormData({ ...formData, featuredDays: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-yellow-300 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-gray-800"
                                    >
                                        <option value={7}>7 días</option>
                                        <option value={15}>15 días</option>
                                        <option value={30}>30 días</option>
                                        <option value={45}>45 días</option>
                                        <option value={60}>60 días</option>
                                    </select>
                                    <div className="mt-3 p-3 bg-amber-100 rounded-lg border border-amber-200">
                                        <p className="text-sm text-amber-800">
                                            <span className="font-bold">Precio:</span> {formData.featuredDays} días × $2.500 = <span className="font-bold text-lg">${(formData.featuredDays * PRICE_PER_DAY).toLocaleString('es-AR')}</span>
                                        </p>
                                        <p className="text-xs text-amber-600 mt-1">
                                            Se generará una orden de pago que podrás ver en tu dashboard.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link
                                href="/empresas/dashboard"
                                className="flex-1 py-3 px-4 text-center text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Enviando...' : 'Enviar para Revisión'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
