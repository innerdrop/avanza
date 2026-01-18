
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const payment = await prisma.payment.findUnique({
            where: { id },
            include: { jobPosting: true }
        });

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        if (payment.status === 'completed') {
            return NextResponse.json({ message: 'Payment already completed' });
        }

        // Extract days from externalId (format: "featured_X_days")
        let durationDays = 30; // Default fallback
        if (payment.externalId) {
            const match = payment.externalId.match(/featured_(\d+)_days/);
            if (match) {
                durationDays = parseInt(match[1]);
            }
        }

        // Calculate expiration date based on purchased days
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + durationDays);

        const [updatedPayment, updatedJob] = await prisma.$transaction([
            prisma.payment.update({
                where: { id },
                data: { status: 'completed' }
            }),
            prisma.jobPosting.update({
                where: { id: payment.jobPostingId },
                data: {
                    isFeatured: true,
                    featuredExpiresAt: expirationDate
                }
            })
        ]);

        return NextResponse.json({
            message: 'Payment confirmed and job featured',
            payment: updatedPayment,
            job: updatedJob
        });

    } catch (error) {
        console.error('Error confirming payment:', error);
        return NextResponse.json(
            { error: 'Error confirming payment' },
            { status: 500 }
        );
    }
}
