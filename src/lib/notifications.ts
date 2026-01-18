
import prisma from './prisma';
import { sendEmail, sendNotificationEmail } from './email';
import { sendTelegramMessage } from './telegram';

async function getConfig() {
    try {
        const configs = await prisma.contentBlock.findMany({
            where: {
                key: { startsWith: 'config_' }
            }
        });

        const configMap: Record<string, string> = {};
        configs.forEach(c => {
            const cleanKey = c.key.replace('config_', '');
            configMap[cleanKey] = c.content;
        });

        return {
            notifications_email: configMap.notifications_email !== 'false', // Default true
            notifications_new_user: configMap.notifications_new_user !== 'false', // Default true
            notifications_telegram: configMap.notifications_telegram === 'true', // Default false
        };
    } catch (error) {
        console.error("Error fetching config for notifications:", error);
        return {
            notifications_email: true,
            notifications_new_user: true,
            notifications_telegram: false,
        };
    }
}

export async function notifyAdmin(subject: string, html: string, telegramText: string) {
    const config = await getConfig();

    const promises = [];

    // Email Notification
    if (config.notifications_email) {
        promises.push(sendNotificationEmail(subject, html).catch(err => console.error("Email notification failed:", err)));
    } else {
        console.log("[Notifications] Email disabled by config.");
    }

    // Telegram Notification
    if (config.notifications_telegram) {
        // Strip HTML tags for telegram if needed, or use HTML mode if text is already formatted
        promises.push(sendTelegramMessage(telegramText).catch(err => console.error("Telegram notification failed:", err)));
    } else {
        console.log("[Notifications] Telegram disabled by config.");
    }

    await Promise.all(promises);
}

export async function notifyNewUser(subject: string, html: string, telegramText: string) {
    const config = await getConfig();

    if (!config.notifications_new_user) return;

    const promises = [];

    if (config.notifications_email) {
        promises.push(sendNotificationEmail(subject, html).catch(err => console.error("Email notification failed:", err)));
    }

    if (config.notifications_telegram) {
        promises.push(sendTelegramMessage(telegramText).catch(err => console.error("Telegram notification failed:", err)));
    }

    await Promise.all(promises);
}
