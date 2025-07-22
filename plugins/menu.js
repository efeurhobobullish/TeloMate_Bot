require("dotenv").config();
const fs = require("fs");
const os = require("os");
const path = require("path");

module.exports = async (ctx) => {
  try {
    // User name safe fallback
    const name = ctx.from?.first_name + (ctx.from?.last_name ? ` ${ctx.from.last_name}` : "") || "User";

    // Plugin count
    const pluginsDir = path.join(__dirname);
    const commandFiles = fs.readdirSync(pluginsDir).filter(file => file.endsWith(".js") && file !== "menu.js");
    const commandCount = commandFiles.length;

    // Uptime
    const seconds = Math.floor(process.uptime());
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    // RAM usage
    const totalMem = os.totalmem();
    const usedMem = totalMem - os.freemem();
    const ramUsageMB = (usedMem / 1024 / 1024).toFixed(1);

    // Date + Time
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB");
    const timeStr = now.toLocaleTimeString("en-GB");

    // Load users
    const users = require("../database/users.json");
    const userCount = users.length;

    const caption = `┌───────────────────────────────────────┐
│  🌟  TELOMATE BOT v1.0.0  🌟        │
├───────────────────────────────────────┤
│  👤 User: ${name}                 
│  📊 Commands: ${commandCount} loaded         
│  🧠 RAM Usage: ${ramUsageMB} MB
│  👥 Total Users: ${userCount}
│  ⏱ Uptime: ${d}d ${h}h ${m}m ${s}s             
│  📅 ${dateStr}  |  🕒 ${timeStr}    
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

✨ Made with ❤️ by Empire Tech`;

    await ctx.replyWithPhoto({ url: process.env.PP }, { caption });
  } catch (err) {
    console.error("❌ Menu Error:", err);
    ctx.reply("⚠️ Failed to load menu.");
  }
};