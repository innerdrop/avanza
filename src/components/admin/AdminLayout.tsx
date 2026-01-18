"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { label: 'Dashboard', path: '/ops', icon: '📊' },
        { label: 'Solicitudes', path: '/ops/solicitudes', icon: '🔔' },
        { label: 'Empleos', path: '/ops/empleos', icon: '💼' },
        { label: 'Postulaciones', path: '/ops/postulaciones', icon: '📝' },
        { label: 'Empresas', path: '/ops/empresas', icon: '🏢' },
        { label: 'Pagos', path: '/ops/pagos', icon: '💳' },
        { label: 'Publicidad', path: '/ops/publicidad', icon: '📢' },
        { label: 'Psicotécnicos', path: '/ops/psicotecnicos', icon: '🧠' },
        { label: 'Contenido', path: '/ops/contenido', icon: '✨' },
        { label: 'Data', path: '/ops/data', icon: '📊' },
        { label: 'Configuración', path: '/ops/configuracion', icon: '⚙️' },
    ];

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await fetch('/api/messages/unread');
                if (res.ok) {
                    const data = await res.json();
                    setUnreadCount(data.count);
                }
            } catch (error) {
                console.error("Error fetching unread count", error);
            }
        };
        fetchUnreadCount();

        // Optional: Poll every minute
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, []);

    // Initial Dark Mode Check
    useState(() => {
        if (typeof window !== 'undefined') {
            const isDark = localStorage.getItem('theme') === 'dark';
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    });

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--bg-card)] border-b border-[var(--border-light)] z-40 flex items-center justify-between px-4 sm:px-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--primary)]"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] font-medium hidden sm:block">
                        ← Volver al sitio
                    </Link>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-[var(--primary)] truncate">Avanza Fueguino</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block">Administrador</span>
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">A</div>
                    <button
                        onClick={() => {
                            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                            window.location.href = '/ops/login';
                        }}
                        className="px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium hidden sm:flex items-center gap-1"
                    >
                        <span>🚪</span> Salir
                    </button>
                </div>
            </header>

            <div className="pt-16">
                {/* Sidebar Overlay for Mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <aside className={`fixed left-0 top-16 bottom-0 w-60 bg-[var(--bg-card)] border-r border-[var(--border-light)] z-40 transition-transform duration-300 overflow-y-auto flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                    <nav className="p-4 space-y-1 flex-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path || (item.path !== "/ops" && pathname?.startsWith(item.path));
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                        ? "bg-[var(--primary)] text-white font-medium shadow-sm"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--primary)]"
                                        }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="text-sm flex-1">{item.label}</span>
                                    {item.label === "Mensajes" && unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-4 border-t border-[var(--border-light)] lg:hidden">
                        <Link href="/" className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <span>←</span> Volver al sitio
                        </Link>
                    </div>

                    <div className="p-4 border-t border-[var(--border-light)]">
                        <button
                            onClick={() => {
                                document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                window.location.href = '/ops/login';
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium sm:hidden"
                        >
                            <span>🚪</span> Cerrar Sesión
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:ml-60 p-4 lg:p-6 pb-20">
                    {children}
                </main>
            </div>
        </div>
    );
}
