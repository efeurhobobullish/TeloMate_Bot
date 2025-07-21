require("dotenv").config();

module.exports = async (ctx) => {
    if (typeof ctx.replyWithPhoto !== 'function') {
        console.error('❌ ctx is not a valid Telegraf context');
        return;
    }

    const firstName = ctx.from?.first_name || 'User';

    try {
        await ctx.replyWithPhoto(
            { url: process.env.PP },
            {
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
            }
        );
    } catch (error) {
        console.error('Error in menu command:', error.message);
        if (typeof ctx.reply === 'function') {
            await ctx.reply('❌ Failed to load the menu. Please try again later.');
        }
    }
};