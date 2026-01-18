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

// Helper to verify application belongs to company
async function verifyApplicationOwnership(applicationId: number, companyUserId: number): Promise<boolean> {
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
            jobPosting: {
                select: { companyUserId: true }
            }
        }
    });

    if (!application?.jobPosting) {
        return false;
    }

    return (application.jobPosting as any).companyUserId === companyUserId;
}

// PATCH: Update application status
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const companyUserId = await getCompanyUserId();

        if (!companyUserId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id: idString } = await params;
        const id = parseInt(idString);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        // Verify ownership
        const isOwner = await verifyApplicationOwnership(id, companyUserId);
        if (!isOwner) {
            return NextResponse.json({ error: 'No autorizado para modificar esta postulación' }, { status: 403 });
        }

        const body = await request.json();

        if (!body.status) {
            return NextResponse.json({ error: 'Status es requerido' }, { status: 400 });
        }

        const application = await prisma.application.update({
            where: { id },
            data: { status: body.status }
        });

        return NextResponse.json(application);
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: 'Error al actualizar postulación' }, { status: 500 });
    }
}

// DELETE: Delete application
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const companyUserId = await getCompanyUserId();

        if (!companyUserId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id: idString } = await params;
        const id = parseInt(idString);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        // Verify ownership
        const isOwner = await verifyApplicationOwnership(id, companyUserId);
        if (!isOwner) {
            return NextResponse.json({ error: 'No autorizado para eliminar esta postulación' }, { status: 403 });
        }

        await prisma.application.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Postulación eliminada' });
    } catch (error) {
        console.error('Error deleting application:', error);
        return NextResponse.json({ error: 'Error al eliminar postulación' }, { status: 500 });
    }
}
