"use client";

import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from 'next/link';

export default function ResultadosPage() {
    const [result, setResult] = useState<any>(null);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem('lastTestResult');
        if (stored) {
            setResult(JSON.parse(stored));
        }
    }, []);

    const downloadPDF = async () => {
        if (!printRef.current) return;

        try {
            const canvas = await html2canvas(printRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Perfil_Laboral_${result.nombre.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error(err);
            alert("Error al generar el PDF");
        }
    };

    if (!result) return (
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    const { scores, profile } = result.resultado;
    const maxScore = Math.max(...Object.values(scores) as number[]);

    // Descriptions for profiles
    const descriptions: any = {
        'Liderazgo': "Tienes una fuerte capacidad para guiar y motivar a otros. Disfrutas asumiendo responsabilidades y tomando decisiones estratégicas. Eres ideal para roles de gestión, coordinación y jefatura.",
        'Equipo': "Eres un colaborador natural. Valoras la armonía y el consenso, y trabajas mejor en entornos donde se fomenta la cooperación. Tu empatía te convierte en un excelente compañero.",
        'Organización': "Destacas por tu orden, planificación y atención al detalle. Eres metódico y confiable, asegurando que los proyectos se cumplan en tiempo y forma. Ideal para roles administrativos o logísticos.",
        'Creatividad': "Tu mente siempre busca nuevas formas de hacer las cosas. Aportas innovación y originalidad, y te sientes cómodo en entornos dinámicos y flexibles. Ideal para diseño, marketing o resolución de problemas complejos."
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)]">
            <main className="container !pt-28 !sm:pt-32 pb-20 px-4 sm:px-0">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Tu Informe de Perfil</h1>
                        <div className="flex gap-4">
                            <button
                                onClick={downloadPDF}
                                className="btn btn-primary text-white shadow-lg flex items-center gap-2"
                            >
                                <span>📥</span> Descargar PDF
                            </button>
                            <Link href="/" className="btn btn-glass">
                                Ir al Inicio
                            </Link>
                        </div>
                    </div>

                    <div ref={printRef} className="bg-white p-6 sm:p-12 rounded-3xl shadow-xl border border-[var(--border-light)]">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 border-b border-gray-100 pb-8 gap-4 sm:gap-0">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-2">{result.nombre}</h2>
                                <p className="text-[var(--text-secondary)] break-all">{result.email}</p>
                                <p className="text-sm text-gray-400 mt-1">Fecha: {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto">
                                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-[var(--primary)] font-bold text-sm mb-2">PERFIL PREDOMINANTE</span>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">{profile}</h3>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h4 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Sobre tu perfil</h4>
                            <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
                                {descriptions[profile]}
                            </p>
                        </div>

                        <div className="mb-12">
                            <h4 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Análisis de Competencias</h4>
                            <div className="space-y-6">
                                {Object.entries(scores).map(([category, score]: [string, any]) => (
                                    <div key={category}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium text-[var(--text-primary)]">{category}</span>
                                            <span className="font-bold text-[var(--primary)]">{score}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-1000 ${score === maxScore ? 'bg-[var(--accent)]' : 'bg-[var(--primary)]'}`}
                                                style={{ width: `${score}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 mt-8 text-center text-sm text-[var(--text-secondary)]">
                            Este informe es una herramienta de autoconocimiento generada por <strong>Moovy Jobs</strong>.
                            Úsalo para potenciar tu búsqueda laboral y resaltar tus fortalezas en tu CV.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
