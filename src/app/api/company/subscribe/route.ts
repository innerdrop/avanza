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

        // Calculate remaining days if subscription is being cancelled
        let remainingDays = null;
        let subscriptionEndsAt = null;

        if (subscription?.status === 'completed' && subscription?.confirmedAt) {
            // Subscription lasts 30 days from confirmation
            const endDate = new Date(subscription.confirmedAt);
            endDate.setDate(endDate.getDate() + 30);
            subscriptionEndsAt = endDate.toISOString();

            const now = new Date();
            const diffTime = endDate.getTime() - now.getTime();
            remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // If subscription has expired, update status
            if (remainingDays <= 0 && subscription.cancelledAt) {
                await prisma.premiumSubscription.update({
                    where: { id: subscription.id },
                    data: { status: 'cancelled' }
                });
                // Downgrade user plan
                await prisma.user.update({
                    where: { id: companyUserId },
                    data: { plan: 'basic' }
                });
                return NextResponse.json({
                    subscription: { ...subscription, status: 'cancelled' },
                    remainingDays: 0,
                    subscriptionEndsAt
                });
            }
        }

        return NextResponse.json({ subscription, remainingDays, subscriptionEndsAt });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json({ error: 'Error al obtener suscripción' }, { status: 500 });
    }
}

// DELETE: Cancel subscription (will remain active until end of period)
export async function DELETE() {
    try {
        const companyUserId = await getCompanyUserId();

        if (!companyUserId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const subscription = await prisma.premiumSubscription.findUnique({
            where: { userId: companyUserId }
        });

        if (!subscription) {
            return NextResponse.json({ error: 'No tienes suscripción activa' }, { status: 404 });
        }

        if (subscription.status !== 'completed') {
            return NextResponse.json({ error: 'Solo puedes cancelar suscripciones activas' }, { status: 400 });
        }

        if (subscription.cancelledAt) {
            return NextResponse.json({ error: 'La suscripción ya está programada para cancelarse' }, { status: 400 });
        }

        // Mark as cancelled but keep active until period ends
        const updated = await prisma.premiumSubscription.update({
            where: { id: subscription.id },
            data: { cancelledAt: new Date() }
        });

        // Calculate remaining days - use confirmedAt if available, otherwise use createdAt
        const startDate = subscription.confirmedAt ? new Date(subscription.confirmedAt) : new Date(subscription.createdAt);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 30);
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        return NextResponse.json({
            message: 'Suscripción cancelada. Seguirás teniendo acceso Premium hasta que termine tu período.',
            subscription: updated,
            remainingDays,
            subscriptionEndsAt: endDate.toISOString()
        });
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return NextResponse.json({ error: 'Error al cancelar suscripción' }, { status: 500 });
    }
}
