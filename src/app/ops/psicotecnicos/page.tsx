
"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PsicotecnicosAdmin() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await fetch('/api/psychometric');
                if (res.ok) {
                    const data = await res.json();
                    setTests(data);
                }
            } catch (error) {
                console.error("Error fetching tests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Test Psicotécnicos</h2>
                    <p className="text-[var(--text-secondary)]">Resultados de evaluaciones realizadas por usuarios</p>
                </div>

                <div className="bento-card overflow-hidden bg-white">
                    <div className="overflow-hidden">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="p-8 text-center text-[var(--text-secondary)]">Cargando resultados...</div>
                            ) : (
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-[var(--border-light)]">
                                            <th className="text-left py-4 px-4 font-medium text-sm text-[var(--text-secondary)]">Fecha</th>
                                            <th className="text-left py-4 px-4 font-medium text-sm text-[var(--text-secondary)]">Candidato</th>
                                            <th className="text-left py-4 px-4 font-medium text-sm text-[var(--text-secondary)]">Email</th>
                                            <th className="text-left py-4 px-4 font-medium text-sm text-[var(--text-secondary)]">Perfil</th>
                                            <th className="text-left py-4 px-4 font-medium text-sm text-[var(--text-secondary)]">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tests.map((test) => {
                                            let profile = "Desconocido";
                                            try {
                                                const res = JSON.parse(test.resultado);
                                                profile = res.profile;
                                            } catch (e) { }

                                            return (
                                                <tr key={test.id} className="border-b border-[var(--border-light)] hover:bg-gray-50">
                                                    <td className="py-4 px-4 text-sm whitespace-nowrap">
                                                        {new Date(test.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-4 px-4 font-medium text-[var(--text-primary)] whitespace-nowrap">
                                                        {test.nombre}
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-[var(--text-secondary)]">
                                                        {test.email}
                                                    </td>
                                                    <td className="py-4 px-4 whitespace-nowrap">
                                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                                            {profile}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 whitespace-nowrap">
                                                        <Link
                                                            href={`/ops/psicotecnicos/${test.id}`}
                                                            className="text-sm text-[var(--primary)] hover:underline"
                                                        >
                                                            Ver Detalle
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
