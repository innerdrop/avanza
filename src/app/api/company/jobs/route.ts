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

// GET: List jobs created by the logged-in company
export async function GET() {
    try {
        const companyUserId = await getCompanyUserId();

        if (!companyUserId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const jobs = await prisma.jobPosting.findMany({
            where: { companyUserId } as any,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { applications: true }
                },
                payments: {
                    select: {
                        id: true,
                        status: true,
                        amount: true
                    }
                }
            }
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error('Error fetching company jobs:', error);
        return NextResponse.json({ error: 'Error al obtener empleos' }, { status: 500 });
    }
}

// POST: Create a new job posting (pending approval)
export async function POST(request: Request) {
    try {
        const companyUserId = await getCompanyUserId();

        if (!companyUserId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            location,
            type,
            description,
            requirements,
            responsibilities,
            benefits,
            salary,
            isFeatured,
            featuredDays
        } = body;

        const PRICE_PER_DAY = 2500;

        // Validate required fields
        if (!title || !location || !type || !description) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos' },
                { status: 400 }
            );
        }

        // Get company name from the logged-in user
        const companyUser = await prisma.user.findUnique({
            where: { id: companyUserId },
            select: { name: true, email: true, plan: true }
        });

        const companyName = companyUser?.name || 'Empresa';

        // Check job limit for non-premium companies
        const MAX_JOBS_FREE = 1;
        if (companyUser?.plan !== 'premium') {
            const existingJobsCount = await prisma.jobPosting.count({
                where: { companyUserId }
            });

            if (existingJobsCount >= MAX_JOBS_FREE) {
                return NextResponse.json(
                    {
                        error: 'Has alcanzado el límite de publicaciones gratuitas. Actualiza a Premium para publicar sin límites.',
                        code: 'JOB_LIMIT_REACHED'
                    },
                    { status: 403 }
                );
            }
        }

        const job = await prisma.jobPosting.create({
            data: {
                title,
                company: companyName,
                location,
                type,
                description,
                requirements: requirements || '[]',
                responsibilities: responsibilities || '[]',
                benefits: benefits || '[]',
                salary: salary || 'A convenir',
                isFeatured: isFeatured || false,
                status: 'pending',
                companyUserId
            } as any
        });

        // Notify admin about new job request with action buttons
        const emailHtml = `
            <h2>Nueva Solicitud de Publicación</h2>
            <p><strong>Empresa:</strong> ${companyName}</p>
            <p><strong>Puesto:</strong> ${title}</p>
            <p><strong>Ubicación:</strong> ${location}</p>
            <p><strong>Tipo:</strong> ${type}</p>
            <p><strong>Destacado:</strong> ${isFeatured ? 'Sí' : 'No'}</p>
            <p>Ingresa al panel de administración para revisar y aprobar esta solicitud.</p>
        `;

        const telegramText = `📋 <b>Nueva Solicitud de Publicación</b>\n\n<b>Empresa:</b> ${companyName}\n<b>Puesto:</b> ${title}\n<b>Ubicación:</b> ${location}\n<b>Tipo:</b> ${type}\n<b>Destacado:</b> ${isFeatured ? 'Sí' : 'No'}\n\n🆔 ID: #${job.id}`;

        // Import notifyAdminWithButtons for Telegram buttons
        const { notifyAdminWithButtons } = await import('@/lib/notifications');

        notifyAdminWithButtons(
            'Nueva Solicitud de Publicación',
            emailHtml,
            telegramText,
            [
                [
                    { text: '✓ Aprobar', callback_data: `job_approve_${job.id}` },
                    { text: '✗ Rechazar', callback_data: `job_reject_${job.id}` }
                ]
            ]
        ).catch(err => {
            console.error('Failed to send admin notification:', err);
        });

        // Send confirmation email to the Company

        if (companyUser?.email) {
            const companyEmailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                    <div style="text-align: right; margin-bottom: 20px;">
                        <img src="cid:logo" alt="Logo" style="width: 50px; height: auto;">
                    </div>
                    <h2 style="color: #007bff;">¡Recibimos tu búsqueda, ${companyUser.name || 'Empresa'}!</h2>
                    <p>Tu anuncio de empleo para el puesto de <strong>"${title}"</strong> ha sido recibido correctamente y se encuentra <strong>pendiente de revisión</strong>.</p>
                    <p>Nuestro equipo revisará los detalles y te notificaremos por este medio una vez que sea aprobado y esté visible en la plataforma.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Resumen del anuncio:</strong></p>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                            <li><strong>Puesto:</strong> ${title}</li>
                            <li><strong>Empresa:</strong> ${companyName}</li>
                            <li><strong>Ubicación:</strong> ${location}</li>
                            <li><strong>Tipo:</strong> ${type}</li>
                        </ul>
                    </div>
                    <p>Puedes seguir el estado de tus publicaciones desde tu panel de control.</p>
                    <br>
                    <hr>
                    <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Moovy Jobs</p>
                </div>
            `;

            const { sendEmail } = await import('@/lib/email');
            sendEmail(companyUser.email, "Tu anuncio está en revisión - Moovy Jobs", companyEmailHtml).catch(err => {
                console.error('Failed to send company job confirmation:', err);
            });
        }

        // Create pending payment if featured is requested
        let createdPayment = null;
        if (isFeatured) {
            const days = featuredDays || 7; // Default to 7 days
            const amount = days * PRICE_PER_DAY;

            createdPayment = await prisma.payment.create({
                data: {
                    jobPostingId: job.id,
                    amount: amount,
                    status: 'pending',
                    provider: 'manual',
                    externalId: `featured_${days}_days` // Store days info
                }
            });

            // Note: isFeatured on job remains false until payment is confirmed
            await prisma.jobPosting.update({
                where: { id: job.id },
                data: { isFeatured: false } // Will be set to true when payment is confirmed
            });
        }

        return NextResponse.json({ ...job, createdPayment }, { status: 201 });
    } catch (error) {
        console.error('Error creating job posting:', error);
        return NextResponse.json({ error: 'Error al crear el empleo' }, { status: 500 });
    }
}
