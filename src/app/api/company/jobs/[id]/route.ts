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

// Helper to verify job belongs to company
async function verifyJobOwnership(jobId: number, companyUserId: number): Promise<boolean> {
    const job = await prisma.jobPosting.findUnique({
        where: { id: jobId },
        select: { companyUserId: true }
    });

    return (job as any)?.companyUserId === companyUserId;
}

// GET: Get a single job posting
export async function GET(
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
        const isOwner = await verifyJobOwnership(id, companyUserId);
        if (!isOwner) {
            return NextResponse.json({ error: 'No autorizado para ver este empleo' }, { status: 403 });
        }

        const job = await prisma.jobPosting.findUnique({
            where: { id },
            include: {
                _count: { select: { applications: true } }
            }
        });

        return NextResponse.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        return NextResponse.json({ error: 'Error al obtener empleo' }, { status: 500 });
    }
}

// PATCH: Update job posting
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
        const isOwner = await verifyJobOwnership(id, companyUserId);
        if (!isOwner) {
            return NextResponse.json({ error: 'No autorizado para modificar este empleo' }, { status: 403 });
        }

        const body = await request.json();

        // Only allow updating certain fields (not status - admin controls that)
        const allowedFields = ['title', 'company', 'location', 'type', 'description',
            'requirements', 'responsibilities', 'benefits', 'salary'];

        const updateData: any = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        const job = await prisma.jobPosting.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(job);
    } catch (error) {
        console.error('Error updating job:', error);
        return NextResponse.json({ error: 'Error al actualizar empleo' }, { status: 500 });
    }
}

// DELETE: Delete job posting
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
        const isOwner = await verifyJobOwnership(id, companyUserId);
        if (!isOwner) {
            return NextResponse.json({ error: 'No autorizado para eliminar este empleo' }, { status: 403 });
        }

        await prisma.jobPosting.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Empleo eliminado' });
    } catch (error) {
        console.error('Error deleting job:', error);
        return NextResponse.json({ error: 'Error al eliminar empleo' }, { status: 500 });
    }
}
