import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST: Confirm premium subscription payment
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const subscriptionId = parseInt(id);

        if (isNaN(subscriptionId)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const subscription = await prisma.premiumSubscription.findUnique({
            where: { id: subscriptionId }
        });

        if (!subscription) {
            return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 });
        }

        if (subscription.status === 'completed') {
            return NextResponse.json({ error: 'Esta suscripción ya fue confirmada' }, { status: 400 });
        }

        // Update subscription status and user plan in transaction
        await prisma.$transaction([
            prisma.premiumSubscription.update({
                where: { id: subscriptionId },
                data: {
                    status: 'completed',
                    confirmedAt: new Date()
                }
            }),
            prisma.user.update({
                where: { id: subscription.userId },
                data: { plan: 'premium' }
            })
        ]);

        return NextResponse.json({
            success: true,
            message: 'Suscripción Premium activada exitosamente'
        });
    } catch (error) {
        console.error('Error confirming subscription:', error);
        return NextResponse.json({ error: 'Error al confirmar suscripción' }, { status: 500 });
    }
}
