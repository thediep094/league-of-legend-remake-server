const express = require("express");
const rankRouter = express.Router();
const rankController = require("../controller/rank.controller");

rankRouter.post("/search", rankController.getRankByUsername);

rankRouter.get("/update", rankController.updateRankbyUsername);

rankRouter.get("/solo", rankController.getAllRankSolo);

rankRouter.get("/flex", rankController.getAllRankFlex);

module.exports = rankRouter;
