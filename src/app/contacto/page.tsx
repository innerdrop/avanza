"use client";

import { useState } from "react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        nombre: "",
        empresa: "",
        email: "",
        telefono: "",
        servicio: "",
        mensaje: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("¡Gracias por contactarnos! Mensaje enviado correctamente.");
                setFormData({
                    nombre: "",
                    empresa: "",
                    email: "",
                    telefono: "",
                    servicio: "",
                    mensaje: ""
                });
            } else {
                alert("Error al enviar el mensaje. Intente nuevamente.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error de conexión. Intente nuevamente.");
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container max-w-5xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-5xl font-bold mb-4 text-[var(--text-primary)]">
                        Hablemos de tu <span className="text-[var(--primary)]">Proyecto</span>
                    </h1>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Estamos para ayudarte a encontrar el talento que tu empresa necesita
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {/* Contact Form */}
                    <div className="bento-card">
                        <h2 className="text-2xl font-bold mb-6 text-center">Envíanos un mensaje</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                <label className="block text-sm font-medium mb-2">Empresa</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                    placeholder="Mi Empresa S.A."
                                    value={formData.empresa}
                                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email *</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                    placeholder="contacto@empresa.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Teléfono</label>
                                <PhoneInput
                                    international
                                    defaultCountry="AR"
                                    placeholder="+54 9 2901 123456"
                                    value={formData.telefono}
                                    onChange={(value) => setFormData({ ...formData, telefono: value || "" })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Servicio de interés</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                    value={formData.servicio}
                                    onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                                >
                                    <option value="">Selecciona un servicio</option>
                                    <option value="publicidad">Publicidad</option>
                                    <option value="reclutamiento">Reclutamiento y Selección</option>
                                    <option value="evaluacion">Evaluación Psicotécnica</option>
                                    <option value="consultoria">Consultoría en RRHH</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Mensaje *</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-[var(--border-light)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none transition-colors resize-none"
                                    placeholder="Cuéntanos sobre tu necesidad..."
                                    value={formData.mensaje}
                                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-full">
                                Enviar mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
