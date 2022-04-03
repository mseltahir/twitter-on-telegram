const UserHelper = require("../helpers/user.h");
const TwitterUserHelper = require("../helpers/twitteruser.h");
const { findTwitterUser } = require("../helpers/twitter.h");

const URL = "https://twitter.com";

const botAt = async (bot, msg) => {
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
};

module.exports = botAt;
