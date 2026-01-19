"use client";

import { useState, useEffect } from "react";

export default function GlobalConfigHandler({ children }: { children: React.ReactNode }) {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check admin status (cookie based or simple path check for now to avoid complexity in this client component)
        const isOps = window.location.pathname.startsWith('/ops') || window.location.pathname.startsWith('/api') || window.location.pathname === '/ops/login';
        setIsAdmin(isOps);

        const checkMaintenance = async () => {
            try {
                const res = await fetch('/api/config');
                if (res.ok) {
                    const data = await res.json();
                    setMaintenanceMode(data.maintenance_mode === 'true');
                }
            } catch (error) {
                console.error("Error checking maintenance:", error);
            } finally {
                setLoading(false);
            }
        };

        // Only check if not obviously admin, to save requests, OR check always to be safe? 
        // Better check always but only block non-admins.
        if (!isOps) {
            checkMaintenance();
        } else {
            setLoading(false);
        }
    }, []);

    if (maintenanceMode && !isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🚧</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Sitio en Mantenimiento</h1>
                    <p className="text-gray-600 text-lg">
                        Disculpa las molestias, estamos realizando mejoras en nuestra plataforma.
                        Por favor, vuelve a intentarlo más tarde.
                    </p>
                    <div className="pt-4">
                        <p className="text-sm text-gray-500">Equipo Moovy Jobs</p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
