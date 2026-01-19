import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Ya existe una cuenta con este email' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with role 'company'
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'company'
            }
        });

        // Send welcome email to Company
        const welcomeEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                <div style="text-align: right; margin-bottom: 20px;">
                    <img src="cid:logo" alt="Logo" style="width: 50px; height: auto;">
                </div>
                <h2 style="color: #007bff;">¡Bienvenido/a a Moovy Jobs, ${name}!</h2>
                <p>Tu cuenta de empresa ha sido creada exitosamente. Ahora puedes publicar ofertas laborales y encontrar el talento que tu organización necesita.</p>
                <p>A partir de ahora podrás:</p>
                <ul>
                    <li>Publicar nuevos anuncios de empleo.</li>
                    <li>Gestionar tus búsquedas activas.</li>
                    <li>Recibir perfiles compatibles en tu panel.</li>
                </ul>
                <p>Tu próximo paso es acceder al dashboard y publicar tu primera búsqueda.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/empresas/login" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ingresar al Panel</a>
                </div>
                <p>Si tienes alguna consulta, no dudes en contactarnos.</p>
                <br>
                <hr>
                <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Moovy Jobs</p>
            </div>
        `;

        const { sendEmail } = await import('@/lib/email');
        sendEmail(email, "¡Bienvenido a Moovy Jobs! - Registro Exitoso", welcomeEmailHtml).catch(err => {
            console.error('Failed to send welcome email:', err);
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Error al registrar la cuenta' },
            { status: 500 }
        );
    }
}
