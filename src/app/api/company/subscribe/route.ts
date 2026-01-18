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

// POST: Create pending subscription
export async function POST() {
    try {
        const companyUserId = await getCompanyUserId();

        if (!companyUserId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Check if already has pending or active subscription
        const existing = await prisma.premiumSubscription.findUnique({
            where: { userId: companyUserId }
        });

        if (existing) {
            if (existing.status === 'completed') {
                return NextResponse.json({
                    error: 'Ya tienes una suscripción Premium activa',
                    subscription: existing
                }, { status: 400 });
            }
            // Return existing pending subscription
            return NextResponse.json({
                message: 'Ya tienes una suscripción pendiente',
                subscription: existing
            });
        }

        // Create new pending subscription
        const subscription = await prisma.premiumSubscription.create({
            data: {
                userId: companyUserId,
                amount: 15000,
                status: 'pending'
            }
        });

        return NextResponse.json({
            message: 'Suscripción creada exitosamente',
            subscription
        });
    } catch (error) {
        console.error('Error creating subscription:', error);
        return NextResponse.json({ error: 'Error al crear suscripción' }, { status: 500 });
    }
}

// GET: Get current subscription status
export async function GET() {
    try {
        const companyUserId = await getCompanyUserId();

        if (!companyUserId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const subscription = await prisma.premiumSubscription.findUnique({
            where: { userId: companyUserId }
        });

        return NextResponse.json({ subscription });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json({ error: 'Error al obtener suscripción' }, { status: 500 });
    }
}
