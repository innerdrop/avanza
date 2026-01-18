
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const test = await prisma.psychometricTest.findUnique({
            where: { id },
        });

        if (!test) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        return NextResponse.json(test);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching test' }, { status: 500 });
    }
}
