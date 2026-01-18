"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

export default function AdminEmpresasPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [viewingJobs, setViewingJobs] = useState(false);

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/admin/companies");
            if (res.ok) {
                const data = await res.json();
                setCompanies(data);
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleViewDetails = async (id: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/companies/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedCompany(data);
                setViewingJobs(false);
            }
        } catch (error) {
            console.error("Error fetching company details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId: number) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este empleo?")) return;
        try {
            const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
            if (res.ok) {
                // Refresh company details
                handleViewDetails(selectedCompany.id);
            }
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    const handleDeleteCompany = async (id: number) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta empresa y TODAS sus publicaciones?")) return;
        try {
            const res = await fetch(`/api/admin/companies/${id}`, { method: "DELETE" });
            if (res.ok) {
                setSelectedCompany(null);
                fetchCompanies();
            }
        } catch (error) {
            console.error("Error deleting company:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Administrar Empresas</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* List */}
                        <div className="lg:col-span-1 space-y-4">
                            {companies.map((company) => (
                                <div
                                    key={company.id}
                                    onClick={() => handleViewDetails(company.id)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedCompany?.id === company.id ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white border-gray-100 hover:border-blue-300'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900">{company.name}</h3>
                                        {company.plan === 'premium' && (
                                            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 text-[10px] font-bold rounded-full shadow-sm">
                                                👑 Premium
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{company.email}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                            {company._count.jobPostings} empleos
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            Reg: {new Date(company.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Details/Action Panel */}
                        <div className="lg:col-span-2">
                            {selectedCompany ? (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 overflow-hidden">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h2>
                                            <p className="text-gray-500">{selectedCompany.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setViewingJobs(!viewingJobs)}
                                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200"
                                            >
                                                {viewingJobs ? 'Ver Datos' : 'Ver Publicaciones'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCompany(selectedCompany.id)}
                                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200"
                                            >
                                                Eliminar Empresa
                                            </button>
                                        </div>
                                    </div>

                                    {viewingJobs ? (
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-lg mb-4">Anuncios de {selectedCompany.name}</h3>
                                            {selectedCompany.jobPostings.length > 0 ? (
                                                selectedCompany.jobPostings.map((job: any) => (
                                                    <div key={job.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                                                        <div>
                                                            <h4 className="font-bold">{job.title}</h4>
                                                            <p className="text-xs text-gray-500">Estado: <span className={`font-medium ${job.status === 'active' ? 'text-green-600' : job.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{job.status}</span></p>
                                                            <p className="text-xs text-gray-500">{job._count.applications} postulaciones</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={`/ops/empleos/editar/${job.id}`}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                                title="Editar"
                                                            >
                                                                ✏️
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteJob(job.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                                title="Eliminar"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 italic">No hay anuncios publicados.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-4 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-400 mb-1">ID Empresa</p>
                                                    <p className="font-mono text-sm">{selectedCompany.id}</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-400 mb-1">Nombre Comercial</p>
                                                    <p className="font-medium">{selectedCompany.name}</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-400 mb-1">Email de Contacto</p>
                                                    <p className="font-medium">{selectedCompany.email}</p>
                                                </div>
                                                <div className="p-4 bg-gray-100 rounded-xl">
                                                    <p className="text-xs text-gray-400 mb-1">Total Empleos</p>
                                                    <p className="font-bold text-blue-600 text-lg">{selectedCompany.jobPostings.length}</p>
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                                    <div className="text-5xl mb-4 opacity-20">🏢</div>
                                    <h3 className="text-lg font-medium text-gray-400">Selecciona una empresa para ver sus datos</h3>
                                    <p className="text-sm text-gray-400 mt-2">Podrás ver sus búsquedas activas y gestionar su cuenta.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
