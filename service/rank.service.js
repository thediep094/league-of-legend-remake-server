const User = require("../model/User");
const InGame = require("../model/Ingame");
const mongoose = require("mongoose");

const getSummonerId = async (username) => {
    try {
        const userData = await User.findOne({ username: username });
        const ingameData = await InGame.findOne({ name: userData.ingame });
        return ingameData.id;
    } catch (error) {
        return false;
    }
};

module.exports = { getSummonerId };
