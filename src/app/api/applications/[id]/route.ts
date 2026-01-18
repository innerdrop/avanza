import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        const body = await request.json();

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            );
        }

        if (!body.status) {
            return NextResponse.json(
                { error: 'Status es requerido' },
                { status: 400 }
            );
        }

        const application = await prisma.application.update({
            where: { id },
            data: { status: body.status }
        });

        return NextResponse.json(application);
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json(
            { error: 'Error updating application' },
            { status: 500 }
        );
    }
}
// DELETE: Delete application
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        await prisma.application.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Application deleted' });
    } catch (error) {
        console.error('Error deleting application:', error);
        return NextResponse.json(
            { error: 'Error deleting application' },
            { status: 500 }
        );
    }
}
