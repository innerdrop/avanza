
/**
 * Telegram Notification Utility
 */


export async function sendTelegramMessage(message: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.warn("Telegram Bot Token or Chat ID not configured in .env.");
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Telegram API Error: ${JSON.stringify(error)}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error sending Telegram message:", error);
    }
}

