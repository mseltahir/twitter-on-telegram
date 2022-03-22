const { TwitterApi } = require("twitter-api-v2");
const TwitterUser = require("../models/TwitterUser");
require("dotenv").config();

const client = new TwitterApi(process.env.BEARER_TOKEN);

// when a user calls the follow command, I need a funciton to return the
// twitter id of the user to be saved in the database this funciton will
// receive the username and save it with the retrieved id and returns
// true if the request was successful or false if the request was not
const findTwitterUser = async (username) => {
    const user = await client.v2.usersByUsernames(username);
    if (user.errors) {
        return {
            found: false,
            data: null,
        };
    } else {
        let ret = user.data[0];
        const userTweets = await client.v2.userTimeline(user.data[0].id, {
            exclude: "replies",
        });
        try {
            ret.lastTweet = userTweets.tweets[0];
        } catch (err) {
            console.log(err);
            ret.lastTweet = "None";
        }
        return {
            found: true,
            data: ret,
        };
    }
};

const fetchTweets = async () => {
    const ret = {};
    const accounts = await TwitterUser.find();
    for (let account of accounts) {
        ret[account._id] = [];
        let tweets = await client.v2.userTimeline(account._id, {
            exclude: "replies",
        });
        tweets = tweets.tweets;
        let found = 1;
        for (let tweet of tweets) {
            if (tweet.id === account.lastTweet) {
                found = 2;
                account.lastTweet = tweets[0].id;
                await account.save();
                break;
            }
            found = 3;
            ret[account._id].unshift(tweet);
        }
        // TODO: fix the case of long downtime
        if (found === 3) {
            account.lastTweet = tweets[0].id;
            await account.save();
        }
    }
    return ret;
};

module.exports = {
    findTwitterUser,
    fetchTweets,
};
