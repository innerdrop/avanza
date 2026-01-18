import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: List all advertisements
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const level = searchParams.get('level');
        const isActive = searchParams.get('isActive');

        const where: any = {};
        if (level) where.level = parseInt(level);
        if (isActive !== null) where.isActive = isActive === 'true';

        const advertisements = await prisma.advertisement.findMany({
            where,
            orderBy: [
                { level: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json(advertisements);
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        return NextResponse.json({ error: 'Error al obtener anuncios' }, { status: 500 });
    }
}

// POST: Create new advertisement
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            title,
            description,
            imageUrl,
            linkUrl,
            level,
            position,
            startDate,
            endDate,
            daysContracted,
            advertiserName,
            advertiserEmail,
            advertiserPhone,
            notes
        } = body;

        // Price per day based on level
        const pricePerDayMap: { [key: number]: number } = {
            1: 4000, // Premium
            2: 3000, // Destacado
            3: 2000  // Estándar
        };

        const pricePerDay = pricePerDayMap[level] || 2000;
        const days = daysContracted || 7;
        const totalPrice = pricePerDay * days;

        const advertisement = await prisma.advertisement.create({
            data: {
                title,
                description,
                imageUrl,
                linkUrl,
                level,
                position,
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : null,
                daysContracted: days,
                pricePerDay,
                totalPrice,
                advertiserName,
                advertiserEmail,
                advertiserPhone,
                notes,
                isActive: true
            }
        });

        return NextResponse.json(advertisement, { status: 201 });
    } catch (error) {
        console.error('Error creating advertisement:', error);
        return NextResponse.json({ error: 'Error al crear anuncio' }, { status: 500 });
    }
}
