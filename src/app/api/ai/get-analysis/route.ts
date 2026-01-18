
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
        return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 });
    }

    try {
        const analysis = await prisma.cVAnalysis.findUnique({
            where: { applicationId: parseInt(applicationId) },
        });

        return NextResponse.json(analysis); // Returns null if not found, which is fine
    } catch (error) {
        console.error('Error fetching analysis:', error);
        return NextResponse.json({ error: 'Error fetching analysis' }, { status: 500 });
    }
}
