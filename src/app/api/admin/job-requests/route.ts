import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/email';

// Helper to verify admin session
async function isAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    return authToken === 'admin_session';
}

// GET: List all pending job requests
export async function GET() {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const pendingJobs = await prisma.jobPosting.findMany({
            where: { status: 'pending' },
            orderBy: { createdAt: 'desc' },
            include: {
                companyUser: {
                    select: { id: true, email: true, name: true }
                }
            } as any
        });

        return NextResponse.json(pendingJobs);
    } catch (error) {
        console.error('Error fetching pending jobs:', error);
        return NextResponse.json({ error: 'Error al obtener solicitudes' }, { status: 500 });
    }
}

// PATCH: Approve or reject a job request
export async function PATCH(request: Request) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { jobId, action } = body; // action: 'approve' or 'reject'

        if (!jobId || !['approve', 'reject'].includes(action)) {
            return NextResponse.json(
                { error: 'Parámetros inválidos' },
                { status: 400 }
            );
        }

        const newStatus = action === 'approve' ? 'active' : 'rejected';

        const job = await prisma.jobPosting.update({
            where: { id: jobId },
            data: { status: newStatus },
            include: {
                companyUser: {
                    select: { email: true, name: true }
                }
            } as any
        });

        // Notify company about the decision
        if ((job as any).companyUser?.email) {
            const isApproved = action === 'approve';
            const subject = isApproved
                ? `¡Tu anuncio "${job.title}" ha sido aprobado!`
                : `Actualización sobre tu anuncio "${job.title}"`;

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                    <div style="text-align: right; margin-bottom: 20px;">
                        <img src="cid:logo" alt="Logo" style="width: 50px; height: auto;">
                    </div>
                    <h2 style="color: ${isApproved ? '#28a745' : '#dc3545'};">
                        ${isApproved ? '¡Anuncio Aprobado!' : 'Anuncio No Aprobado'}
                    </h2>
                    <p>Hola ${(job as any).companyUser.name || 'Empresa'},</p>
                    <p>Tu solicitud de publicación para el puesto <strong>"${job.title}"</strong> ha sido ${isApproved ? 'aprobada' : 'rechazada'}.</p>
                    ${isApproved
                    ? '<p>Tu anuncio ya está visible en nuestra plataforma y los candidatos pueden postularse.</p>'
                    : '<p>Si tienes preguntas, por favor contáctanos para más información.</p>'
                }
                    <br>
                    <hr>
                    <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Avanza Fueguino</p>
                </div>
            `;

            sendEmail((job as any).companyUser.email, subject, emailHtml).catch(err => {
                console.error('Failed to send company notification:', err);
            });
        }

        return NextResponse.json({ success: true, job });
    } catch (error) {
        console.error('Error updating job status:', error);
        return NextResponse.json({ error: 'Error al actualizar el empleo' }, { status: 500 });
    }
}
