const fs = require("fs");
const path = require("path");
const axios = require("axios");

const USERS_FILE = path.join(__dirname, "../database/users.json");

function loadUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveUser(userId) {
  const users = loadUsers();
  if (!users.includes(userId)) {
    users.push(userId);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
}

async function checkMembership(bot, userId) {
  try {
    const res = await bot.telegram.getChatMember(process.env.CHANNEL_ID, userId);
    return ['member', 'creator', 'administrator'].includes(res.status);
  } catch {
    return false;
  }
}

module.exports = (bot) => {
  bot.on("message", async (ctx) => {
    const messageText = ctx.message?.text;
    const userId = ctx.from.id;

    if (!messageText || (!messageText.startsWith(".") && !messageText.startsWith("/"))) return;

    const isMember = await checkMembership(bot, userId);

    if (!isMember) {
      return ctx.replyWithPhoto(process.env.PP, {
        caption: `❌ *Access Denied!*\n\nYou must join, subscribe and follow all the *given links* to use this bot.`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📲 WhatsApp", url: process.env.WHATSAPP_LINK }],
            [{ text: "▶️ YouTube", url: process.env.YOUTUBE_LINK }],
            [{ text: "📷 Instagram", url: process.env.INSTAGRAM_LINK }],
            [{ text: "🔹 Telegram Group", url: process.env.GROUP_LINK }],
            [{ text: "🔵 Telegram Channel", url: process.env.CHANNEL_LINK }],
            [{ text: "🔄 Check Again", callback_data: "check_membership" }],
          ]
        }
      });
    }

    saveUser(userId);

    // If member, redirect to menu command
    if (messageText === "/start") {
      return bot.telegram.emit('text', { text: '/menu', from: ctx.from, chat: ctx.chat });
    }
  });

  bot.action("check_membership", async (ctx) => {
    const userId = ctx.from.id;
    const isMember = await checkMembership(bot, userId);

    if (!isMember) {
      return ctx.answerCbQuery("❌ You're still not a member!", { show_alert: true });
    }

    ctx.answerCbQuery("✅ Membership confirmed!");
    ctx.telegram.sendMessage(userId, "/menu");
  });
};
