import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Get active advertisements for public display
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const position = searchParams.get('position');

        const now = new Date();

        const where: any = {
            isActive: true,
            OR: [
                { startDate: null },
                { startDate: { lte: now } }
            ]
        };

        if (position) {
            where.position = position;
        }

        const advertisements = await prisma.advertisement.findMany({
            where,
            orderBy: [
                { level: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        // Filter out expired ads and increment impressions
        const activeAds = advertisements.filter(ad => {
            if (ad.endDate && new Date(ad.endDate) < now) {
                return false;
            }
            return true;
        });

        // Increment impressions for returned ads (fire and forget)
        activeAds.forEach(ad => {
            prisma.advertisement.update({
                where: { id: ad.id },
                data: { impressions: { increment: 1 } }
            }).catch(() => { }); // Ignore errors
        });

        return NextResponse.json(activeAds);
    } catch (error) {
        console.error('Error fetching public advertisements:', error);
        return NextResponse.json({ error: 'Error al obtener anuncios' }, { status: 500 });
    }
}

// POST: Track click
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
        }

        await prisma.advertisement.update({
            where: { id: parseInt(id) },
            data: { clicks: { increment: 1 } }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking click:', error);
        return NextResponse.json({ error: 'Error al registrar click' }, { status: 500 });
    }
}
