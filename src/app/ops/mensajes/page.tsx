"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";

export default function MensajesAdmin() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/messages');
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectMessage = async (msg: any) => {
        // Si ya está seleccionado, no hacer nada (o solo deseleccionar si fuera el caso, pero aquí es selección)
        if (selectedMessage?.id === msg.id) return;

        setSelectedMessage(msg);

        if (!msg.isRead) {
            // Optimistically update UI
            const updatedMsg = { ...msg, isRead: true };
            setSelectedMessage(updatedMsg);
            setMessages(prev => prev.map(m => m.id === msg.id ? updatedMsg : m));

            try {
                await fetch(`/api/messages/${msg.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isRead: true }),
                });
                // Note: The global unread count in Sidebar won't update instantly without a full page refresh 
                // or context, but it will update on next poll or navigation.
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("¿Está seguro de eliminar este mensaje?")) return;

        try {
            const response = await fetch(`/api/messages/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMessages(messages.filter(m => m.id !== id));
                if (selectedMessage?.id === id) setSelectedMessage(null);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Buzón de Mensajes</h1>
                <p className="text-[var(--text-secondary)]">Gestiona las consultas recibidas desde la sección de contacto</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
                {/* Message List */}
                <div className="w-full lg:w-1/3 bg-white border border-[var(--border-light)] rounded-xl overflow-hidden flex flex-col shadow-sm">
                    <div className="p-4 border-b border-[var(--border-light)] bg-gray-50 flex justify-between items-center">
                        <span className="font-bold text-[var(--text-primary)]">Mensajes ({messages.length})</span>
                        <button onClick={fetchMessages} className="text-[var(--primary)] text-sm hover:underline">
                            🔄 Actualizar
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-light)]">
                        {loading ? (
                            <div className="p-8 text-center text-[var(--text-secondary)]">Cargando...</div>
                        ) : messages.length === 0 ? (
                            <div className="p-8 text-center text-[var(--text-secondary)]">No hay mensajes.</div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    onClick={() => handleSelectMessage(msg)}
                                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedMessage?.id === msg.id ? 'bg-blue-50 border-l-4 border-[var(--primary)]' :
                                        !msg.isRead ? 'bg-white border-l-4 border-[var(--accent)] font-medium' : 'bg-white border-l-4 border-transparent opacity-80'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="truncate font-semibold text-[var(--text-primary)]">{msg.nombre}</h3>
                                        <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap ml-2">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)] truncate mb-2">{msg.email}</p>
                                    <p className="text-sm text-[var(--text-primary)] truncate">{msg.mensaje}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="w-full lg:w-2/3 bg-white border border-[var(--border-light)] rounded-xl shadow-sm flex flex-col overflow-hidden">
                    {selectedMessage ? (
                        <>
                            <div className="p-6 border-b border-[var(--border-light)] flex justify-between items-start bg-gray-50">
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{selectedMessage.nombre}</h2>
                                    <p className="text-[var(--text-secondary)]">{selectedMessage.empresa || 'Particular'}</p>
                                </div>
                                <div className="flex gap-2">
                                    {/* Read toggle button removed */}
                                    <button
                                        onClick={(e) => handleDelete(selectedMessage.id, e)}
                                        className="px-3 py-1.5 rounded-lg text-sm border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-1 block">Email</label>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-[var(--primary)] hover:underline break-all block">
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-1 block">Teléfono</label>
                                        <a href={`tel:${selectedMessage.telefono}`} className="text-[var(--text-primary)] hover:underline block">
                                            {selectedMessage.telefono || '-'}
                                        </a>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg col-span-1 md:col-span-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-1 block">Servicio de Interés</label>
                                        <p className="text-[var(--text-primary)] capitalize">{selectedMessage.servicio || 'General'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-[var(--text-primary)] uppercase mb-2 block border-b pb-2">Mensaje</label>
                                    <p className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                                        {selectedMessage.mensaje}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-secondary)] p-8">
                            <div className="text-6xl mb-4 opacity-20">📧</div>
                            <p className="text-lg">Selecciona un mensaje para ver el detalle</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
