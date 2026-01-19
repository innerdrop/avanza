
/**
 * Telegram Notification Utility
 */

// Types for inline keyboard
interface InlineKeyboardButton {
    text: string;
    callback_data: string;
}

interface InlineKeyboard {
    inline_keyboard: InlineKeyboardButton[][];
}

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

/**
 * Send a Telegram message with inline keyboard buttons
 */
export async function sendTelegramMessageWithButtons(
    message: string,
    buttons: InlineKeyboardButton[][]
) {
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
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: buttons
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Telegram API Error: ${JSON.stringify(error)}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error sending Telegram message with buttons:", error);
    }
}

/**
 * Edit a Telegram message (remove buttons after action)
 */
export async function editTelegramMessage(
    chatId: string | number,
    messageId: number,
    newText: string
) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
        console.warn("Telegram Bot Token not configured.");
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${botToken}/editMessageText`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                text: newText,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Edit message error:", error);
        }

        return await response.json();
    } catch (error) {
        console.error("Error editing Telegram message:", error);
    }
}

/**
 * Answer a callback query (acknowledge button click)
 */
export async function answerCallbackQuery(
    callbackQueryId: string,
    text?: string,
    showAlert: boolean = false
) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
        console.warn("Telegram Bot Token not configured.");
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                callback_query_id: callbackQueryId,
                text: text,
                show_alert: showAlert
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Answer callback error:", error);
        }

        return await response.json();
    } catch (error) {
        console.error("Error answering callback query:", error);
    }
}
