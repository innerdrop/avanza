
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export async function analyzeCVText(text: string) {
    if (!apiKey) {
        throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
    }

    const prompt = `
    Actúa como un asistente experto en RRHH. Tu tarea es analizar el siguiente texto de un CV y extraer información estructurada en ESPAÑOL.
    
    Analiza profundamente el contenido. No te limites solo a extraer texto, INFIERE habilidades blandas y técnicas basadas en la experiencia laboral descrita (ej: si trabajó de mesero, inferir "Atención al cliente", "Trabajo bajo presión", etc.).

    Devuelve un JSON VÁLIDO con la siguiente estructura exacta (sin markdown):
    {
        "fullName": "Nombre completo del candidato",
        "dni": "DNI o documento de identidad si aparece, sino null",
        "location": "Ciudad/Provincia/País, sino null",
        "maritalStatus": "Estado civil si aparece, sino null",
        "phone": "Número de teléfono, sino null",
        "email": "Email, sino null",
        "hasPrimaryEducation": boolean,
        "hasSecondaryEducation": boolean,
        "hasTertiaryEducation": boolean,
        "hasUniversityEducation": boolean,
        "universityTitle": "Título universitario específico, sino null",
        "knowledge": ["Conocimiento técnico explícito 1", "Herramienta 2", ...],
        "skills": ["Habilidad inferida 1", "Habilidad inferida 2", ...],
        "professionalSummary": "Resumen profesional conciso (max 300 caracteres)",
        "yearsOfExperience": numero (estimado total de años),
        "education": "Resumen breve de la educación más relevante",
        "workExperience": "Resumen breve de la experiencia más relevante",
        "languages": ["Idioma 1", "Idioma 2", ...]
    }

    Si un campo booleano no se menciona explícitamente pero se infiere que lo tiene (ej: si tiene universidad, tiene secundaria), márcalo como true.
    
    TEXTO DEL CV:
    ${text}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean markdown if present (```json ... ```)
        const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw error;
    }
}
