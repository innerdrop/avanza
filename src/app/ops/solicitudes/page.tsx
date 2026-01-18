"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";

export default function SolicitudesPendientesPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/admin/job-requests');
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (jobId: number, action: 'approve' | 'reject') => {
        setProcessingId(jobId);
        try {
            const res = await fetch('/api/admin/job-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId, action })
            });

            if (res.ok) {
                setRequests(requests.filter(r => r.id !== jobId));
            } else {
                alert('Error al procesar la solicitud');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Solicitudes de Publicación</h2>
                    <p className="text-[var(--text-secondary)]">Revisa y aprueba las solicitudes de empresas</p>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Cargando solicitudes...</div>
                ) : requests.length === 0 ? (
                    <div className="bento-card bg-white p-12 text-center">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay solicitudes pendientes</h3>
                        <p className="text-gray-500">Todas las solicitudes han sido procesadas.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((job) => (
                            <div key={job.id} className="bento-card bg-white p-6">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                            {job.isFeatured && (
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 font-medium">
                                                    ⭐ Destacado
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                                            <span>🏢 {job.company}</span>
                                            <span>📍 {job.location}</span>
                                            <span>💼 {job.type}</span>
                                            {job.salary && <span>💰 {job.salary}</span>}
                                        </div>
                                        <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>

                                        {job.companyUser && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-xs text-gray-500">
                                                    Solicitado por: <span className="font-medium">{job.companyUser.name || job.companyUser.email}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 lg:flex-col lg:w-32">
                                        <button
                                            onClick={() => handleAction(job.id, 'approve')}
                                            disabled={processingId !== null}
                                            className="flex-1 lg:flex-none px-4 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            {processingId === job.id ? '...' : '✓ Aprobar'}
                                        </button>
                                        <button
                                            onClick={() => handleAction(job.id, 'reject')}
                                            disabled={processingId !== null}
                                            className="flex-1 lg:flex-none px-4 py-2.5 bg-white text-red-600 font-medium rounded-xl border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            {processingId === job.id ? '...' : '✗ Rechazar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
