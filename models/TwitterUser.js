const { default: mongoose } = require("mongoose");

const twitterUserSchema = mongoose.Schema({
    _id: String,
    username: String,
    name: String,
    lastTweet: String,
});

const TwitterUser = mongoose.model("TwitterUser", twitterUserSchema);

module.exports = TwitterUser;
