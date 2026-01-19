import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { answerCallbackQuery, editTelegramMessage } from '@/lib/telegram';
import { sendEmail } from '@/lib/email';

/**
 * Telegram Webhook Handler
 * Receives callback queries when admin clicks buttons in Telegram
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("[Telegram Webhook] Received:", JSON.stringify(body, null, 2));

        // Handle callback query (button click)
        if (body.callback_query) {
            const query = body.callback_query;
            const callbackData = query.data;
            const callbackId = query.id;
            const chatId = query.message?.chat?.id;
            const messageId = query.message?.message_id;
            const originalText = query.message?.text || '';

            // Verify it's from the configured admin chat
            const configuredChatId = process.env.TELEGRAM_CHAT_ID;
            if (configuredChatId && String(chatId) !== configuredChatId) {
                await answerCallbackQuery(callbackId, "⛔ No autorizado", true);
                return NextResponse.json({ ok: true });
            }

            // Parse callback data
            const parts = callbackData.split('_');
            const action = parts[0]; // job, payment, subscription
            const subAction = parts[1]; // approve, reject, confirm
            const id = parseInt(parts[2]);

            if (isNaN(id)) {
                await answerCallbackQuery(callbackId, "❌ ID inválido", true);
                return NextResponse.json({ ok: true });
            }

            let resultMessage = '';

            // Handle job approval/rejection
            if (action === 'job') {
                const newStatus = subAction === 'approve' ? 'active' : 'rejected';

                const job = await prisma.jobPosting.update({
                    where: { id },
                    data: { status: newStatus },
                    include: {
                        companyUser: {
                            select: { email: true, name: true }
                        }
                    } as any
                });

                // Send email notification to company
                if ((job as any).companyUser?.email) {
                    const isApproved = subAction === 'approve';
                    const subject = isApproved
                        ? `¡Tu anuncio "${job.title}" ha sido aprobado!`
                        : `Actualización sobre tu anuncio "${job.title}"`;

                    const emailHtml = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                            <h2 style="color: ${isApproved ? '#28a745' : '#dc3545'};">
                                ${isApproved ? '¡Anuncio Aprobado!' : 'Anuncio No Aprobado'}
                            </h2>
                            <p>Hola ${(job as any).companyUser.name || 'Empresa'},</p>
                            <p>Tu solicitud de publicación para el puesto <strong>"${job.title}"</strong> ha sido ${isApproved ? 'aprobada' : 'rechazada'}.</p>
                            ${isApproved
                            ? '<p>Tu anuncio ya está visible en nuestra plataforma.</p>'
                            : '<p>Si tienes preguntas, por favor contáctanos.</p>'
                        }
                            <hr>
                            <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Moovy Jobs</p>
                        </div>
                    `;

                    sendEmail((job as any).companyUser.email, subject, emailHtml).catch(err => {
                        console.error('Failed to send company notification:', err);
                    });
                }

                resultMessage = subAction === 'approve'
                    ? `✅ Empleo #${id} APROBADO`
                    : `❌ Empleo #${id} RECHAZADO`;

                // Update the Telegram message to show action taken
                const updatedText = originalText + `\n\n${resultMessage} (vía Telegram)`;
                await editTelegramMessage(chatId, messageId, updatedText);
            }

            // Handle featured payment confirmation
            if (action === 'payment') {
                const payment = await prisma.payment.findUnique({
                    where: { id },
                    include: { jobPosting: true }
                });

                if (!payment) {
                    await answerCallbackQuery(callbackId, "❌ Pago no encontrado", true);
                    return NextResponse.json({ ok: true });
                }

                if (payment.status === 'completed') {
                    await answerCallbackQuery(callbackId, "ℹ️ Este pago ya fue confirmado", true);
                    return NextResponse.json({ ok: true });
                }

                // Extract duration days
                let durationDays = 30;
                if (payment.externalId) {
                    const match = payment.externalId.match(/featured_(\d+)_days/);
                    if (match) {
                        durationDays = parseInt(match[1]);
                    }
                }

                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + durationDays);

                await prisma.$transaction([
                    prisma.payment.update({
                        where: { id },
                        data: { status: 'completed' }
                    }),
                    prisma.jobPosting.update({
                        where: { id: payment.jobPostingId },
                        data: {
                            isFeatured: true,
                            featuredExpiresAt: expirationDate
                        }
                    })
                ]);

                resultMessage = `✅ Pago #${id} CONFIRMADO - Empleo destacado por ${durationDays} días`;

                const updatedText = originalText + `\n\n${resultMessage}`;
                await editTelegramMessage(chatId, messageId, updatedText);
            }

            // Handle premium subscription confirmation  
            if (action === 'subscription') {
                const subscription = await prisma.premiumSubscription.findUnique({
                    where: { id },
                    include: { user: { select: { name: true, email: true } } }
                });

                if (!subscription) {
                    await answerCallbackQuery(callbackId, "❌ Suscripción no encontrada", true);
                    return NextResponse.json({ ok: true });
                }

                if (subscription.status === 'completed') {
                    await answerCallbackQuery(callbackId, "ℹ️ Esta suscripción ya está activa", true);
                    return NextResponse.json({ ok: true });
                }

                await prisma.$transaction([
                    prisma.premiumSubscription.update({
                        where: { id },
                        data: {
                            status: 'completed',
                            confirmedAt: new Date()
                        }
                    }),
                    prisma.user.update({
                        where: { id: subscription.userId },
                        data: { plan: 'premium' }
                    })
                ]);

                resultMessage = `✅ Premium ACTIVADO para ${(subscription as any).user?.name || 'empresa'}`;

                const updatedText = originalText + `\n\n${resultMessage}`;
                await editTelegramMessage(chatId, messageId, updatedText);
            }

            // Acknowledge the button click
            await answerCallbackQuery(callbackId, resultMessage || '✅ Acción completada');

            return NextResponse.json({ ok: true });
        }

        // For other update types, just acknowledge
        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error("[Telegram Webhook] Error:", error);
        return NextResponse.json({ ok: true }); // Always return ok to Telegram
    }
}

// GET: For webhook verification
export async function GET() {
    return NextResponse.json({ status: 'Telegram webhook active' });
}
