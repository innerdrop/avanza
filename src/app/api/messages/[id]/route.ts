
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH: Mark as read
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updated = await prisma.contactMessage.update({
            where: { id: parseInt(id) },
            data: { isRead: body.isRead },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating message' }, { status: 500 });
    }
}

// DELETE: Remove message
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.contactMessage.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting message' }, { status: 500 });
    }
}
