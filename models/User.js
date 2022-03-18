const { default: mongoose } = require("mongoose");
require("dotenv").config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to database..."))
    .catch((err) => console.error(err));

const userSchema = mongoose.Schema({
    _id: Number,
    username: String,
    firstName: String,
    lastName: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
