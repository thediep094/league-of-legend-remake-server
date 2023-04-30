const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inGameSchema = new Schema(
    {
        id: { type: String },
        accountId: { type: String },
        puuid: { type: String },
        name: { type: String },
        profileIconId: { type: String },
        revisionDate: { type: Number },
        summonerLevel: { type: Number },
    },
    {
        timestamps: true,
    },
);

const InGame = mongoose.model("InGame", inGameSchema);
module.exports = InGame;
