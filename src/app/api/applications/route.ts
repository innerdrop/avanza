import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { notifyNewUser } from '@/lib/notifications';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// GET: Fetch all applications (for Admin)
export async function GET(request: Request) {
    try {
        const applications = await prisma.application.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                jobPosting: {
                    select: { title: true }
                }
            }
        });
        return NextResponse.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json(
            { error: 'Error fetching applications' },
            { status: 500 }
        );
    }
}

// POST: Create a new application (for Candidate)
export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const nombre = formData.get('nombre') as string;
        const email = formData.get('email') as string;
        const telefono = formData.get('telefono') as string;
        const linkedin = formData.get('linkedin') as string;
        const area = formData.get('area') as string;
        const experiencia = formData.get('experiencia') as string;
        const disponibilidad = formData.get('disponibilidad') as string;
        const presentacion = formData.get('presentacion') as string;
        const jobPostingId = formData.get('jobPostingId') as string;
        const cvFile = formData.get('cvFile') as File | null;

        console.log("SERVER DEBUG: Received submission");
        console.log("SERVER DEBUG: jobPostingId raw:", jobPostingId);
        if (jobPostingId) {
            console.log("SERVER DEBUG: parsed ID:", parseInt(jobPostingId));
        }

        // Validar campos requeridos mínimos
        if (!nombre || !email || !telefono) {
            return NextResponse.json(
                { error: 'Hay campos obligatorios faltantes (nombre, email o teléfono)' },
                { status: 400 }
            );
        }

        // Si es espontánea (no hay jobPostingId), validar los campos profesionales
        if (!jobPostingId && (!area || !experiencia || !disponibilidad)) {
            return NextResponse.json(
                { error: 'Para postulaciones espontáneas, los campos profesionales son obligatorios' },
                { status: 400 }
            );
        }

        // Valores por defecto si no vienen (por ser postulación directa)
        const finalArea = area || 'Postulación Directa';
        const finalExperiencia = experiencia || 'N/A';
        const finalDisponibilidad = disponibilidad || 'N/A';

        // Check for duplicate application (same email + same job)
        const normalizedEmail = email.toLowerCase().trim();
        const existingApplication = await prisma.application.findFirst({
            where: {
                email: normalizedEmail,
                jobPostingId: jobPostingId ? parseInt(jobPostingId) : null
            }
        });

        if (existingApplication) {
            const message = jobPostingId
                ? 'Ya te has postulado a este empleo con este correo electrónico.'
                : 'Ya has enviado una candidatura espontánea con este correo electrónico.';
            return NextResponse.json(
                { error: message },
                { status: 409 }
            );
        }

        let cvUrl = null;

        // Handle File Upload
        if (cvFile) {
            const bytes = await cvFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const originalName = cvFile.name.replace(/\s+/g, '-').toLowerCase();
            const filename = `${uniqueSuffix}-${originalName}`;

            // Define upload directory
            const uploadDir = join(process.cwd(), 'public', 'uploads', 'cvs');

            // Create directory if it doesn't exist
            await mkdir(uploadDir, { recursive: true });

            // Save file
            const filePath = join(uploadDir, filename);
            await writeFile(filePath, buffer);

            // Set URL path for database
            cvUrl = `/uploads/cvs/${filename}`;
        }

        const application = await prisma.application.create({
            data: {
                nombre,
                email: normalizedEmail,
                telefono,
                linkedin: linkedin || null,
                area: finalArea,
                experiencia: finalExperiencia,
                disponibilidad: finalDisponibilidad,
                presentacion: presentacion || null,
                jobPosting: jobPostingId ? {
                    connect: { id: parseInt(jobPostingId) }
                } : undefined,
                cvUrl: cvUrl,
                status: 'pending'
            },
            include: {
                jobPosting: true
            }
        });

        const jobTitle = application.jobPosting?.title || 'Candidatura Espontánea';
        const jobCompany = application.jobPosting?.company || '';
        const jobDisplay = jobCompany ? `${jobTitle} en ${jobCompany}` : jobTitle;

        // Send email notification asynchronously
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                <div style="text-align: right; margin-bottom: 20px;">
                    <img src="cid:logo" alt="Logo" style="width: 50px; height: auto;">
                </div>
                <h2 style="color: #007bff;">Nueva Postulación Recibida</h2>
            <p><strong>Candidato:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Área:</strong> ${finalArea}</p>
            <p><strong>Experiencia:</strong> ${finalExperiencia}</p>
            <p><strong>Disponibilidad:</strong> ${finalDisponibilidad}</p>
            <p><strong>Postulado para:</strong> ${jobDisplay}</p>
            ${cvUrl ? `<p><strong>CV:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}${cvUrl}">Ver Archivo</a></p>` : ''}
            </div>
        `;

        // Send notification (respected settings)
        const telegramText = `<b>Nueva Postulación Recibida</b>\n\n<b>Candidato:</b> ${nombre}\n<b>Puesto:</b> ${jobDisplay}\n<b>Email:</b> ${email}`;

        notifyNewUser(`Nueva Postulación: ${nombre}`, emailHtml, telegramText).catch(err => {
            console.error("Failed to send notification:", err);
        });

        // --- NEW: Confirmation email to Candidate ---
        const targetCompany = jobCompany || 'Moovy Jobs';

        const userEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px; position: relative;">
                <div style="text-align: right; margin-bottom: 10px;">
                    <img src="cid:logo" alt="Logo" style="width: 50px; height: auto;">
                </div>
                <h2 style="color: #007bff;">¡Hola, ${nombre}!</h2>
                <p>Hemos recibido tu CV y postulación para el puesto de <strong>${jobTitle}</strong> correctamente en <strong>${targetCompany}</strong>.</p>
                <p>Nuestro equipo revisará tu perfil y, en caso de que coincida con lo que estamos buscando, nos pondremos en contacto contigo.</p>
                <p>Gracias por tu interés en sumarte a nuestro equipo.</p>
                <br>
                <hr>
                <p style="font-size: 12px; color: #777;">Este es un mensaje automático, por favor no respondas a este correo.</p>
                <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Moovy Jobs</p>
            </div>
        `;

        sendEmail(email, `Recibimos tu postulación a ${targetCompany} correctamente`, userEmailHtml).catch(err => {
            console.error("Failed to send candidate confirmation email:", err);
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        console.error('Error creating application:', error);
        return NextResponse.json(
            { error: 'Error submitting application' },
            { status: 500 }
        );
    }
}
