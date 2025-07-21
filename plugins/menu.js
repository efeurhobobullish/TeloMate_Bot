const fs = require('fs');
require("dotenv").config();

module.exports = async (bot, message) => {
    const chatId = message.chat.id;
    const firstName = message.from.first_name;

    try {
        await bot.sendPhoto(chatId, process.env.PP, {
            caption: `👋 Hello *${firstName}*,

🔧 *This bot was created for testing purposes only.*
Built and maintained by *Empire Tech*.

🧪 Just a sample menu to test bot functionality.`,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '👑 Developer', url: 'https://t.me/only_one_empire' }],
                    [{ text: '🤖 Owner', url: 'https://t.me/only_one_empire' }]
                ]
            }
        });
    } catch (error) {
        console.error('Error in menu command:', error.message);
        await bot.sendMessage(chatId, '❌ Failed to load the menu. Please try again later.');
    }
};
