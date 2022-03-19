const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

const client = new TwitterApi(process.env.BEARER_TOKEN);

(async function () {
    const nodejsTweets = await client.v2.userTimeline("91985735");
    console.log(nodejsTweets.tweets);
    console.log(
        "--------------------------------------------------------------------------------------"
    );
    await nodejsTweets.fetchNext();
    console.log(nodejsTweets.tweets);
    // for (let tweet of nodejsTweets) {
    //     console.log(tweet.text);
    // }
})();
