import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

async function isAdmin() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    return authToken === 'admin_session';
}

export async function GET() {
    if (!await isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    try {
        const companies = await prisma.user.findMany({
            where: { role: 'company' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: {
                    select: { jobPostings: true }
                }
            } as any
        });
        return NextResponse.json(companies);
    } catch (error) {
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
