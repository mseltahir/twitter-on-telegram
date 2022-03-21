const { default: mongoose } = require("mongoose");
require("dotenv").config();

const twitterUser = mongoose.Schema({
    id: String,
    username: String,
    name: String,
});

const userSchema = mongoose.Schema({
    _id: Number,
    username: String,
    firstName: String,
    lastName: String,
    currentCommand: String,
    following: [twitterUser],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
