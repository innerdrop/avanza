
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeCVText } from '@/lib/ai';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        if (typeof DOMMatrix === 'undefined') {
            (global as any).DOMMatrix = class DOMMatrix {
                constructor() { }
            };
        }
        const pdf = require('pdf-parse/lib/pdf-parse.js');
        const { applicationId } = await request.json();

        // 1. Get Application
        const application = await prisma.application.findUnique({
            where: { id: parseInt(applicationId) },
        });

        if (!application || !application.cvUrl) {
            return NextResponse.json({ error: 'Application or CV not found' }, { status: 404 });
        }

        // 2. Locate File
        // Assuming cvUrl is absolute or relative to public.
        // If stored in public/uploads for example.
        // We need to resolve the local filesystem path.
        // Example URL: /uploads/cv-123.pdf -> c:\modotrabajo\public\uploads\cv-123.pdf

        // Fix: If url starts with http, we might need to fetch it. 
        // But for this local setup, let's assume local file access if possible, or fetch if it is a URL.
        // For simplicity in this demo environment, let's assume it is served from public folder.

        let text = "";

        if (application.cvUrl.startsWith('http')) {
            const res = await fetch(application.cvUrl);
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const pdfData = await pdf(buffer);
            text = pdfData.text;
        } else {
            // Local file path assumption
            const publicPath = path.join(process.cwd(), 'public');
            // Remove leading slash if present
            const relativePath = application.cvUrl.startsWith('/') ? application.cvUrl.slice(1) : application.cvUrl;
            const filePath = path.join(publicPath, relativePath);

            if (fs.existsSync(filePath)) {
                const dataBuffer = fs.readFileSync(filePath);
                const pdfData = await pdf(dataBuffer);
                text = pdfData.text;
            } else {
                return NextResponse.json({ error: 'CV file not found on server' }, { status: 404 });
            }
        }

        // 3. Analyze with AI
        const analysisResult = await analyzeCVText(text);

        // 4. Save to DB
        // Check if analysis already exists
        const existingAnalysis = await prisma.cVAnalysis.findUnique({
            where: { applicationId: parseInt(applicationId) },
        });

        let savedAnalysis;
        if (existingAnalysis) {
            savedAnalysis = await prisma.cVAnalysis.update({
                where: { applicationId: parseInt(applicationId) },
                data: {
                    fullName: analysisResult.fullName,
                    dni: analysisResult.dni,
                    location: analysisResult.location,
                    maritalStatus: analysisResult.maritalStatus,
                    phone: analysisResult.phone,
                    email: analysisResult.email,
                    hasPrimaryEducation: analysisResult.hasPrimaryEducation,
                    hasSecondaryEducation: analysisResult.hasSecondaryEducation,
                    hasTertiaryEducation: analysisResult.hasTertiaryEducation,
                    hasUniversityEducation: analysisResult.hasUniversityEducation,
                    universityTitle: analysisResult.universityTitle,
                    knowledge: analysisResult.knowledge,
                    professionalSummary: analysisResult.professionalSummary,
                    skills: analysisResult.skills, // Inferred skills
                    yearsOfExperience: analysisResult.yearsOfExperience,
                    education: analysisResult.education,
                    workExperience: analysisResult.workExperience,
                    languages: analysisResult.languages,
                    rawResponse: JSON.stringify(analysisResult),
                }
            });
        } else {
            savedAnalysis = await prisma.cVAnalysis.create({
                data: {
                    applicationId: parseInt(applicationId),
                    fullName: analysisResult.fullName,
                    dni: analysisResult.dni,
                    location: analysisResult.location,
                    maritalStatus: analysisResult.maritalStatus,
                    phone: analysisResult.phone,
                    email: analysisResult.email,
                    hasPrimaryEducation: analysisResult.hasPrimaryEducation,
                    hasSecondaryEducation: analysisResult.hasSecondaryEducation,
                    hasTertiaryEducation: analysisResult.hasTertiaryEducation,
                    hasUniversityEducation: analysisResult.hasUniversityEducation,
                    universityTitle: analysisResult.universityTitle,
                    knowledge: analysisResult.knowledge,
                    professionalSummary: analysisResult.professionalSummary,
                    skills: analysisResult.skills, // Inferred skills
                    yearsOfExperience: analysisResult.yearsOfExperience,
                    education: analysisResult.education,
                    workExperience: analysisResult.workExperience,
                    languages: analysisResult.languages,
                    rawResponse: JSON.stringify(analysisResult),
                }
            });
        }

        return NextResponse.json(savedAnalysis);

    } catch (error: any) {
        console.error('Analysis Error:', error);
        return NextResponse.json({ error: error.message || 'Error processing CV' }, { status: 500 });
    }
}
