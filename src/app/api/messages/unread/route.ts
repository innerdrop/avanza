
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const count = await prisma.contactMessage.count({
            where: {
                isRead: false
            }
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error('Error counting unread messages:', error);
        return NextResponse.json({ error: 'Error al contar mensajes no leídos' }, { status: 500 });
    }
}
