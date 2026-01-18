"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";

type TabType = 'featured' | 'premium';

export default function PagosPage() {
    const [activeTab, setActiveTab] = useState<TabType>('featured');
    const [payments, setPayments] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState("todos");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch featured payments
            const paymentsRes = await fetch('/api/admin/payments');
            if (paymentsRes.ok) {
                const paymentsData = await paymentsRes.json();
                setPayments(paymentsData);
            }

            // Fetch premium subscriptions
            const subsRes = await fetch('/api/admin/subscriptions');
            if (subsRes.ok) {
                const subsData = await subsRes.json();
                setSubscriptions(subsData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = async (paymentId: number, amount: number) => {
        if (!confirm(`¿Confirmar que se ha recibido el pago de $${amount.toLocaleString('es-AR')}?`)) return;

        try {
            const res = await fetch(`/api/payments/${paymentId}/confirm`, {
                method: 'POST'
            });

            if (res.ok) {
                alert("Pago confirmado exitosamente. La publicación ahora es destacada.");
                fetchData();
            } else {
                alert("Error al confirmar el pago");
            }
        } catch (error) {
            console.error("Error confirming payment:", error);
            alert("Error de conexión");
        }
    };

    const handleConfirmSubscription = async (subscriptionId: number, companyName: string) => {
        if (!confirm(`¿Confirmar el pago de suscripción Premium para "${companyName}"? Esto activará las funciones de IA para esta empresa.`)) return;

        try {
            const res = await fetch(`/api/admin/subscriptions/${subscriptionId}/confirm`, {
                method: 'POST'
            });

            if (res.ok) {
                alert("¡Suscripción Premium activada exitosamente!");
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || "Error al confirmar la suscripción");
            }
        } catch (error) {
            console.error("Error confirming subscription:", error);
            alert("Error de conexión");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-bold">⏳ Pendiente</span>;
            case 'completed':
                return <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold">✓ Completado</span>;
            case 'cancelled':
                return <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 border border-red-200 font-bold">✕ Cancelado</span>;
            default:
                return <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200 font-bold">{status}</span>;
        }
    };

    const filteredPayments = payments.filter(p => {
        if (filtroEstado === "todos") return true;
        return p.status === filtroEstado;
    });

    const filteredSubscriptions = subscriptions.filter(s => {
        if (filtroEstado === "todos") return true;
        return s.status === filtroEstado;
    });

    const stats = {
        totalPayments: payments.length,
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        totalSubscriptions: subscriptions.length,
        pendingSubscriptions: subscriptions.filter(s => s.status === 'pending').length,
        activeSubscriptions: subscriptions.filter(s => s.status === 'completed').length,
        totalRevenue: [
            ...payments.filter(p => p.status === 'completed'),
            ...subscriptions.filter(s => s.status === 'completed')
        ].reduce((sum, p) => sum + (p.amount || 0), 0)
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
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">💳 Gestión de Pagos</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Administra pagos de destacados y suscripciones Premium</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] p-5 shadow-sm">
                        <p className="text-xs text-[var(--text-secondary)] uppercase font-semibold mb-1">Pagos Destacados</p>
                        <p className="text-3xl font-bold text-[var(--text-primary)]">{stats.totalPayments}</p>
                        <p className="text-xs text-amber-600">{stats.pendingPayments} pendientes</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-5 shadow-sm">
                        <p className="text-xs text-amber-600 uppercase font-semibold mb-1">👑 Suscripciones Premium</p>
                        <p className="text-3xl font-bold text-amber-700">{stats.totalSubscriptions}</p>
                        <p className="text-xs text-amber-600">{stats.pendingSubscriptions} pendientes</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5 shadow-sm">
                        <p className="text-xs text-emerald-600 uppercase font-semibold mb-1">Premium Activas</p>
                        <p className="text-3xl font-bold text-emerald-700">{stats.activeSubscriptions}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm">
                        <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Ingresos Totales</p>
                        <p className="text-2xl font-bold text-blue-700">${stats.totalRevenue.toLocaleString('es-AR')}</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('featured')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'featured'
                                ? 'bg-slate-800 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        ⭐ Destacados ({payments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('premium')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'premium'
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                                : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
                            }`}
                    >
                        👑 Premium ({subscriptions.length})
                        {stats.pendingSubscriptions > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-500 text-white animate-pulse">
                                {stats.pendingSubscriptions}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 items-center">
                    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] px-4 py-2">
                        <select
                            className="bg-transparent text-[var(--text-primary)] focus:outline-none font-medium"
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="pending">Pendientes</option>
                            <option value="completed">Completados</option>
                            <option value="cancelled">Cancelados</option>
                        </select>
                    </div>
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                        🔄 Actualizar
                    </button>
                </div>

                {/* Featured Payments Tab */}
                {activeTab === 'featured' && (
                    <>
                        {filteredPayments.length === 0 ? (
                            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-12 text-center">
                                <div className="text-5xl mb-4 opacity-50">⭐</div>
                                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No hay pagos de destacados</h3>
                                <p className="text-[var(--text-secondary)]">Los pagos aparecerán aquí cuando las empresas soliciten publicaciones destacadas.</p>
                            </div>
                        ) : (
                            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b border-[var(--border-light)] bg-[var(--bg-main)]">
                                            <tr className="text-left text-xs text-[var(--text-secondary)] uppercase">
                                                <th className="py-4 px-4 font-semibold">ID</th>
                                                <th className="py-4 px-4 font-semibold">Empresa</th>
                                                <th className="py-4 px-4 font-semibold">Empleo</th>
                                                <th className="py-4 px-4 font-semibold">Monto</th>
                                                <th className="py-4 px-4 font-semibold">Estado</th>
                                                <th className="py-4 px-4 font-semibold">Fecha</th>
                                                <th className="py-4 px-4 font-semibold">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border-light)]">
                                            {filteredPayments.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                                                    <td className="py-4 px-4">
                                                        <span className="font-mono text-sm text-[var(--text-secondary)]">#{payment.id}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="font-semibold text-[var(--text-primary)]">
                                                            {payment.jobPosting?.companyUser?.name || payment.jobPosting?.company || 'N/A'}
                                                        </p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="text-sm text-[var(--text-primary)]">{payment.jobPosting?.title || 'N/A'}</p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="font-bold text-[var(--text-primary)] text-lg">
                                                            ${payment.amount?.toLocaleString('es-AR')}
                                                        </p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {getStatusBadge(payment.status)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="text-sm text-[var(--text-secondary)]">
                                                            {new Date(payment.createdAt).toLocaleDateString('es-AR')}
                                                        </p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {payment.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleConfirmPayment(payment.id, payment.amount)}
                                                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
                                                            >
                                                                ✓ Confirmar Pago
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Premium Subscriptions Tab */}
                {activeTab === 'premium' && (
                    <>
                        {filteredSubscriptions.length === 0 ? (
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 p-12 text-center">
                                <div className="text-5xl mb-4">👑</div>
                                <h3 className="text-xl font-semibold text-amber-800 mb-2">No hay suscripciones Premium</h3>
                                <p className="text-amber-600">Las solicitudes de suscripción Premium aparecerán aquí.</p>
                            </div>
                        ) : (
                            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
                                            <tr className="text-left text-xs text-amber-700 uppercase">
                                                <th className="py-4 px-4 font-semibold">ID</th>
                                                <th className="py-4 px-4 font-semibold">Empresa</th>
                                                <th className="py-4 px-4 font-semibold">Email</th>
                                                <th className="py-4 px-4 font-semibold">Monto</th>
                                                <th className="py-4 px-4 font-semibold">Estado</th>
                                                <th className="py-4 px-4 font-semibold">Fecha Solicitud</th>
                                                <th className="py-4 px-4 font-semibold">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border-light)]">
                                            {filteredSubscriptions.map((sub) => (
                                                <tr key={sub.id} className="hover:bg-amber-50/50 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <span className="font-mono text-sm text-[var(--text-secondary)]">#{sub.id}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-[var(--text-primary)]">
                                                                {sub.user?.name || 'Sin nombre'}
                                                            </p>
                                                            {sub.status === 'completed' && (
                                                                <span className="text-amber-500">👑</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="text-sm text-[var(--text-secondary)]">{sub.user?.email}</p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="font-bold text-amber-700 text-lg">
                                                            ${sub.amount?.toLocaleString('es-AR')}
                                                        </p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {getStatusBadge(sub.status)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="text-sm text-[var(--text-secondary)]">
                                                            {new Date(sub.createdAt).toLocaleDateString('es-AR')}
                                                        </p>
                                                        {sub.confirmedAt && (
                                                            <p className="text-xs text-emerald-600">
                                                                Confirmado: {new Date(sub.confirmedAt).toLocaleDateString('es-AR')}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {sub.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleConfirmSubscription(sub.id, sub.user?.name || 'esta empresa')}
                                                                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium rounded-lg text-sm transition-all shadow-md"
                                                            >
                                                                ✓ Confirmar Transferencia
                                                            </button>
                                                        )}
                                                        {sub.status === 'completed' && (
                                                            <span className="text-emerald-600 font-medium text-sm flex items-center gap-1">
                                                                ✓ Premium Activo
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <span>💡</span> Información
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1.5">
                        <li>• <strong>Destacados:</strong> Pagos para publicaciones destacadas (aparecen primero en búsquedas).</li>
                        <li>• <strong>Premium:</strong> Suscripciones que habilitan funciones de IA (análisis de CV y búsqueda de talento).</li>
                        <li>• Al confirmar un pago Premium, la empresa obtiene acceso inmediato a las funciones de IA.</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
