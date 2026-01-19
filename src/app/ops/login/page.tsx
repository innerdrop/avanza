"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/ops');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Error de autenticación');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-8 text-center bg-[var(--secondary)] text-white">
                    <div className="flex items-center justify-center gap-1 mb-2">
                        <span className="text-3xl font-extrabold text-white tracking-widest" style={{ fontFamily: "'Junegull', 'Nunito', 'Quicksand', sans-serif" }}>MOOVY</span>
                        <span className="text-3xl font-bold text-[var(--primary)]" style={{ fontFamily: "'Inter', sans-serif" }}>Jobs</span>
                    </div>
                    <p className="opacity-90">Acceso Administrativo (OPS)</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-200">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--primary)] focus:ring-0 outline-none transition-all"
                            placeholder="Ingrese su usuario"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--primary)] focus:ring-0 outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-70"
                    >
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </button>

                    <div className="text-center">
                        <a href="/" className="text-sm text-gray-500 hover:text-[var(--primary)]">← Volver al sitio público</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
