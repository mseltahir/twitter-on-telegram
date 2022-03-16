const axios = require("axios").default;
const TeleBot = require("telebot");
require("dotenv").config();

// axios({
//     url: "https://api.twitter.com/2/users/by/username/nodejs",
//     headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
// }).then((res) => console.log(res));

const data = [{}];

const bot = new TeleBot(process.env.BOT_TOKEN);

bot.on("/start", (msg) => {
    msg.reply.text("Hello");
    if (data[msg.chat.id]) {
        data[msg.chat.id] = { following: [], currentCommand: "None" };
    }
});

bot.on("/follow", (msg) => {
    msg.reply.text("Please send the username(Starting with @):");
    data[msg.chat.id].currentCommand = "follow";
});

bot.on("/unfollow", (msg) => {
    msg.reply.text("Please send the username(Starting with @):");
});
bot.on("/list", (msg) => {
    msg.reply.text("Please send the username(Starting with @):");
});
bot.on(/^@/, (msg) => {
    msg.reply.text(msg.text);
    //twitter api
    if (data[msg.chat.i].currentCommand == "follow") {
        data[msg.chat.id].following.push(msg.text.slice(1));
    } else if (data[msg.chat.i].currentCommand == "unfollow") {
    }
});

module.exports = bot;
