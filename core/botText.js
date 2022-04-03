const UserHelper = require("../helpers/user.h");

const COMMANDS = ["/start", "/follow", "/unfollow", "/list", "/help"];

const botText = async (bot, msg) => {
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
};

module.exports = botText;
