"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoAnuncioPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        level: 3,
        position: 'sidebar',
        daysContracted: 7,
        advertiserName: '',
        advertiserEmail: '',
        advertiserPhone: '',
        notes: ''
    });

    const levelOptions = [
        { value: 1, label: 'Premium (Hero)', price: 4000, position: 'hero' },
        { value: 2, label: 'Destacado (Middle)', price: 3000, position: 'middle' },
        { value: 3, label: 'Estándar (Sidebar)', price: 2000, position: 'sidebar' }
    ];

    const handleLevelChange = (level: number) => {
        const selected = levelOptions.find(l => l.value === level);
        setFormData({
            ...formData,
            level,
            position: selected?.position || 'sidebar'
        });
    };

    const calculateTotal = () => {
        const selected = levelOptions.find(l => l.value === formData.level);
        return (selected?.price || 2000) * formData.daysContracted;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/advertisements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/ops/publicidad');
            } else {
                const data = await res.json();
                setError(data.error || 'Error al crear anuncio');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/ops/publicidad" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
                        ← Volver a Publicidad
                    </Link>
                    <h1 className="text-3xl font-bold">Nuevo Anuncio</h1>
                    <p className="text-gray-500">Crear un nuevo anuncio publicitario</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
                        <h2 className="font-bold text-lg border-b pb-2">📢 Información del Anuncio</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ej: Promoción Especial"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                placeholder="Breve descripción del anuncio"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Destino</label>
                                <input
                                    type="url"
                                    value={formData.linkUrl}
                                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Level Selection */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
                        <h2 className="font-bold text-lg border-b pb-2">💰 Nivel y Precio</h2>

                        <div className="grid md:grid-cols-3 gap-4">
                            {levelOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleLevelChange(option.value)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${formData.level === option.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <p className="font-bold">{option.label}</p>
                                    <p className="text-lg text-blue-600 font-bold">${option.price.toLocaleString()}/día</p>
                                    <p className="text-xs text-gray-500">Posición: {option.position}</p>
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Días Contratados</label>
                            <select
                                value={formData.daysContracted}
                                onChange={(e) => setFormData({ ...formData, daysContracted: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={7}>7 días</option>
                                <option value={15}>15 días</option>
                                <option value={30}>30 días</option>
                                <option value={45}>45 días</option>
                                <option value={60}>60 días</option>
                                <option value={90}>90 días</option>
                            </select>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                            <p className="text-sm text-green-700">Total a cobrar:</p>
                            <p className="text-3xl font-bold text-green-700">${calculateTotal().toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Advertiser Info */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
                        <h2 className="font-bold text-lg border-b pb-2">🏢 Datos del Anunciante</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Empresa</label>
                                <input
                                    type="text"
                                    value={formData.advertiserName}
                                    onChange={(e) => setFormData({ ...formData, advertiserName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.advertiserEmail}
                                    onChange={(e) => setFormData({ ...formData, advertiserEmail: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input
                                type="tel"
                                value={formData.advertiserPhone}
                                onChange={(e) => setFormData({ ...formData, advertiserPhone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas internas</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={2}
                                placeholder="Notas para uso interno"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link
                            href="/ops/publicidad"
                            className="flex-1 py-3 px-4 text-center text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creando...' : 'Crear Anuncio'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
