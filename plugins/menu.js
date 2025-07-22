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

      const uptime = formatUptime(process.uptime());
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-GB");
      const formattedTime = now.toLocaleTimeString("en-GB");

      const caption = `
┌───────────────────────────────────────┐
│  🌟  TELOMATE BOT v1.0.0  🌟        
├───────────────────────────────────────┤
│  👤 User: ${name}               
│  📊 Commands:  ${pluginCount}  
│  👥 Total Users: ${users.length}
│  📦 RAM:  ${(usedMem / 1024 / 1024).toFixed(2)} MB / ${(totalMem / 1024 / 1024).toFixed(2)} MB
│  ⏱ Uptime: ${uptime}                 
│  📅 ${formattedDate}  |  🕒 ${formattedTime}    
└───────────────────────────────────────┘

▬▬▬▬▬▬▬▬▬  COMMANDS  ▬▬▬▬▬▬▬▬▬

🔹 BASIC
├─ /info - User/bot details
├─ /start - Initialize bot
├─ /help - Command list
├─ /ping - Check latency
├─ /photo - Send image
├─ /sticker - Send sticker
├─ /alive - System check
└─ /ownerPic - Developer photo

🔹 DATA
├─ /Bible - Scripture lookup
├─ /whaspy - WhatsApp DP
├─ /img - Random image
├─ /convert - Currency
├─ /crypto - Prices
├─ /weather - Forecast
├─ /define - Dictionary
└─ /play - Music (Soon)

🔹 TOOLS
├─ /qualc - Calculator
├─ /math - Math solver
├─ /bot - AI assistant
└─ /pgen - Password gen

🔹 FUN
├─ /randomoji - Emoji mix
├─ /joke - Random jokes
└─ /tokfetch - TikTok DL

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
💖 Crafted for you by Empire Tech
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