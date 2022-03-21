const { default: mongoose } = require("mongoose");
const TwitterUser = require("./TwitterUser");

const userSchema = mongoose.Schema({
    _id: Number,
    username: String,
    firstName: String,
    lastName: String,
    currentCommand: String,
    following: [
        {
            type: String,
            ref: "TwitterUser",
        },
    ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
