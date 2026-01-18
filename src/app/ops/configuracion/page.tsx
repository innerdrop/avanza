"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";

export default function ConfiguracionPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [configs, setConfigs] = useState({
        maintenance_mode: false,
        notifications_email: true,
        notifications_new_user: true,
        notifications_telegram: false
    });
    const [darkMode, setDarkMode] = useState(false);
    const [localChanges, setLocalChanges] = useState<Record<string, boolean>>({});

    // Initial load
    useEffect(() => {
        // Load Dark Mode
        const isDark = document.documentElement.classList.contains('dark') ||
            localStorage.getItem('theme') === 'dark';
        setDarkMode(isDark);
        if (isDark) document.documentElement.classList.add('dark');

        // Load Server Configs
        const fetchConfigs = async () => {
            try {
                const res = await fetch('/api/config');
                if (res.ok) {
                    const data = await res.json();
                    setConfigs({
                        maintenance_mode: data.maintenance_mode === 'true',
                        notifications_email: data.notifications_email === 'true',
                        notifications_new_user: data.notifications_new_user === 'true',
                        notifications_telegram: data.notifications_telegram === 'true'
                    });
                }
            } catch (error) {
                console.error("Error loading configs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfigs();
    }, []);

    // Toggle Handler for State only
    const handleToggle = (key: string) => {
        setConfigs(prev => {
            const newValue = !prev[key as keyof typeof prev];
            return { ...prev, [key]: newValue };
        });
    };

    const handleInputChange = (key: string, value: string) => {
        setConfigs(prev => ({ ...prev, [key]: value }));
    };

    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
    };

    const saveChanges = async () => {
        setSaving(true);
        // Save Dark Mode locally
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        // Save server configs
        try {
            const promises = Object.entries(configs).map(([key, value]) => {
                // We save all just in case, or we could filter by modified if we tracked strictly
                return fetch('/api/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key, value })
                });
            });

            await Promise.all(promises);
            setLocalChanges({});
            alert("✅ Configuración guardada correctamente");
        } catch (error) {
            console.error("Error saving config:", error);
            alert("❌ Error al guardar la configuración");
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-4xl mx-auto pb-20">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Configuración</h2>
                        <p className="text-[var(--text-secondary)]">Ajustes generales de la plataforma</p>
                    </div>
                </div>

                <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-light)] overflow-hidden">
                    <div className="p-6 space-y-8">

                        {/* Apariencia */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-[var(--text-primary)] border-b pb-2">Apariencia</h3>
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors">
                                <div className="space-y-1">
                                    <span className="text-base font-medium text-[var(--text-primary)]">Modo Oscuro</span>
                                    <p className="text-sm text-[var(--text-secondary)]">Activar tema oscuro para la interfaz administrativa.</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={darkMode}
                                        onChange={handleDarkModeToggle}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* Sistema */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-[var(--text-primary)] border-b pb-2">Sistema</h3>

                            {/* Maintenance Mode */}
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors">
                                <div className="space-y-1">
                                    <span className="text-base font-medium text-[var(--text-primary)]">Modo Mantenimiento</span>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Si se activa, los usuarios verán una página de "En Mantenimiento".
                                    </p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={configs.maintenance_mode}
                                        onChange={() => handleToggle('maintenance_mode')}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                </label>
                            </div>

                            {/* Notifications Email */}
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors">
                                <div className="space-y-1">
                                    <span className="text-base font-medium text-[var(--text-primary)]">Alertas por Email</span>
                                    <p className="text-sm text-[var(--text-secondary)]">Recibir emails al llegar postulaciones.</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={configs.notifications_email}
                                        onChange={() => handleToggle('notifications_email')}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Notifications New User */}
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors">
                                <div className="space-y-1">
                                    <span className="text-base font-medium text-[var(--text-primary)]">Alertas Nuevos Usuarios</span>
                                    <p className="text-sm text-[var(--text-secondary)]">Notificar registros de usuarios.</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={configs.notifications_new_user}
                                        onChange={() => handleToggle('notifications_new_user')}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Notifications Telegram */}
                            <div className="space-y-4 pt-4 border-t border-[var(--border-light)]">
                                <div className="flex items-center justify-between p-2">
                                    <div className="space-y-1">
                                        <span className="text-base font-medium text-[var(--text-primary)]">Alertas por Telegram</span>
                                        <p className="text-sm text-[var(--text-secondary)]">Recibir notificaciones por bot de Telegram.</p>
                                    </div>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={configs.notifications_telegram}
                                            onChange={() => handleToggle('notifications_telegram')}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Action Bar */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-[var(--border-light)] sticky bottom-0">
                        <button
                            onClick={saveChanges}
                            disabled={saving}
                            className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all shadow-md transform active:scale-95 ${saving
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[var(--primary)] hover:brightness-110'
                                }`}
                        >
                            {saving ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Guardando...
                                </span>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
