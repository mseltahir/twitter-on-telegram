const { default: mongoose } = require("mongoose");
require("dotenv").config();

const userSchema = mongoose.Schema({
    _id: Number,
    username: String,
    firstName: String,
    lastName: String,
    currentCommand: String,
    following: [String],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
