require("dotenv").config();
const os = require("os");
const fs = require("fs");
const path = require("path");
const { runtime, sleep, fetchJson } = require('../utils/functions');
module.exports = (bot) => {
  bot.command("menu", async (ctx) => {
    try {
      const totalUsersPath = path.join(__dirname, "../database/users.json");
      const users = JSON.parse(fs.readFileSync(totalUsersPath, "utf8")) || [];

      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const uptime = runtime(process.uptime()); //
      const pluginCount = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith(".js")).length;

      const name = ctx.from.first_name + (ctx.from.last_name ? ` ${ctx.from.last_name}` : "");

      const uptime = formatUptime(process.uptime());
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-GB");
      const formattedTime = now.toLocaleTimeString("en-GB");

      const caption = `
🌟 *TELOMATE BOT v1.0.0* 🌟

👤 *User:* ${name}
📊 *Commands:* ${pluginCount}
👥 *Total Users:* ${users.length}
📦 *RAM:* ${(usedMem / 1024 / 1024).toFixed(2)} / ${(totalMem / 1024 / 1024).toFixed(2)} MB
⏱ *Uptime:* ${uptime}
📅 *Date:* ${formattedDate} | 🕒 *Time:* ${formattedTime}

🔹 *Main Commands*
/start - Start Bot
/help - Command List
/photo - Get Image
/sticker - Get Sticker
/bible - Scripture
/crypto - Crypto Prices
/weather - Forecast
/convert - Currency
/bot - Chat AI
/play - Music (soon)
/ownerPic - Owner Photo

💖 Crafted by *Empire Tech*
`;

      await ctx.replyWithPhoto(
        { url: process.env.PP },
        { caption, parse_mode: "Markdown" }
      );
    } catch (e) {
      console.error("Menu error:", e);
      await ctx.reply("❌ Failed to load menu image.\n\n" + caption);
    }
  });
};

// Helper function to format uptime
function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs}h ${mins}m ${secs}s`;
}
