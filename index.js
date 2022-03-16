const axios = require("axios").default;
const { Telegraf } = require("telegraf");
require("dotenv").config();

// axios({
//     url: "https://api.twitter.com/2/users/by/username/nodejs",
//     headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
// }).then((res) => console.log(res));

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply("Hello human :)"));
bot.command("list", (ctx) => ctx.reply("List of accounts you're following"));
bot.command("follow", (ctx) => ctx.reply("Enter username"));
bot.command("unfollow", (ctx) => ctx.reply("Enter username"));
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
