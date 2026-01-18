import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Get single advertisement
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const advertisement = await prisma.advertisement.findUnique({
            where: { id: parseInt(id) }
        });

        if (!advertisement) {
            return NextResponse.json({ error: 'Anuncio no encontrado' }, { status: 404 });
        }

        return NextResponse.json(advertisement);
    } catch (error) {
        console.error('Error fetching advertisement:', error);
        return NextResponse.json({ error: 'Error al obtener anuncio' }, { status: 500 });
    }
}

// PATCH: Update advertisement
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // If level or days changed, recalculate price
        if (body.level || body.daysContracted) {
            const pricePerDayMap: { [key: number]: number } = {
                1: 4000,
                2: 3000,
                3: 2000
            };

            const current = await prisma.advertisement.findUnique({
                where: { id: parseInt(id) }
            });

            if (current) {
                const level = body.level || current.level;
                const days = body.daysContracted || current.daysContracted;
                body.pricePerDay = pricePerDayMap[level] || 2000;
                body.totalPrice = body.pricePerDay * days;
            }
        }

        // Convert date strings to Date objects
        if (body.startDate) body.startDate = new Date(body.startDate);
        if (body.endDate) body.endDate = new Date(body.endDate);

        const advertisement = await prisma.advertisement.update({
            where: { id: parseInt(id) },
            data: body
        });

        return NextResponse.json(advertisement);
    } catch (error) {
        console.error('Error updating advertisement:', error);
        return NextResponse.json({ error: 'Error al actualizar anuncio' }, { status: 500 });
    }
}

// DELETE: Delete advertisement
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.advertisement.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting advertisement:', error);
        return NextResponse.json({ error: 'Error al eliminar anuncio' }, { status: 500 });
    }
}
