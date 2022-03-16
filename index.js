const axios = require("axios").default;
const TeleBot = require("telebot");
require("dotenv").config();

// axios({
//     url: "https://api.twitter.com/2/users/by/username/nodejs",
//     headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
// }).then((res) => console.log(res));

const bot = new TeleBot(process.env.BOT_TOKEN);

bot.on("/start", (msg) => {
    // bot.sendMessage(msg.chat.id, "hello", { replyToMessage: msg.message_id });
    // console.log(msg);
});

bot.start();
