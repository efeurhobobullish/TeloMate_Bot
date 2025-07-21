require("dotenv").config();
const fs = require("fs");
const path = require("path");

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
    const group = await bot.telegram.getChatMember(process.env.GROUP_ID, userId);
    const channel = await bot.telegram.getChatMember(process.env.CHANNEL_ID, userId);
    return group.status !== "left" && channel.status !== "left";
  } catch (err) {
    console.error("❌ checkMembership error:", err.message);
    return false;
  }
}

module.exports = (bot) => {
  bot.command("start", async (ctx) => {
    const userId = ctx.from.id;

    const isMember = await checkMembership(bot, userId);
    if (!isMember) {
      return ctx.replyWithPhoto(
        { url: process.env.PP },
        {
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
            ],
          },
        }
      );
    }

    saveUser(userId);
    return ctx.telegram.sendMessage(userId, "/menu");
  });

  bot.action("check_membership", async (ctx) => {
    const userId = ctx.from.id;
    const isMember = await checkMembership(bot, userId);

    if (!isMember) {
      return ctx.answerCbQuery("❌ You're still not a member!", { show_alert: true });
    }

    await ctx.answerCbQuery("✅ Membership confirmed!");
    await ctx.telegram.sendMessage(userId, "/menu");
  });
};