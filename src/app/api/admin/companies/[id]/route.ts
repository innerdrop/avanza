import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

async function isAdmin() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    return authToken === 'admin_session';
}

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    if (!await isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const params = await props.params;
    try {
        const company = await prisma.user.findFirst({
            where: { id: parseInt(params.id), role: 'company' },
            select: {
                id: true,
                name: true,
                email: true,
                jobPostings: {
                    include: {
                        _count: {
                            select: { applications: true }
                        }
                    }
                }
            } as any
        });
        return NextResponse.json(company);
    } catch (error) {
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
    if (!await isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const params = await props.params;
    try {
        const body = await request.json();
        const updated = await prisma.user.update({
            where: { id: parseInt(params.id) },
            data: {
                name: body.name,
                email: body.email
            }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    if (!await isAdmin()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const params = await props.params;
    try {
        // First delete job postings associated (Prisma client will handle cascade if configured, but let's be safe)
        await prisma.jobPosting.deleteMany({
            where: { companyUserId: parseInt(params.id) }
        } as any);

        await prisma.user.delete({
            where: { id: parseInt(params.id) }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
