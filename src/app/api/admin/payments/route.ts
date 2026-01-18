import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: List all payments
export async function GET() {
    try {
        const payments = await prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                jobPosting: {
                    select: {
                        id: true,
                        title: true,
                        company: true,
                        companyUser: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        return NextResponse.json({ error: 'Error al obtener pagos' }, { status: 500 });
    }
}
