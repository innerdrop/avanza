import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { notifyAdminWithButtons } from '@/lib/notifications';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('user_id')?.value;
        const role = cookieStore.get('user_role')?.value;

        if (!userId || role !== 'company') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { type, jobTitle, amount, companyName, paymentId, subscriptionId } = body;

        // Get company info
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const serviceName = type === 'premium' ? 'Suscripción Premium' : 'Publicación Destacada';

        // Email content
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                <div style="text-align: right; margin-bottom: 20px;">
                    <img src="cid:logo" alt="Logo" style="width: 50px; height: auto;">
                </div>
                <h2 style="color: #22C55E;">💳 Notificación de Pago Realizado</h2>
                <p>Una empresa ha notificado que realizó una transferencia:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;"><strong>Empresa:</strong></td>
                        <td style="padding: 10px 0; text-align: right;">${companyName || user.name || 'Sin nombre'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;"><strong>Email:</strong></td>
                        <td style="padding: 10px 0; text-align: right;">${user.email}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;"><strong>Servicio:</strong></td>
                        <td style="padding: 10px 0; text-align: right;">${serviceName}</td>
                    </tr>
                    ${jobTitle ? `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;"><strong>Empleo:</strong></td>
                        <td style="padding: 10px 0; text-align: right;">${jobTitle}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding: 10px 0; color: #666;"><strong>Monto:</strong></td>
                        <td style="padding: 10px 0; text-align: right; font-size: 1.2em; color: #22C55E; font-weight: bold;">$${amount?.toLocaleString('es-AR') || 'N/A'}</td>
                    </tr>
                </table>
                <p style="background: #FEF3C7; padding: 15px; border-radius: 8px; color: #92400E;">
                    ⚠️ <strong>Acción requerida:</strong> Verifica la transferencia y activa el servicio correspondiente.
                </p>
            </div>
        `;

        // Telegram message
        const telegramText = `💳 <b>Notificación de Pago</b>\n\n<b>Empresa:</b> ${companyName || user.name || 'Sin nombre'}\n<b>Email:</b> ${user.email}\n<b>Servicio:</b> ${serviceName}\n${jobTitle ? `<b>Empleo:</b> ${jobTitle}\n` : ''}<b>Monto:</b> $${amount?.toLocaleString('es-AR') || 'N/A'}\n\n⚠️ Verificar y activar servicio.`;

        // Determine the button based on payment type
        let buttons: { text: string; callback_data: string }[][] = [];

        if (type === 'premium') {
            // For premium, we need to find the subscription ID
            const subscription = await prisma.premiumSubscription.findFirst({
                where: {
                    userId: parseInt(userId),
                    status: 'pending'
                },
                orderBy: { createdAt: 'desc' }
            });

            if (subscription) {
                buttons = [[
                    { text: '✓ Confirmar Premium', callback_data: `subscription_confirm_${subscription.id}` }
                ]];
            }
        } else {
            // For featured payment, find the pending payment
            const payment = await prisma.payment.findFirst({
                where: {
                    jobPosting: {
                        companyUserId: parseInt(userId)
                    },
                    status: 'pending'
                },
                orderBy: { createdAt: 'desc' }
            });

            if (payment) {
                buttons = [[
                    { text: '✓ Confirmar Pago Destacado', callback_data: `payment_confirm_${payment.id}` }
                ]];
            }
        }

        // Send notification with buttons
        await notifyAdminWithButtons(
            `Pago notificado: ${companyName || user.name}`,
            emailHtml,
            telegramText,
            buttons
        );

        return NextResponse.json({ success: true, message: 'Notificación enviada al administrador' });
    } catch (error) {
        console.error('Error notifying payment:', error);
        return NextResponse.json({ error: 'Error al enviar notificación' }, { status: 500 });
    }
}
