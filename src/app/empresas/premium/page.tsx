"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PremiumPage() {
    const router = useRouter();
    const [companyPlan, setCompanyPlan] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState<string>("");
    const [subscription, setSubscription] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const [notifyingPayment, setNotifyingPayment] = useState(false);
    const [paymentNotified, setPaymentNotified] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await fetch('/api/company/profile');
                if (profileRes.status === 401) {
                    router.push('/empresas/login');
                    return;
                }
                if (profileRes.ok) {
                    const data = await profileRes.json();
                    setCompanyPlan(data.plan);
                    setCompanyName(data.name || '');
                }

                // Fetch subscription status
                const subRes = await fetch('/api/company/subscribe');
                if (subRes.ok) {
                    const subData = await subRes.json();
                    setSubscription(subData.subscription);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    const handleSubscribe = async () => {
        setSubscribing(true);
        try {
            const res = await fetch('/api/company/subscribe', {
                method: 'POST'
            });
            const data = await res.json();

            if (res.ok) {
                setSubscription(data.subscription);
                alert('¡Solicitud creada! Revisa los datos de transferencia.');
            } else {
                alert(data.error || 'Error al crear suscripción');
            }
        } catch (error) {
            console.error('Error subscribing:', error);
            alert('Error de conexión');
        } finally {
            setSubscribing(false);
        }
    };

    const plans = [
        {
            name: "Básico",
            price: "Gratis",
            priceNote: "Para siempre",
            id: "basic",
            features: [
                "Publicar empleos ilimitados",
                "Recibir postulaciones",
                "Gestionar candidatos",
                "Panel de control completo",
                "Soporte por email"
            ],
            notIncluded: [
                "Análisis de CV con IA",
                "Búsqueda de talento con IA",
                "Informes avanzados"
            ],
            highlighted: false
        },
        {
            name: "Premium",
            price: "$15.000",
            priceNote: "por mes",
            id: "premium",
            features: [
                "Todo lo del plan Básico",
                "✨ Análisis de CV con IA",
                "✨ Búsqueda de talento con IA",
                "Candidatos recomendados automáticamente",
                "Match de compatibilidad puesto-candidato",
                "Informes y métricas avanzadas",
                "Soporte prioritario"
            ],
            notIncluded: [],
            highlighted: true
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
            {/* Header */}
            <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white sticky top-0 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/empresas/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-md">
                            🏢
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Panel de Empresa</h1>
                            <p className="text-xs text-slate-400">← Volver al Dashboard</p>
                        </div>
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-12">
                {/* Pending Subscription Banner */}
                {subscription && subscription.status === 'pending' && (
                    <div className="mb-8 bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">💳</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-amber-800 mb-2">Suscripción Pendiente de Pago</h3>
                                <p className="text-amber-700 mb-4">
                                    Tu solicitud fue creada el {new Date(subscription.createdAt).toLocaleDateString('es-AR')}.
                                    Realiza la transferencia para activar tu plan Premium.
                                </p>

                                <div className="bg-white rounded-xl p-5 border border-amber-200">
                                    <h4 className="font-bold text-slate-800 mb-3">🏦 Datos de Transferencia</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-500">Monto:</span>
                                            <span className="font-bold text-emerald-600 text-lg">${subscription.amount?.toLocaleString('es-AR')}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-500">Alias:</span>
                                            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">iyad.bbva</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-500">Tipo:</span>
                                            <span className="font-medium text-slate-700">Caja de Ahorro</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-500">Titular:</span>
                                            <span className="font-medium text-slate-700">Iyad Marmoud</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-3">
                                        📋 Una vez realizada la transferencia, presiona el botón para notificarnos.
                                    </p>

                                    {/* Notify Payment Button */}
                                    <div className="mt-4">
                                        {!paymentNotified ? (
                                            <button
                                                onClick={async () => {
                                                    setNotifyingPayment(true);
                                                    try {
                                                        const res = await fetch('/api/company/notify-payment', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                type: 'premium',
                                                                amount: subscription?.amount || 15000,
                                                                companyName: companyName
                                                            })
                                                        });
                                                        if (res.ok) {
                                                            setPaymentNotified(true);
                                                            alert('✅ Notificación enviada al administrador. Revisaremos tu transferencia pronto.');
                                                        } else {
                                                            const data = await res.json();
                                                            alert(`Error: ${data.error || 'Error al notificar'}`);
                                                        }
                                                    } catch (error) {
                                                        console.error('Error notifying payment:', error);
                                                        alert('Error de conexión');
                                                    } finally {
                                                        setNotifyingPayment(false);
                                                    }
                                                }}
                                                disabled={notifyingPayment}
                                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                            >
                                                {notifyingPayment ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    '📩 Ya realicé la transferencia'
                                                )}
                                            </button>
                                        ) : (
                                            <div className="w-full py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-center border border-emerald-300">
                                                ✅ Notificación enviada
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4 border border-amber-200">
                        👑 Planes de Suscripción
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
                        Potencia tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">Reclutamiento</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Accede a herramientas de Inteligencia Artificial para encontrar los mejores candidatos de forma más rápida y eficiente.
                    </p>

                    {/* Info Cards - Transformed from FAQ */}
                    <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto text-left">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md">
                                🔍
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2">Análisis de CV con IA</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Nuestra IA analiza automáticamente los CVs, extrae habilidades, experiencia y educación, generando un resumen profesional para facilitar tu evaluación.
                            </p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md">
                                🎯
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2">Búsqueda de Talento Inteligente</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Con un solo clic, la IA compara candidatos con tu oferta de empleo y te muestra el mejor match con un puntaje de compatibilidad.
                            </p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md">
                                ✨
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2">Sin Compromiso</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Cancela tu suscripción Premium en cualquier momento. Mantendrás el acceso hasta el final de tu período de facturación.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Plans Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-transform hover:scale-[1.02] ${plan.highlighted
                                    ? "border-amber-400 ring-4 ring-amber-100"
                                    : "border-slate-200"
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-center py-2 text-sm font-bold">
                                        ⭐ RECOMENDADO
                                    </div>
                                )}

                                <div className={`p-8 ${plan.highlighted ? "pt-14" : ""}`}>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                        <span className="text-slate-500 ml-2">{plan.priceNote}</span>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-slate-700">
                                                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                        {plan.notIncluded.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-slate-400 line-through">
                                                <span className="font-bold mt-0.5">✕</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    {plan.id === 'premium' && companyPlan === 'premium' ? (
                                        <div className="w-full px-6 py-3 bg-emerald-100 text-emerald-700 font-bold rounded-xl text-center border-2 border-emerald-300">
                                            ✓ Tu Plan Actual
                                        </div>
                                    ) : plan.id === 'premium' && subscription?.status === 'pending' ? (
                                        <div className="w-full px-6 py-3 bg-amber-100 text-amber-700 font-bold rounded-xl text-center border-2 border-amber-300">
                                            ⏳ Pago Pendiente
                                        </div>
                                    ) : plan.highlighted ? (
                                        <button
                                            onClick={handleSubscribe}
                                            disabled={subscribing}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {subscribing ? '⏳ Procesando...' : '✨ Suscribirme a Premium'}
                                        </button>
                                    ) : plan.id === 'basic' && companyPlan === 'basic' && !subscription ? (
                                        <div className="w-full px-6 py-3 bg-slate-100 text-slate-600 font-medium rounded-xl text-center border-2 border-slate-200">
                                            Tu Plan Actual
                                        </div>
                                    ) : (
                                        <div className="w-full px-6 py-3 border-2 border-slate-200 text-slate-500 font-medium rounded-xl text-center">
                                            Plan Gratuito
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}



                {/* Contact */}
                <div className="mt-12 text-center">
                    <p className="text-slate-500">
                        ¿Tienes dudas? <a href="/contacto" className="text-blue-600 font-medium hover:underline">Contáctanos</a>
                    </p>
                </div>
            </main>
        </div>
    );
}
