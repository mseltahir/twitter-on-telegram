const { TwitterApi } = require("twitter-api-v2");
const TwitterUser = require("../models/TwitterUser");
require("dotenv").config();

const client = new TwitterApi(process.env.BEARER_TOKEN);

// when a user calls the follow command, I need a funciton to return the
// twitter id of the user to be saved in the database this funciton will
// receive the username and save it with the retrieved id and returns
// true if the request was successful or false if the request was not

async function findTwitterUser(username) {
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
}

async function disarr() {
    const tusers = await TwitterUser.find();
    console.log(tusers);
}
// (async function () {
//     const nodejsTweets = await client.v2.userTimeline("91985735");
//     console.log(nodejsTweets.tweets);
//     console.log(
//         "--------------------------------------------------------------------------------------"
//     );
//     await nodejsTweets.fetchNext();
//     console.log(nodejsTweets.tweets);
//     // for (let tweet of nodejsTweets) {
//     //     console.log(tweet.text);
//     // }
// })();

module.exports = {
    findTwitterUser,
    disarr,
};
