const UserHelper = require("../helpers/user.h");

const botFollow = async (bot, msg) => {
    const checkUser = await UserHelper.find(msg.from.id);
    const user = checkUser.user;
    user.currentCommand = "follow";
    await user.save();
    bot.sendMessage(
        msg.from.id,
        "Enter Twitter handle below\n(<u><b>must start with @</b></u>)",
        { parseMode: "HTML" }
    );
};

module.exports = botFollow;
