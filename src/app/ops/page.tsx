import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const totalEmpleos = await prisma.jobPosting.count();
    const empleosActivos = await prisma.jobPosting.count({
        where: { status: 'active' }
    });
    const totalPostulaciones = await prisma.application.count();
    const postulacionesPendientes = await prisma.application.count({
        where: { status: 'pending' }
    });

    const stats = {
        totalEmpleos,
        empleosActivos,
        totalPostulaciones,
        postulacionesPendientes,
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
                    <p className="text-[var(--text-secondary)]">Vista general de la plataforma</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                    <div className="bento-card">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">💼</span>
                            <span className="text-xs text-[var(--text-secondary)]">Total</span>
                        </div>
                        <p className="text-3xl font-bold mb-1">{stats.totalEmpleos}</p>
                        <p className="text-sm text-[var(--text-secondary)]">Empleos publicados</p>
                    </div>

                    <div className="bento-card">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">✅</span>
                            <span className="text-xs text-[var(--text-secondary)]">Activos</span>
                        </div>
                        <p className="text-3xl font-bold mb-1 text-[var(--primary)]">{stats.empleosActivos}</p>
                        <p className="text-sm text-[var(--text-secondary)]">Empleos activos</p>
                    </div>

                    <div className="bento-card">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">📋</span>
                            <span className="text-xs text-[var(--text-secondary)]">Total</span>
                        </div>
                        <p className="text-3xl font-bold mb-1">{stats.totalPostulaciones}</p>
                        <p className="text-sm text-[var(--text-secondary)]">Postulaciones</p>
                    </div>

                    <div className="bento-card">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">⏳</span>
                            <span className="text-xs text-[var(--text-secondary)]">Pendientes</span>
                        </div>
                        <p className="text-3xl font-bold mb-1 text-[var(--accent)]">{stats.postulacionesPendientes}</p>
                        <p className="text-sm text-[var(--text-secondary)]">Por revisar</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bento-card">
                    <h3 className="text-xl font-bold mb-4">Acciones rápidas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/ops/empleos/nuevo"
                            className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors group flex flex-col items-center text-center py-6"
                        >
                            <div className="text-3xl mb-3">➕</div>
                            <p className="font-medium text-yellow-800">Crear nuevo empleo</p>
                        </Link>

                        <Link
                            href="/ops/postulaciones"
                            className="p-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors group flex flex-col items-center text-center py-6"
                        >
                            <div className="text-3xl mb-3">👀</div>
                            <p className="font-medium text-blue-800">Ver postulaciones</p>
                        </Link>

                        <Link
                            href="/ops/empleos"
                            className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors group flex flex-col items-center text-center py-6"
                        >
                            <div className="text-3xl mb-3">📝</div>
                            <p className="font-medium text-gray-800">Gestionar empleos</p>
                        </Link>

                        <Link
                            href="/ops/data"
                            className="p-4 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors group flex flex-col items-center text-center py-6"
                        >
                            <div className="text-3xl mb-3">📊</div>
                            <p className="font-medium text-purple-800">DATA (Análisis IA)</p>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
