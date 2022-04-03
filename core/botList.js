const User = require("../models/User");

const URL = "https://twitter.com";

const botList = async (bot, msg) => {
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
};

module.exports = botList;
