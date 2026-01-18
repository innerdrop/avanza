import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: List all premium subscriptions for admin
export async function GET() {
    try {
        const subscriptions = await prisma.premiumSubscription.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        plan: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return NextResponse.json({ error: 'Error al obtener suscripciones' }, { status: 500 });
    }
}
