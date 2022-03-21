const User = require("../models/User");

const add = async (user) => {
    try {
        const checkUser = await find(user.id);
        if (!checkUser.found) {
            return await User.create({
                _id: user.id,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name,
                currentCommand: "None",
                following: [],
            });
        } else {
            return checkUser.user;
        }
    } catch (err) {
        console.log(err.message);
    }
};

const find = async (id) => {
    const user = await User.findById(id);
    return {
        found: user ? true : false,
        user: user,
    };
};

module.exports = { add, find };
