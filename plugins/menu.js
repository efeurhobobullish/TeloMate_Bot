require("dotenv").config();
const fs = require("fs");
const os = require("os");
const path = require("path");
const axios = require("axios");

const USERS_FILE = path.join(__dirname, "../database/users.json"); // Update if using MongoDB

function getUptime() {
  let seconds = process.uptime();
  const days = Math.floor(seconds / (3600 * 24));
  seconds %= 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function countCommands() {
  const files = fs.readdirSync(path.join(__dirname, "../plugins"));
  return files.filter(file => file.endsWith(".js")).length;
}

function getTotalUsers() {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    return users.length;
  } catch {
    return 0;
  }
}

function getRamUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const toMB = bytes => (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return {
    used: toMB(used),
    total: toMB(total)
  };
}

module.exports = async (bot, ctx) => {
  const name = ctx.from.first_name + (ctx.from.last_name ? ` ${ctx.from.last_name}` : "");
  const uptime = getUptime();
  const commands = countCommands();
  const totalUsers = getTotalUsers();
  const ram = getRamUsage();
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-GB");
  const formattedTime = date.toLocaleTimeString("en-GB", { hour12: true });

  const caption = `
┌───────────────────────────────────────┐
│  🌟  TELOMATE BOT v1.0.0  🌟        
├───────────────────────────────────────┤
│  👤 User: ${name}               
│  📊 Commands: ${commands} loaded     
│  👥 Total Users: ${totalUsers}       
│  📦 RAM: ${ram.used} / ${ram.total}  
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

  try {
    await ctx.replyWithPhoto(
      { url: process.env.PP },
      { caption, parse_mode: "Markdown" }
    );
  } catch (e) {
    await ctx.reply("❌ Failed to load menu image.\n\n" + caption);
  }
};