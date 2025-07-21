require("dotenv").config();
const axios = require("axios");
const { Telegraf } = require("telegraf");
const fs = require("fs");
const path = require("path");
const express = require("express");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Load plugins
console.log("Installing plugins...");
fs.readdirSync(path.join(__dirname, "plugins")).forEach((file) => {
  const plugin = require(`./plugins/${file}`);
  if (typeof plugin === "function") plugin(bot);
});
console.log("Plugins installed.");

// Start bot
bot.launch();
console.log("Bot is running...");

// Keep alive server
const app = express();
app.get("/", (req, res) => res.send("Bot is alive!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Keep-alive server running on port ${PORT}`);
});
