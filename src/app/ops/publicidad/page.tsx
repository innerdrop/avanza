"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

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
    createdAt: string;
}

export default function PublicidadPage() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterLevel, setFilterLevel] = useState<string>("");
    const [filterActive, setFilterActive] = useState<string>("");

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const res = await fetch('/api/admin/advertisements');
            if (res.ok) {
                const data = await res.json();
                setAds(data);
            }
        } catch (error) {
            console.error('Error fetching ads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (id: number, currentState: boolean) => {
        try {
            const res = await fetch(`/api/admin/advertisements/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentState })
            });
            if (res.ok) {
                setAds(ads.map(ad => ad.id === id ? { ...ad, isActive: !currentState } : ad));
            }
        } catch (error) {
            console.error('Error toggling ad:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este anuncio?')) return;
        try {
            const res = await fetch(`/api/admin/advertisements/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAds(ads.filter(ad => ad.id !== id));
            }
        } catch (error) {
            console.error('Error deleting ad:', error);
        }
    };

    const getLevelBadge = (level: number) => {
        switch (level) {
            case 1: return <span className="px-2 py-1 text-xs font-bold bg-purple-100 text-purple-700 rounded-lg">🌟 Premium</span>;
            case 2: return <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-lg">⭐ Destacado</span>;
            case 3: return <span className="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded-lg">📌 Estándar</span>;
            default: return null;
        }
    };

    const getLevelPrice = (level: number) => {
        switch (level) {
            case 1: return '$4.000/día';
            case 2: return '$3.000/día';
            case 3: return '$2.000/día';
            default: return '';
        }
    };

    const filteredAds = ads.filter(ad => {
        if (filterLevel && ad.level !== parseInt(filterLevel)) return false;
        if (filterActive === 'true' && !ad.isActive) return false;
        if (filterActive === 'false' && ad.isActive) return false;
        return true;
    });

    // Stats
    const totalAds = ads.length;
    const activeAds = ads.filter(a => a.isActive).length;
    const totalClicks = ads.reduce((sum, a) => sum + a.clicks, 0);
    const totalImpressions = ads.reduce((sum, a) => sum + a.impressions, 0);
    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Publicidad</h1>
                        <p className="text-[var(--text-secondary)]">Administra los anuncios de la plataforma</p>
                    </div>
                    <Link
                        href="/ops/publicidad/nuevo"
                        className="btn btn-primary flex items-center gap-2"
                    >
                        ➕ Nuevo Anuncio
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <p className="text-2xl font-bold text-gray-800">{totalAds}</p>
                        <p className="text-xs text-gray-500">Total Anuncios</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <p className="text-2xl font-bold text-green-600">{activeAds}</p>
                        <p className="text-xs text-gray-500">Activos</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <p className="text-2xl font-bold text-blue-600">{totalImpressions.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Impresiones</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <p className="text-2xl font-bold text-purple-600">{totalClicks.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Clicks</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <p className="text-2xl font-bold text-amber-600">{ctr}%</p>
                        <p className="text-xs text-gray-500">CTR</p>
                    </div>
                </div>

                {/* Pricing Info */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                    <h3 className="font-bold text-purple-800 mb-2">📊 Niveles de Precios</h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-bold text-xs">Nivel 1</span>
                            <span>Premium (Hero) - <strong>$4.000/día</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold text-xs">Nivel 2</span>
                            <span>Destacado (Middle) - <strong>$3.000/día</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-bold text-xs">Nivel 3</span>
                            <span>Estándar (Sidebar) - <strong>$2.000/día</strong></span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 flex flex-wrap gap-4">
                    <select
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
                    >
                        <option value="">Todos los niveles</option>
                        <option value="1">Premium</option>
                        <option value="2">Destacado</option>
                        <option value="3">Estándar</option>
                    </select>
                    <select
                        value={filterActive}
                        onChange={(e) => setFilterActive(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
                    >
                        <option value="">Todos los estados</option>
                        <option value="true">Activos</option>
                        <option value="false">Inactivos</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Cargando anuncios...</div>
                    ) : filteredAds.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No hay anuncios. <Link href="/ops/publicidad/nuevo" className="text-blue-600 hover:underline">Crear uno</Link>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Anuncio</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Nivel</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Anunciante</th>
                                    <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Clicks</th>
                                    <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Impresiones</th>
                                    <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAds.map((ad) => (
                                    <tr key={ad.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {ad.imageUrl ? (
                                                    <img src={ad.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">📢</div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">{ad.title}</p>
                                                    <p className="text-xs text-gray-500">{ad.position} · {ad.daysContracted} días</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 hidden md:table-cell">{getLevelBadge(ad.level)}</td>
                                        <td className="py-4 px-4 text-sm text-gray-600 hidden lg:table-cell">{ad.advertiserName || '-'}</td>
                                        <td className="py-4 px-4 text-center text-sm font-medium hidden sm:table-cell">{ad.clicks}</td>
                                        <td className="py-4 px-4 text-center text-sm text-gray-500 hidden sm:table-cell">{ad.impressions}</td>
                                        <td className="py-4 px-4 text-center">
                                            <button
                                                onClick={() => handleToggleActive(ad.id, ad.isActive)}
                                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${ad.isActive
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {ad.isActive ? '✓ Activo' : 'Inactivo'}
                                            </button>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/ops/publicidad/${ad.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ad.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                    title="Eliminar"
                                                >
                                                    🗑️
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
        </AdminLayout>
    );
}
