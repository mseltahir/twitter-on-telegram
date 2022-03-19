const { default: mongoose } = require("mongoose");
const TeleBot = require("telebot");

const UserHelper = require("./helpers/user.h");
require("dotenv").config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to database..."))
    .catch((err) => console.error(err));

const bot = new TeleBot(process.env.BOT_TOKEN);

const data = [
    {
        // userID: parseInt(process.env.MY_ID),
        // currentCommand: "None",
        // following: [],
    },
];

const findUser = (id) => {
    const index = data.findIndex((user) => user.userID === id);
    return {
        found: index === -1 ? false : true,
        index: index,
    };
};

const addUser = (id, ...rest) => {
    data.push({
        userID: id,
        currentCommand: rest.length ? rest[0] : "None",
        following: [],
    });
};

bot.on("/start", async (msg) => {
    const checkUser = await UserHelper.find(msg.from.id);
    if (!checkUser.found) {
        const user = await UserHelper.add(msg.from);
    }
    msg.reply.text(`Hello ${msg.from.first_name}!\n
Choose a command to do one of the following:\n
/list - to list all the accounts you currently follow
/follow - to follow an account
/unfollow - to unfollow an account`);
});

bot.on("/follow", (msg, props) => {
    const check = findUser(msg.from.id);
    data[check.index].currentCommand = "follow";
    console.log(data);
    msg.reply.text("Enter Twitter handle below (must start with @):");
});

bot.on("/unfollow", (msg, props) => {
    const check = findUser(msg.from.id);
    data[check.index].currentCommand = "unfollow";
    console.log(data);
    msg.reply.text("Enter Twitter handle below (must start with @):");
});

bot.on("/list", (msg, props) => {
    const check = findUser(msg.from.id);
    msg.reply.text("List of the accounts you're following:");
});

bot.on("text", (msg, props) => {
    const check = findUser(msg.from.id);
    if (check.found) {
        const user = data[check.index];
        if (
            user.currentCommand === "follow" ||
            user.currentCommand === "unfollow"
        ) {
            if (msg.text[0] !== "@") {
                msg.reply.text("Username (handle) must start with @");
                return;
            }
        }
    }
    if (
        ["/start", "/follow", "/unfollow", "/list"].includes(msg.text) ||
        msg.text[0] === "@"
    ) {
        return;
    }
    msg.reply.text("Use available commands only.");
});

bot.on(/^@/, (msg, props) => {
    const check = findUser(msg.from.id);
    const user = data[check.index];
    if (user.currentCommand === "follow") {
        msg.reply.text(`Followed ${msg.text}`);
        // follow
        user.currentCommand = "None";
    } else if (user.currentCommand === "unfollow") {
        msg.reply.text(`Unfollowed ${msg.text}`);
        // unfollow
        user.currentCommand = "None";
    } else {
        msg.reply.text("Use a valid command before entering a username.");
    }
});

bot.start();
