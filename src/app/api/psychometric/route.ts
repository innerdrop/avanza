
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { notifyAdmin } from '@/lib/notifications';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, nombre, respuestas, resultado } = body;

        const test = await prisma.psychometricTest.create({
            data: {
                email,
                nombre,
                respuestas: JSON.stringify(respuestas),
                resultado: JSON.stringify(resultado),
            },
        });

        // --- Notifications ---

        // 1. To Admin (respected settings)
        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                <div style="text-align: right; margin-bottom: 20px;">
                    <img src="cid:logo" alt="Logo" style="width: 50px; height: auto;">
                </div>
                <h2 style="color: #007bff;">Nuevo Test Psicotécnico Finalizado</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p>El candidato ha completado el test psicotécnico. Puedes ver los detalles en el panel de administración.</p>
            </div>
        `;
        const telegramText = `<b>Nuevo Test Psicotécnico Finalizado</b>\n\n<b>Nombre:</b> ${nombre}\n<b>Email:</b> ${email}`;

        notifyAdmin(`Test Psicotécnico Finalizado: ${nombre}`, adminEmailHtml, telegramText).catch(err => {
            console.error("Failed to send test notification:", err);
        });

        // 2. To User (Confirmation)
        const userEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px; position: relative;">
                <div style="text-align: right; margin-bottom: 10px;">
                    <img src="cid:logo" alt="Logo" style="width: 50px; height: auto;">
                </div>
                <h2 style="color: #28a745;">¡Test Completado, ${nombre}!</h2>
                <p>Has finalizado exitosamente el test psicotécnico en <strong>Avanza Fueguino</strong>.</p>
                <p>Tus resultados han sido registrados y serán tenidos en cuenta para futuras oportunidades laborales que coincidan con tu perfil.</p>
                <p>¡Muchas gracias por participar!</p>
                <br>
                <hr>
                <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Avanza Fueguino</p>
            </div>
        `;
        sendEmail(email, "Has completado el test psicotécnico - Avanza Fueguino", userEmailHtml).catch(err => {
            console.error("Failed to send test user confirmation:", err);
        });

        return NextResponse.json(test, { status: 201 });
    } catch (error) {
        console.error('Error saving psychometric test:', error);
        return NextResponse.json(
            { error: 'Error processing request' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const tests = await prisma.psychometricTest.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(tests);
    } catch (error) {
        console.error('Error fetching psychometric tests:', error);
        return NextResponse.json(
            { error: 'Error fetching tests' },
            { status: 500 }
        );
    }
}
