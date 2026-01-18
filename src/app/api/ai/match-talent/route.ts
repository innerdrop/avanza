import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { model } from '@/lib/ai';

export async function POST(request: Request) {
    try {
        const { jobId } = await request.json();

        if (!jobId) {
            return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
        }

        // Get the job posting details
        const job = await prisma.jobPosting.findUnique({
            where: { id: parseInt(jobId) }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // Get all analyzed talents
        const talents = await prisma.cVAnalysis.findMany({
            include: {
                application: {
                    select: {
                        id: true,
                        cvUrl: true,
                    }
                }
            }
        });

        if (talents.length === 0) {
            return NextResponse.json({
                error: 'No hay talentos en la base de datos para comparar'
            }, { status: 404 });
        }

        // Prepare talent summaries for AI analysis
        const talentSummaries = talents.map((t, index) => ({
            index,
            id: t.id,
            fullName: t.fullName,
            location: t.location,
            universityTitle: t.universityTitle,
            education: {
                primary: t.hasPrimaryEducation,
                secondary: t.hasSecondaryEducation,
                tertiary: t.hasTertiaryEducation,
                university: t.hasUniversityEducation
            },
            knowledge: t.knowledge,
            skills: t.skills,
            professionalSummary: t.professionalSummary
        }));

        // Parse job requirements
        let requirements: string[] = [];
        let responsibilities: string[] = [];
        try {
            requirements = JSON.parse(job.requirements);
        } catch { requirements = [job.requirements]; }
        try {
            responsibilities = JSON.parse(job.responsibilities);
        } catch { responsibilities = [job.responsibilities]; }

        // Create AI prompt for matching
        const prompt = `
Eres un experto en RRHH. Tu tarea es analizar un puesto de trabajo y una lista de candidatos para encontrar el MEJOR match.

PUESTO DE TRABAJO:
- Título: ${job.title}
- Empresa: ${job.company}
- Ubicación: ${job.location}
- Tipo: ${job.type}
- Descripción: ${job.description}
- Requisitos: ${requirements.join(', ')}
- Responsabilidades: ${responsibilities.join(', ')}

LISTA DE CANDIDATOS (${talentSummaries.length} en total):
${JSON.stringify(talentSummaries, null, 2)}

INSTRUCCIONES:
1. Analiza cada candidato comparando sus conocimientos, habilidades y experiencia con los requisitos del puesto
2. Considera la ubicación como factor (preferencia a candidatos de la misma ciudad/provincia)
3. El nivel educativo debe ser adecuado para el puesto
4. Devuelve SOLO un JSON válido (sin markdown) con esta estructura:

{
    "bestMatchIndex": número del índice del mejor candidato,
    "matchScore": porcentaje de compatibilidad (0-100),
    "matchReasons": ["razón 1", "razón 2", "razón 3"],
    "missingRequirements": ["requisito faltante 1", "requisito faltante 2"],
    "recommendation": "Breve recomendación de contratación (max 200 caracteres)"
}

IMPORTANTE: Responde SOLO con el JSON, sin texto adicional ni bloques de código.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean markdown if present
        const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiResult = JSON.parse(cleanedText);

        // Get the matched talent
        const matchedTalent = talents[aiResult.bestMatchIndex];

        if (!matchedTalent) {
            return NextResponse.json({
                error: 'No se pudo determinar un candidato adecuado'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            match: {
                talent: {
                    id: matchedTalent.id,
                    fullName: matchedTalent.fullName,
                    location: matchedTalent.location,
                    phone: matchedTalent.phone,
                    email: matchedTalent.email,
                    dni: matchedTalent.dni,
                    maritalStatus: matchedTalent.maritalStatus,
                    universityTitle: matchedTalent.universityTitle,
                    education: {
                        primary: matchedTalent.hasPrimaryEducation,
                        secondary: matchedTalent.hasSecondaryEducation,
                        tertiary: matchedTalent.hasTertiaryEducation,
                        university: matchedTalent.hasUniversityEducation
                    },
                    knowledge: matchedTalent.knowledge,
                    skills: matchedTalent.skills,
                    cvUrl: matchedTalent.application?.cvUrl
                },
                matchScore: aiResult.matchScore,
                matchReasons: aiResult.matchReasons,
                missingRequirements: aiResult.missingRequirements,
                recommendation: aiResult.recommendation
            },
            job: {
                id: job.id,
                title: job.title,
                company: job.company
            }
        });

    } catch (error) {
        console.error('AI Talent Match Error:', error);
        return NextResponse.json({
            error: 'Error al procesar la búsqueda de talento'
        }, { status: 500 });
    }
}
