const { fetchTweets } = require("../helpers/twitter.h");
const User = require("../models/User");

const URL = "https://twitter.com";

// TODO: implement this in a better way.
const update = async (bot) => {
    const tweets = await fetchTweets();
    // console.log(tweets);
    const users = await User.find().populate("following");
    for (let user of users) {
        for (let tu of user.following) {
            if (tu._id in tweets) {
                tuTweets = tweets[tu._id];
                for (let tweet of tuTweets) {
                    const text = `<b>${tu.name}</b> (<a 
                            href="${URL}/${tu.username}">@${tu.username}</a>)\n\n${tweet.text}\n\n<a 
                            href="${URL}/${tu.username}/status/${tweet.id}">Tweet Link</a>`.replace(
                        /  +/g,
                        ""
                    );
                    await bot.sendMessage(user._id, text, {
                        parseMode: "HTML",
                        webPreview: false,
                    });
                }
            }
        }
    }
};

module.exports = update;
