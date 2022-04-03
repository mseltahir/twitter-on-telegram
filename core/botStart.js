const UserHelper = require("../helpers/user.h");

const botStart = async (bot, msg) => {
    await UserHelper.add(msg.from);
    bot.sendMessage(
        msg.from.id,
        `<b>Hello there!</b>\n
        Choose a command to do one of the following:\n
        /list - list the accounts you currently follow
        /follow - follow an account
        /unfollow - unfollow an account`.replace(/  +/g, ""),
        { parseMode: "HTML" }
    );
};

module.exports = botStart;
