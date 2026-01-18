"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Sub-component to handle search params to avoid Suspense boundary issues on the main page export if strictly static
// But for simplicity in this iteration we will use a client-side effect to read params or just useSearchParams directly.
// To be safe with Next.js build, we'll use a small wrapper or just read window on mount if useSearchParams is tricky without Suspense.
// Actually, let's just use useSearchParams and wrap the main content in Suspense in the export.

function CargarCVContent() {
    const searchParams = useSearchParams();
    const jobTitle = searchParams.get('jobTitle');

    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "+54 9 2901 ",
        linkedin: "",
        area: "",
        experiencia: "",
        disponibilidad: "",
        presentacion: ""
    });

    const [cvFile, setCvFile] = useState<File | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get stored job details if any (from URL params) but we need to use useSearchParams which requires Suspense
    // For simplicity efficiently, we will grab params in a useEffect or similar, or just parse window.location if necessary, 
    // but Next.js way is useSearchParams. Since this is "use client", we should import it.

    // Let's defer to valid Next.js implementation using useSearchParams
    // We'll adding the import in a separate block first if needed, but let's rewrite the logic here.

    // NOTE: To correctly use useSearchParams in Next.js 13+ App Router, the component should be wrapped in Suspense 
    // or be a page that receives searchParams (only for Server Components). 
    // Since this is a Client Component page, we can use useSearchParams but it might de-opt static generation.
    // However, for this use case it's fine.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create FormData
            const formDataToSend = new FormData();

            // Append all text fields
            formDataToSend.append('nombre', formData.nombre);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('telefono', formData.telefono);
            formDataToSend.append('linkedin', formData.linkedin);

            // Professional info - send N/A if hidden
            formDataToSend.append('area', jobTitle ? 'Postulación Directa' : formData.area);
            formDataToSend.append('experiencia', jobTitle ? 'N/A' : formData.experiencia);
            formDataToSend.append('disponibilidad', jobTitle ? 'N/A' : formData.disponibilidad);
            formDataToSend.append('presentacion', formData.presentacion);

            // Append file if exists
            if (cvFile) {
                formDataToSend.append('cvFile', cvFile);
            }

            // Get Job ID from searchParams (most reliable in client component)
            const jobId = searchParams.get('jobId');

            console.log("CLIENT DEBUG: Submitting form...");
            console.log("CLIENT DEBUG: Job ID found:", jobId);

            if (jobId) {
                formDataToSend.append('jobPostingId', jobId);
            } else {
                console.log("CLIENT DEBUG: No jobPostingId found (Spontaneous Application)");
            }

            const response = await fetch('/api/applications', {
                method: 'POST',
                // Content-Type header is set automatically to multipart/form-data with boundary when using FormData body
                body: formDataToSend,
            });

            if (response.ok) {
                alert("¡Tu CV ha sido recibido! Te contactaremos cuando surjan oportunidades que se ajusten a tu perfil.");
                // Reset form
                setFormData({
                    nombre: "",
                    email: "",
                    telefono: "+54 9 2901 ",
                    linkedin: "",
                    area: "",
                    experiencia: "",
                    disponibilidad: "",
                    presentacion: ""
                });
                setCvFile(null);
            } else {
                const errorData = await response.json();
                alert(`Error al enviar: ${errorData.error || 'Intenta nuevamente más tarde.'}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert("Error de conexión. Por favor intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-5xl font-bold mb-4 text-[var(--text-primary)]">
                        {jobTitle ? (
                            <>
                                Postulación a <span className="text-[var(--primary)] block mt-2 text-4xl">{decodeURIComponent(jobTitle)}</span>
                                {/* Debug hidden info */}
                                <span className="hidden text-xs text-gray-500">Job ID: {searchParams.get('jobId')}</span>
                            </>
                        ) : (
                            <>Únete a Nuestro <span className="text-[var(--primary)]">Talent Pool</span></>
                        )}
                    </h1>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        {jobTitle
                            ? "Completa el formulario para aplicar a esta vacante específica."
                            : "Carga tu CV y sé parte de nuestra base de talentos. Te contactaremos cuando surjan oportunidades."
                        }
                    </p>
                </div>

                {/* Form */}
                <div className="bento-card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Información Personal</h2>
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nombre completo *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                        placeholder="Juan Pérez"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                        placeholder="tu@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Teléfono *</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                        placeholder="+54 9 2901 123456"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                        placeholder="https://linkedin.com/in/tuperfil"
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Info (Only show if spontaneous) */}
                        {!jobTitle && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Información Profesional</h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Área de interés *</label>
                                        <select
                                            required={!jobTitle}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                            value={formData.area}
                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        >
                                            <option value="">Selecciona un área</option>
                                            <option value="administracion">Administración</option>
                                            <option value="contabilidad">Contabilidad y Finanzas</option>
                                            <option value="ventas">Ventas y Marketing</option>
                                            <option value="atencion-cliente">Atención al Cliente</option>
                                            <option value="logistica">Logística y Transporte</option>
                                            <option value="comercio-exterior">Comercio Exterior</option>
                                            <option value="tecnologia">Tecnología e IT</option>
                                            <option value="rrhh">Recursos Humanos</option>
                                            <option value="legal">Legal y Cumplimiento</option>
                                            <option value="produccion">Producción y Operaciones</option>
                                            <option value="calidad">Calidad y Procesos</option>
                                            <option value="mantenimiento">Mantenimiento</option>
                                            <option value="gastronomia">Gastronomía y Hotelería</option>
                                            <option value="salud">Salud y Bienestar</option>
                                            <option value="educacion">Educación y Capacitación</option>
                                            <option value="construccion">Construcción</option>
                                            <option value="turismo">Turismo</option>
                                            <option value="medio-ambiente">Medio Ambiente</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Años de experiencia *</label>
                                        <select
                                            required={!jobTitle}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                            value={formData.experiencia}
                                            onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                                        >
                                            <option value="">Selecciona tu experiencia</option>
                                            <option value="sin-experiencia">Sin experiencia laboral</option>
                                            <option value="menos-1">Menos de 1 año</option>
                                            <option value="1-2">1 a 2 años</option>
                                            <option value="2-3">2 a 3 años</option>
                                            <option value="3-5">3 a 5 años</option>
                                            <option value="5-10">5 a 10 años</option>
                                            <option value="mas-10">Más de 10 años</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Disponibilidad *</label>
                                        <select
                                            required={!jobTitle}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                            value={formData.disponibilidad}
                                            onChange={(e) => setFormData({ ...formData, disponibilidad: e.target.value })}
                                        >
                                            <option value="">Selecciona tu disponibilidad</option>
                                            <option value="inmediata">Inmediata</option>
                                            <option value="1-semana">1 semana</option>
                                            <option value="15-dias">15 días</option>
                                            <option value="1-mes">1 mes</option>
                                            <option value="2-meses">2 meses</option>
                                            <option value="mas-2-meses">Más de 2 meses</option>
                                            <option value="sin-disponibilidad">Sin disponibilidad (solo consulta)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Presentación personal</label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none transition-colors resize-none"
                                            placeholder="Cuéntanos brevemente sobre ti, tus fortalezas y qué tipo de oportunidad estás buscando..."
                                            value={formData.presentacion}
                                            onChange={(e) => setFormData({ ...formData, presentacion: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CV Upload */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Cargar CV</h2>
                            <div className="border-2 border-dashed border-[var(--border-light)] rounded-xl p-8 text-center hover:border-[var(--primary)] transition-colors">
                                <input
                                    type="file"
                                    id="cv-upload"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                />
                                <label htmlFor="cv-upload" className="cursor-pointer">
                                    <div className="text-5xl mb-4">📄</div>
                                    {cvFile ? (
                                        <div>
                                            <p className="text-[var(--primary)] font-medium mb-2">{cvFile.name}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                Click para cambiar el archivo
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-[var(--text-primary)] font-medium mb-2">
                                                Click para cargar tu CV
                                            </p>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                Formatos aceptados: PDF, DOC, DOCX (máx. 5MB)
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full text-lg disabled:opacity-70 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Enviando...' : 'Enviar Postulación'}
                            </button>
                            <p className="text-sm text-[var(--text-secondary)] text-center mt-4">
                                Al enviar tu CV, aceptas que tus datos sean almacenados para procesos de selección futuros.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    <div className="bento-card text-center">
                        <div className="text-3xl mb-3">🔒</div>
                        <h3 className="font-bold mb-2">Confidencial</h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Tus datos están protegidos
                        </p>
                    </div>
                    <div className="bento-card text-center">
                        <div className="text-3xl mb-3">⚡</div>
                        <h3 className="font-bold mb-2">Respuesta rápida</h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Te contactamos en 48hs
                        </p>
                    </div>
                    <div className="bento-card text-center">
                        <div className="text-3xl mb-3">🎯</div>
                        <h3 className="font-bold mb-2">Oportunidades</h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Solo ofertas relevantes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CargarCVPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center">Cargando...</div>}>
            <CargarCVContent />
        </Suspense>
    );
}
