const TwitterUser = require("../models/TwitterUser");

const add = async (tuser) => {
    try {
        const checkTwitterUser = await find(tuser.id);
        if (!checkTwitterUser.found) {
            return await TwitterUser.create({
                _id: tuser.id,
                username: tuser.username,
                name: tuser.name,
                lastTweet: tuser.lastTweet.id,
            });
        } else {
            return checkTwitterUser.user;
        }
    } catch (err) {
        console.log(err.message);
    }
};

const find = async (id) => {
    const user = await TwitterUser.findById(id);
    return {
        found: user ? true : false,
        user: user,
    };
};

module.exports = { add, find };
