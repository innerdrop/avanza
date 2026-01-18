
"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PsicotecnicoDetalleAdmin() {
    const params = useParams();
    const [test, setTest] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                // Reuse the same API, but we might need a specific endpoint or filter
                // For simplicity, we can fetch all and filter client side, or better, make a GET /api/psychometric/[id]
                // But I haven't created that route. 
                // Let's create a specific route for ID fetching or just fetch local component state if passed... no.
                // I will add a GET to a new route /api/psychometric/[id] OR just use client side filtering from the list API if the list is small.
                // Scalable way: GET /api/psychometric/[id]
                // I'll update the API route logic to handle ID search or creating a new [id] route.
                // Creating a new route file is cleaner.
                const res = await fetch(`/api/psychometric/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTest(data);
                }
            } catch (error) {
                console.error("Error fetching test:", error);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchTest();
    }, [params.id]);

    if (loading) return <AdminLayout>Caragndo...</AdminLayout>;
    if (!test) return <AdminLayout>No encontrado</AdminLayout>;

    const result = JSON.parse(test.resultado);
    const answers = JSON.parse(test.respuestas);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/ops/psicotecnicos" className="text-[var(--text-secondary)] hover:text-[var(--primary)]">
                        ← Volver
                    </Link>
                    <h2 className="text-3xl font-bold">Detalle de Evaluación</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Info Card */}
                    <div className="bento-card bg-white p-6 col-span-1">
                        <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)]">Candidato</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-[var(--text-secondary)] uppercase">Nombre</label>
                                <p className="font-medium">{test.nombre}</p>
                            </div>
                            <div>
                                <label className="text-xs text-[var(--text-secondary)] uppercase">Email</label>
                                <p className="font-medium">{test.email}</p>
                            </div>
                            <div>
                                <label className="text-xs text-[var(--text-secondary)] uppercase">Fecha</label>
                                <p className="font-medium">{new Date(test.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Result Card */}
                    <div className="bento-card bg-white p-6 col-span-2">
                        <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)]">Resultados</h3>
                        <div className="mb-6">
                            <span className="text-sm text-[var(--text-secondary)]">Perfil Predominante:</span>
                            <p className="text-2xl font-bold text-[var(--primary)]">{result.profile}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(result.scores).map(([key, val]: [string, any]) => (
                                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{key}</span>
                                        <span className="text-sm font-bold text-[var(--primary)]">{val}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: `${val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Answers Collapse/Expand could go here */}
            </div>
        </AdminLayout>
    );
}
