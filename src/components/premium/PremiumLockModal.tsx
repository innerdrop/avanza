"use client";

import Link from "next/link";

interface PremiumLockModalProps {
    onClose: () => void;
    title?: string;
    message?: string;
}

export default function PremiumLockModal({ onClose, title, message }: PremiumLockModalProps) {
    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                        👑
                    </div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-md">
                        {title || "Función Premium"}
                    </h2>
                </div>

                {/* Body */}
                <div className="p-6 text-center">
                    <p className="text-slate-600 mb-2">
                        {message || (
                            <>
                                Esta funcionalidad de <strong className="text-indigo-600">Inteligencia Artificial</strong> está disponible exclusivamente para suscriptores Premium.
                            </>
                        )}
                    </p>
                    <p className="text-slate-500 text-sm mb-6">
                        Accede a análisis de CV con IA, búsqueda de talento inteligente y mucho más.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/empresas/premium"
                            className="w-full block px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-yellow-600 transition-all transform hover:scale-[1.02]"
                        >
                            ✨ Ver Planes y Beneficios
                        </Link>
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 border border-slate-300 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Ahora no
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 text-center">
                    <p className="text-xs text-slate-500">
                        🚀 Potencia tu reclutamiento con tecnología de vanguardia
                    </p>
                </div>
            </div>
        </div>
    );
}
