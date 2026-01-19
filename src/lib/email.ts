
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

import path from 'path';

export const sendEmail = async (to: string, subject: string, html: string) => {
    console.log(`[Email] Attempting to send email to ${to} with subject: ${subject}`);
    try {
        const logoPath = path.join(process.cwd(), 'public', 'moovy-logo.svg');

        const info = await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to,
            subject,
            html,
            attachments: [
                {
                    filename: 'logo.svg',
                    path: logoPath,
                    cid: 'logo' // matches <img src="cid:logo">
                }
            ]
        });
        console.log('[Email] Message sent successfully: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('[Email] CRITICAL: Error sending email:', error);
        throw error;
    }
};

export const sendNotificationEmail = async (subject: string, html: string) => {
    // Send to the admin/owner email (which is the same as the sender in this case, or can be different)
    // For now we send to the configured SMTP_EMAIL
    if (!process.env.SMTP_EMAIL) {
        console.warn("SMTP_EMAIL not configured, skipping notification email.");
        return;
    }
    return sendEmail(process.env.SMTP_EMAIL, subject, html);
};
