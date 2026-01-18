"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccess('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (res.ok && data.role === 'company') {
                router.push('/empresas/dashboard');
            } else if (res.ok) {
                setError('Esta cuenta no es de empresa');
            } else {
                setError(data.error || 'Credenciales inválidas');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm border border-green-100">
                    {success}
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                </label>
                <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="contacto@empresa.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contraseña
                </label>
                <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
        </form>
    );
}

export default function LoginEmpresaPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <img src="/logo.png" alt="Avanza Fueguino" className="h-12 mx-auto mb-4" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Portal de Empresas</h1>
                    <p className="text-gray-600 mt-2">Accede a tu cuenta para gestionar tus publicaciones</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <Suspense fallback={<div className="text-center py-4">Cargando...</div>}>
                        <LoginForm />
                    </Suspense>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            ¿No tienes cuenta?{' '}
                            <Link href="/empresas/registro" className="text-blue-600 font-medium hover:underline">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-gray-500 text-sm hover:text-gray-700">
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
