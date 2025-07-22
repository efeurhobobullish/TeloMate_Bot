require("dotenv").config();
const os = require("os");
const fs = require("fs");
const path = require("path");

module.exports = (bot) => {
  bot.command("menu", async (ctx) => {
    try {
      const totalUsersPath = path.join(__dirname, "../database/users.json");
      const users = JSON.parse(fs.readFileSync(totalUsersPath, "utf8")) || [];

      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;

      const pluginCount = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith(".js")).length;

      const name = ctx.from.first_name + (ctx.from.last_name ? ` ${ctx.from.last_name}` : "");
      const text = `
👤 Name: ${name}
📂 Commands: ${pluginCount}
👥 Users: ${users.length}
💾 RAM Usage: ${(usedMem / 1024 / 1024).toFixed(2)} MB / ${(totalMem / 1024 / 1024).toFixed(2)} MB
`;

      await ctx.reply(text.trim());
    } catch (err) {
      console.error("Menu error:", err.message);
      if (ctx.reply) await ctx.reply("⚠️ Failed to load menu.");
    }
  });
};