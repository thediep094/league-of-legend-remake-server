const express = require("express");
const ingameRouter = express.Router();
const ingameController = require("../controller/ingame.controller")

ingameRouter.get(
    "/search",
    ingameController.getIngameBySummonerName,
);

module.exports = ingameRouter