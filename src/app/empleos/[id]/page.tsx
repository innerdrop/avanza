"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import JobShareButton from "@/components/jobs/JobShareButton";

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    salary: string;
    posted: string;
    expiresAt?: string;
}

export default function EmpleoDetailPage() {
    const params = useParams();
    const id = params.id;

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            try {
                const res = await fetch(`/api/jobs/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setJob(data);
                } else {
                    setError(true);
                }
            } catch (error) {
                console.error("Error fetching job:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
                <p className="text-[var(--text-secondary)]">Cargando empleo...</p>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen pt-32 pb-20">
                <div className="container max-w-3xl text-center">
                    <div className="text-6xl mb-4">😞</div>
                    <h1 className="text-3xl font-bold mb-4">Empleo no encontrado</h1>
                    <p className="text-[var(--text-secondary)] mb-8">
                        El empleo que buscas no existe o fue removido.
                    </p>
                    <Link href="/empleos" className="btn btn-primary">
                        Ver todos los empleos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container max-w-4xl">
                {/* Back Button */}
                <Link href="/empleos" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] mb-8 transition-colors">
                    <span>←</span> Volver a empleos
                </Link>

                {/* Job Header */}
                <div className="bento-card mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-[var(--text-primary)]">{job.title}</h1>
                            <div className="flex flex-wrap gap-2 sm:gap-3 items-center text-[var(--text-secondary)] text-sm sm:text-base">
                                <span className="flex items-center gap-2">
                                    🏢 {job.company}
                                </span>
                                <span className="flex items-center gap-2">
                                    📍 {job.location}
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-[rgba(255,215,0,0.1)] text-[var(--primary)] border border-[var(--primary)]">
                                    {job.type}
                                </span>
                            </div>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-1">Salario</p>
                            <p className="text-xl sm:text-2xl font-bold text-[var(--primary)]">{job.salary}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-[var(--border-light)]">
                        <Link
                            href={`/cargar-cv?jobId=${job.id}&jobTitle=${encodeURIComponent(job.title)}`}
                            className="btn btn-primary flex-1 justify-center"
                        >
                            Postularme Ahora
                        </Link>
                        <JobShareButton
                            jobId={job.id}
                            jobTitle={job.title}
                            jobCompany={job.company}
                            className="btn btn-glass px-8 justify-center"
                        >
                            Compartir
                        </JobShareButton>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bento-card">
                            <h2 className="text-2xl font-bold mb-4">Descripción del puesto</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {job.description}
                            </p>
                        </div>

                        {/* Responsibilities */}
                        <div className="bento-card">
                            <h2 className="text-2xl font-bold mb-4">Responsabilidades</h2>
                            <ul className="space-y-3">
                                {job.responsibilities.map((resp, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="text-[var(--primary)] mt-1">✓</span>
                                        <span className="text-[var(--text-secondary)]">{resp}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Requirements */}
                        <div className="bento-card">
                            <h2 className="text-2xl font-bold mb-4">Requisitos</h2>
                            <div className="flex flex-wrap gap-3">
                                {job.requirements.map((req, idx) => (
                                    <span key={idx} className="px-4 py-2 rounded-full bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] border border-[var(--border-light)]">
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Benefits */}
                        <div className="bento-card">
                            <h3 className="text-xl font-bold mb-4">Beneficios</h3>
                            <ul className="space-y-3">
                                {job.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="text-[var(--accent)]">•</span>
                                        <span className="text-sm text-[var(--text-secondary)]">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Job Info */}
                        <div className="bento-card">
                            <h3 className="text-xl font-bold mb-4">Información</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-[var(--text-secondary)] mb-1">Publicado</p>
                                    <p className="font-medium">{job.posted}</p>
                                </div>
                                {job.expiresAt && (
                                    <div>
                                        <p className="text-[var(--text-secondary)] mb-1">Vence</p>
                                        <p className="font-medium">{new Date(job.expiresAt).toLocaleDateString()}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[var(--text-secondary)] mb-1">Tipo</p>
                                    <p className="font-medium">{job.type}</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="bento-card bg-[rgba(255,215,0,0.05)] border-[var(--primary)]">
                            <h3 className="text-lg font-bold mb-2">¿Te interesa?</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                No pierdas esta oportunidad. Postúlate ahora.
                            </p>
                            <Link
                                href={`/cargar-cv?jobId=${job.id}&jobTitle=${encodeURIComponent(job.title)}`}
                                className="btn btn-primary w-full justify-center"
                            >
                                Postularme
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
