const { fetchTweets } = require("../helpers/twitter.h");
const User = require("../models/User");

const update = async (bot) => {
    const tweets = await fetchTweets();
    console.log(tweets);
    const users = await User.find().populate("following");
    for (let user of users) {
        for (let tu of user.following) {
            if (tu._id in tweets) {
                tuTweets = tweets[tu._id];
                for (let tweet of tuTweets) {
                    await bot.sendMessage(
                        user._id,
                        `<b>${tu.name}</b> (<a
                            href="https://twitter.com/${tu.username}">@${tu.username}</a>)\n\n${tweet.text}\n\n<a \
href="https://twitter.com/${tu.username}/status/${tweet.id}">Tweet \
Link</a>`,
                        { parseMode: "HTML", webPreview: false }
                    );
                }
            }
        }
    }
};

module.exports = update;
