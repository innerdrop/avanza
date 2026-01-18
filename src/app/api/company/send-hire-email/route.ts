import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        // Verify company session
        const cookieStore = await cookies();
        const authToken = cookieStore.get('auth_token')?.value;
        const userRole = cookieStore.get('user_role')?.value;

        if (!authToken || userRole !== 'company') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await req.json();
        const { candidateEmail, candidateName, subject, message } = body;

        if (!candidateEmail || !subject || !message) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
        }

        // Create HTML email body
        const htmlBody = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        padding: 20px 0;
                        border-bottom: 3px solid #10b981;
                    }
                    .content {
                        padding: 30px 0;
                        white-space: pre-wrap;
                    }
                    .footer {
                        padding: 20px 0;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                        color: #6b7280;
                        font-size: 12px;
                    }
                    .logo {
                        max-width: 75px;
                        height: auto;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="cid:logo" alt="Avanza Fueguino" class="logo" />
                </div>
                <div class="content">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                <div class="footer">
                    <p>Este mensaje fue enviado a través de la plataforma Avanza Fueguino</p>
                    <p>© ${new Date().getFullYear()} Avanza Fueguino - Empleo y Talento</p>
                </div>
            </body>
            </html>
        `;

        // Send email
        await sendEmail(candidateEmail, subject, htmlBody);

        return NextResponse.json({
            success: true,
            message: 'Email enviado correctamente'
        });

    } catch (error) {
        console.error('Error sending hire email:', error);
        return NextResponse.json({
            error: 'Error al enviar el email',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}
