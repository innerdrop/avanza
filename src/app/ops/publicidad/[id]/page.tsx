"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface Advertisement {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
    linkUrl: string | null;
    level: number;
    position: string;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    daysContracted: number;
    pricePerDay: number;
    totalPrice: number | null;
    clicks: number;
    impressions: number;
    advertiserName: string | null;
    advertiserEmail: string | null;
    advertiserPhone: string | null;
    notes: string | null;
}

export default function EditarAnuncioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [ad, setAd] = useState<Advertisement | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        level: 3,
        position: 'sidebar',
        daysContracted: 7,
        isActive: true,
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

    useEffect(() => {
        fetchAd();
    }, [id]);

    const fetchAd = async () => {
        try {
            const res = await fetch(`/api/admin/advertisements/${id}`);
            if (res.ok) {
                const data = await res.json();
                setAd(data);
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    imageUrl: data.imageUrl || '',
                    linkUrl: data.linkUrl || '',
                    level: data.level,
                    position: data.position,
                    daysContracted: data.daysContracted,
                    isActive: data.isActive,
                    advertiserName: data.advertiserName || '',
                    advertiserEmail: data.advertiserEmail || '',
                    advertiserPhone: data.advertiserPhone || '',
                    notes: data.notes || ''
                });
            } else {
                setError('Anuncio no encontrado');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

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
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/advertisements/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/ops/publicidad');
            } else {
                const data = await res.json();
                setError(data.error || 'Error al actualizar anuncio');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-8 text-center text-gray-500">Cargando anuncio...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/ops/publicidad" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
                        ← Volver a Publicidad
                    </Link>
                    <h1 className="text-3xl font-bold">Editar Anuncio</h1>
                    <p className="text-gray-500">ID: {id}</p>
                </div>

                {/* Stats */}
                {ad && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-blue-600">{ad.impressions.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Impresiones</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-600">{ad.clicks.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Clicks</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">
                                    {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0'}%
                                </p>
                                <p className="text-xs text-gray-500">CTR</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Active Toggle */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                        <div>
                            <p className="font-medium">Estado del Anuncio</p>
                            <p className="text-sm text-gray-500">Activa o desactiva la visualización</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            {formData.isActive ? '✓ Activo' : 'Inactivo'}
                        </button>
                    </div>

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
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
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
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Destino</label>
                                <input
                                    type="url"
                                    value={formData.linkUrl}
                                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Image Preview */}
                        {formData.imageUrl && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="max-w-full h-auto max-h-48 rounded-lg border"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}
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
                            disabled={saving}
                            className="flex-1 py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
