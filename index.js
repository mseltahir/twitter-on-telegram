const { default: mongoose } = require("mongoose");
const TeleBot = require("telebot");

const UserHelper = require("./helpers/user.h");
const TwitterUserHelper = require("./helpers/twitteruser.h");
const { findTwitterUser, disarr } = require("./helpers/twitter.h");
const TwitterUser = require("./models/TwitterUser");
require("dotenv").config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to database..."))
    .catch((err) => console.error(err));

const bot = new TeleBot(process.env.BOT_TOKEN);

bot.on(["/start", "/help"], async (msg) => {
    const user = await UserHelper.add(msg.from);
    msg.reply.text(`Hello ${msg.from.first_name}!\n
Choose a command to do one of the following:\n
/list - to list all the accounts you currently follow
/follow - to follow an account
/unfollow - to unfollow an account`);
});

bot.on("/follow", async (msg) => {
    const checkUser = await UserHelper.find(msg.from.id);
    const user = checkUser.user;
    user.currentCommand = "follow";
    await user.save();
    msg.reply.text("Enter Twitter handle below (must start with @):");
});

bot.on("/unfollow", async (msg) => {
    const checkUser = await UserHelper.find(msg.from.id);
    const user = checkUser.user;
    user.currentCommand = "unfollow";
    await user.save();
    msg.reply.text("Enter Twitter handle below (must start with @):");
});

bot.on("/list", async (msg) => {
    try {
        const checkUser = await UserHelper.find(msg.from.id);
        const user = checkUser.user;
        msg.reply.text(`List of the accounts you're following:`);
    } catch (err) {
        console.error(err);
    }
});

bot.on("text", async (msg) => {
    const checkUser = await UserHelper.find(msg.from.id);
    const user = checkUser.user;

    if (
        ["/start", "/follow", "/unfollow", "/list", "/help"].includes(
            msg.text
        ) ||
        msg.text[0] === "@"
    ) {
        return;
    }
    if (checkUser.found) {
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
    msg.reply.text("Use available commands only.");
});

bot.on(/^@/, async (msg) => {
    const checkUser = await UserHelper.find(msg.from.id);
    const user = checkUser.user;

    const handle = msg.text.substring(1);
    const twitterUser = await findTwitterUser(handle);
    if (!twitterUser.found) {
        msg.reply.text(
            `There is no Twitter user with this username (@${handle})`
        );
        user.currentCommand = "None";
        await user.save();
        return;
    }
    const idx = user.following.findIndex((id) => id === twitterUser.data.id);

    if (user.currentCommand === "follow") {
        // follow
        if (idx === -1) {
            user.following.push(twitterUser.data.id);
            await TwitterUserHelper.add(twitterUser.data);
            await disarr();
            msg.reply.text(`Followed @${handle}`);
        } else {
            msg.reply.text(`@${handle} is already followed`);
        }
        user.currentCommand = "None";
        await user.save();
    } else if (user.currentCommand === "unfollow") {
        // unfollow
        if (idx !== -1) {
            user.following.splice(idx, 1);
            msg.reply.text(`Unfollowed @${handle}`);
        } else {
            msg.reply.text(`@${handle} is not in your following list`);
        }
        user.currentCommand = "None";
        await user.save();
    } else {
        msg.reply.text("Use a valid command before entering a username.");
    }
});

bot.start();
