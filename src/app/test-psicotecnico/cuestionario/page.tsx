
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';


const questions = [
    // Liderazgo
    { id: 1, category: 'Liderazgo', text: 'Suelo tomar la iniciativa cuando hay un problema en el grupo.' },
    { id: 2, category: 'Liderazgo', text: 'Me siento cómodo dirigiendo a otras personas.' },
    { id: 3, category: 'Liderazgo', text: 'Disfruto motivando a mis compañeros para alcanzar metas.' },
    // Trabajo en Equipo
    { id: 4, category: 'Equipo', text: 'Prefiero trabajar en grupo que hacerlo solo.' },
    { id: 5, category: 'Equipo', text: 'Considero que las decisiones grupales son mejores que las individuales.' },
    { id: 6, category: 'Equipo', text: 'Me adapto fácilmente a diferentes roles dentro de un equipo.' },
    // Organización
    { id: 7, category: 'Organización', text: 'Planifico mis tareas antes de empezar a trabajar.' },
    { id: 8, category: 'Organización', text: 'Soy muy detallista con los plazos y horarios.' },
    { id: 9, category: 'Organización', text: 'Mantengo mi espacio de trabajo ordenado.' },
    // Creatividad
    { id: 10, category: 'Creatividad', text: 'Me gusta proponer soluciones innovadoras a problemas viejos.' },
    { id: 11, category: 'Creatividad', text: 'A menudo pienso "fuera de la caja".' },
    { id: 12, category: 'Creatividad', text: 'Disfruto más creando cosas nuevas que siguiendo procedimientos establecidos.' },
];

export default function CuestionarioPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [userData, setUserData] = useState({ nombre: '', email: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAnswer = (value: number) => {
        setAnswers({ ...answers, [questions[currentStep].id]: value });
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setCurrentStep(questions.length); // Move to data collection step
        }
    };

    const calculateResults = () => {
        const scores = { Liderazgo: 0, Equipo: 0, Organización: 0, Creatividad: 0 };
        questions.forEach(q => {
            const score = answers[q.id] || 0;
            // @ts-ignore
            scores[q.category] += score;
        });

        // Normalize to 0-100 (score is 1-5, so max is 15 per category)
        Object.keys(scores).forEach(key => {
            // @ts-ignore
            scores[key] = Math.round((scores[key] / 15) * 100);
        });

        return scores;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const calculatedScores = calculateResults();

        // Determine main profile
        const profile = Object.entries(calculatedScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];

        const payload = {
            nombre: userData.nombre,
            email: userData.email,
            respuestas: answers,
            resultado: {
                scores: calculatedScores,
                profile: profile
            }
        };

        try {
            const res = await fetch('/api/psychometric', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // Encode result to pass to result page (or just ID if we wanted to fetch it, but lets pass via localStorage or URL)
                // Ideally we redirect to /resultados?id=... but for simplicity and privacy let's use localStorage
                localStorage.setItem('lastTestResult', JSON.stringify(payload));
                router.push('/test-psicotecnico/resultados');
            } else {
                alert('Hubo un error al guardar tus resultados. Por favor intenta nuevamente.');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (currentStep / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">

            <main className="flex-grow container !pt-28 !sm:pt-32 pb-20 px-4 sm:px-0">
                <div className="max-w-2xl mx-auto">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                        <div className="bg-[var(--primary)] h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="bento-card bg-white p-8 sm:p-12 min-h-[400px] flex flex-col justify-center animate-in">
                        {currentStep < questions.length ? (
                            <>
                                <span className="text-[var(--primary)] font-medium mb-4 block text-center">Pregunta {currentStep + 1} de {questions.length}</span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-[var(--text-primary)]">
                                    {questions[currentStep].text}
                                </h2>

                                <div className="grid gap-4">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            onClick={() => handleAnswer(value)}
                                            className={`w-full text-left px-6 py-4 rounded-xl border transition-all font-medium flex justify-between items-center group
                                            ${answers[questions[currentStep].id] === value
                                                    ? 'border-[var(--primary)] bg-blue-50 text-[var(--primary)]'
                                                    : 'border-[var(--border-light)] hover:border-[var(--primary)] hover:bg-blue-50 text-[var(--text-secondary)] hover:text-[var(--primary)]'}`}
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform">
                                                {value === 1 && "Muy en desacuerdo"}
                                                {value === 2 && "En desacuerdo"}
                                                {value === 3 && "Neutral"}
                                                {value === 4 && "De acuerdo"}
                                                {value === 5 && "Muy de acuerdo"}
                                            </span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                                ${answers[questions[currentStep].id] === value ? 'border-[var(--primary)]' : 'border-[var(--border-light)] group-hover:border-[var(--primary)]'}`}>
                                                <div className={`w-3 h-3 rounded-full bg-[var(--primary)] transition-opacity ${answers[questions[currentStep].id] === value ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={!answers[questions[currentStep].id]}
                                    className="mt-8 w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Siguiente
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit} className="text-center">
                                <h2 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">¡Casi terminamos!</h2>
                                <p className="text-[var(--text-secondary)] mb-8">Ingresa tus datos para generar tu informe de perfil laboral.</p>

                                <div className="space-y-4 mb-8 text-left">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Nombre Completo</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-white text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                                            value={userData.nombre}
                                            onChange={e => setUserData({ ...userData, nombre: e.target.value })}
                                            placeholder="Ej: Juan Pérez"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-white text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                                            value={userData.email}
                                            onChange={e => setUserData({ ...userData, email: e.target.value })}
                                            placeholder="Ej: juan@email.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary w-full text-white text-lg py-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Generando Informe...' : 'Ver Resultados'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>

        </div>
    );
}
