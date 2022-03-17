const axios = require("axios").default;
const TeleBot = require("telebot");
require("dotenv").config();

const bot = new TeleBot(process.env.BOT_TOKEN);

const data = [
    {
        userID: parseInt(process.env.MY_ID),
        currentCommand: null,
        following: [],
    },
];

const findUser = (id) => {
    const index = data.findIndex((user) => user.userID === id);
    return {
        found: index === -1 ? false : true,
        index: index,
    };
};

bot.on("/start", (msg) => {
    const check = findUser(msg.from.id);
    if (!check.found) {
        data.push({
            userID: msg.from.id,
            currentCommand: null,
            following: [],
        });
    }
    msg.reply.text(`Hello ${msg.from.first_name}!\n
Choose a command to do one of the following:\n
/list - to list all the accounts you currently follow
/follow - to follow an account
/unfollow - to unfollow an account`);
});

bot.on("/follow", (msg, props) => {
    msg.reply.text("Enter username below (Twitter handle):");
});

bot.on("/unfollow", (msg, props) => {
    msg.reply.text("Enter username below (Twitter handle):");
});

bot.on("/list", (msg, props) => {
    msg.reply.text("List of the accounts you're following:");
});

bot.on("text", (msg) => {});

bot.start();
