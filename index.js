const { default: mongoose } = require("mongoose");
const TeleBot = require("telebot");

const botStart = require("./core/botStart");
const botFollow = require("./core/botFollow");
const botUnfollow = require("./core/botUnfollow");
const botList = require("./core/botList");
const botText = require("./core/botText");
const botAt = require("./core/botAt");
const update = require("./core/update");

require("dotenv").config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to database..."))
    .catch((err) => console.log("[Connecting to database ERROR] ", err));

const bot = new TeleBot(process.env.BOT_TOKEN);

bot.on(["/start", "/help"], async (msg) => botStart(bot, msg));
bot.on("/follow", async (msg) => botFollow(bot, msg));
bot.on("/unfollow", async (msg) => botUnfollow(bot, msg));
bot.on("/list", async (msg) => botList(bot, msg));
bot.on("text", async (msg) => botText(bot, msg));
bot.on(/^@/, async (msg) => botAt(bot, msg));

bot.start();

let i = 0;
setInterval(async () => {
    try {
        await update(bot);
        console.log(`${i}: updated`);
        i++;
    } catch (err) {
        console.log("[ERROR] ", err);
    }
}, 300000);
