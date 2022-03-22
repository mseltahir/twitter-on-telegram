const { default: mongoose } = require("mongoose");
const TeleBot = require("telebot");

const UserHelper = require("./helpers/user.h");
const TwitterUserHelper = require("./helpers/twitteruser.h");
const { findTwitterUser } = require("./helpers/twitter.h");
const TwitterUser = require("./models/TwitterUser");
const User = require("./models/User");
const update = require("./core/update");
require("dotenv").config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to database..."))
    .catch((err) => console.log("[Connecting to database ERROR] ", err));

const URL = "https://twitter.com";
const COMMANDS = ["/start", "/follow", "/unfollow", "/list", "/help"];
const bot = new TeleBot(process.env.BOT_TOKEN);

bot.on(["/start", "/help"], async (msg) => {
    const user = await UserHelper.add(msg.from);
    bot.sendMessage(
        msg.from.id,
        `<b>Hello there!</b>\n
        Choose a command to do one of the following:\n
        /list - list the accounts you currently follow
        /follow - follow an account
        /unfollow - unfollow an account`.replace(/  +/g, ""),
        { parseMode: "HTML" }
    );
});

bot.on("/follow", async (msg) => {
    const checkUser = await UserHelper.find(msg.from.id);
    const user = checkUser.user;
    user.currentCommand = "follow";
    await user.save();
    bot.sendMessage(
        msg.from.id,
        "Enter Twitter handle below\n(<u><b>must start with @</b></u>)",
        { parseMode: "HTML" }
    );
});

bot.on("/unfollow", async (msg) => {
    const checkUser = await UserHelper.find(msg.from.id);
    const user = checkUser.user;
    user.currentCommand = "unfollow";
    await user.save();
    bot.sendMessage(
        msg.from.id,
        "Enter Twitter handle below\n(<u><b>must start with @</b></u>)",
        { parseMode: "HTML" }
    );
});

bot.on("/list", async (msg) => {
    try {
        let text = "<i>List of the accounts you're following</i>\n\n";
        const user = await User.findById(msg.from.id);
        // console.log(`[bot.on /list logging user]: ${user}`);
        await user.populate("following");
        // console.log(`[bot.on /list logging user]: ${user}`);
        if (user.following.length === 0) {
            text += `<b>None</b>`;
        } else {
            for (let tu of user.following) {
                // console.log(`[bot.on /list logging user]: ${tu}\n\n`);
                text += `- <b>${tu.name}</b> (<a href="${URL}/${tu.username}">@${tu.username}</a>)\n`;
            }
        }
        bot.sendMessage(msg.from.id, text, {
            parseMode: "HTML",
            webPreview: false,
        }).catch((err) =>
            console.log("[bot.on /list sending text ERROR] ", err)
        );
    } catch (err) {
        console.log("[bot.on /list ERROR] ", err);
    }
});

bot.on("text", async (msg) => {
    const checkUser = await UserHelper.find(msg.from.id);
    const user = checkUser.user;

    if (COMMANDS.includes(msg.text) || msg.text[0] === "@") {
        return;
    }
    if (checkUser.found) {
        if (
            user.currentCommand === "follow" ||
            user.currentCommand === "unfollow"
        ) {
            if (msg.text[0] !== "@") {
                bot.sendMessage(
                    msg.from.id,
                    "Username (handle) <u><b>must start with @</b></u>",
                    { parseMode: "HTML" }
                );
                return;
            }
        }
    }
    bot.sendMessage(msg.from.id, "Use available commands only.");
});

bot.on(/^@/, async (msg) => {
    if (!/^@?(\w){1,15}$/.test(msg.text)) {
        bot.sendMessage(
            msg.from.id,
            `Username must contain only alphanumeric characters or underscores. And it must not exceed 15 characters.`
        );
        return;
    }
    const checkUser = await UserHelper.find(msg.from.id);
    const user = checkUser.user;

    const handle = msg.text.substring(1);
    const twitterUser = await findTwitterUser(handle);
    if (!twitterUser.found) {
        bot.sendMessage(
            msg.from.id,
            `There is no Twitter account with this username (<b>${handle}</b>) ❌\n\nMake sure you're spelling it correctly.`,
            { parseMode: "HTML" }
        );
        user.currentCommand = "None";
        await user.save();
        return;
    }
    const idx = user.following.findIndex((id) => id === twitterUser.data.id);

    if (user.currentCommand === "follow") {
        // follow
        if (idx === -1) {
            // console.log(`[bot.on @ follow]\n${JSON.stringify(twitterUser)}`);
            const isAdded = await TwitterUserHelper.add(twitterUser.data);
            if (isAdded) {
                user.following.push(twitterUser.data.id);
                bot.sendMessage(
                    msg.from.id,
                    `Followed <a href="${URL}/${handle}">@${handle}</a> ✅`,
                    {
                        parseMode: "HTML",
                        webPreview: false,
                    }
                ).catch((err) =>
                    console.log("[bot.on @ following ERROR] ", err)
                );
            } else {
                bot.sendMessage(
                    msg.from.id,
                    `Private account error ❌\n
                    This account (<a href="${URL}/${handle}">@${handle}</a>) is private.
                    You can only follow public accounts.`.replace(/  +/g, ""),
                    {
                        parseMode: "HTML",
                        webPreview: false,
                    }
                ).catch((err) =>
                    console.log("[bot.on @ following ERROR] ", err)
                );
            }
        } else {
            bot.sendMessage(
                msg.from.id,
                `<a href="${URL}/${handle}">@${handle}</a> is already followed`,
                {
                    parseMode: "HTML",
                    webPreview: false,
                }
            );
        }
        user.currentCommand = "None";
        await user.save();
    } else if (user.currentCommand === "unfollow") {
        // unfollow
        if (idx !== -1) {
            user.following.splice(idx, 1);
            bot.sendMessage(
                msg.from.id,
                `Unfollowed <a href="${URL}/${handle}">@${handle}</a> ✅`,
                {
                    parseMode: "HTML",
                    webPreview: false,
                }
            );
        } else {
            bot.sendMessage(
                msg.from.id,
                `<a href="${URL}/${handle}">@${handle}</a> is not in your following list`,
                {
                    parseMode: "HTML",
                    webPreview: false,
                }
            );
        }
        user.currentCommand = "None";
        await user.save();
    } else {
        bot.sendMessage(
            msg.from.id,
            "Use a valid command before entering a username."
        );
    }
});

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
