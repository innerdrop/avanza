import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Helper to get company user ID from cookie
async function getCompanyUserId(): Promise<number | null> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const userRole = cookieStore.get('user_role')?.value;

    if (userRole !== 'company' || !authToken?.startsWith('company_')) {
        return null;
    }

    const userId = parseInt(authToken.replace('company_', ''));
    return isNaN(userId) ? null : userId;
}

// GET: Get company profile info
export async function GET() {
    try {
        const companyUserId = await getCompanyUserId();

        if (!companyUserId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const company = await prisma.user.findUnique({
            where: { id: companyUserId },
            select: {
                id: true,
                name: true,
                email: true,
                plan: true,
                createdAt: true
            }
        });

        if (!company) {
            return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });
        }

        return NextResponse.json(company);
    } catch (error) {
        console.error('Error fetching company profile:', error);
        return NextResponse.json({ error: 'Error al obtener perfil' }, { status: 500 });
    }
}
