const User = require("../models/User");

const addUser = async (user) => {
    try {
        return await User.create({
            _id: user.id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            currentCommand: "None",
            following: [],
        });
    } catch (err) {
        console.log(err.message);
    }
};

const findUser = async (id) => {
    const user = await User.findById(id);
    return {
        found: user ? true : false,
        user: user,
    };
};

module.exports = { addUser, findUser };
