const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rankSchema = new Schema(
    {
        leagueId: { type: String },
        queueType: { type: String },
        tier: { type: String },
        rank: { type: String },
        summonerId: { type: String },
        summonerName: { type: String },
        leaguePoints: { type: Number },
        wins: { type: String },
        losses: { type: String },
        veteran: { type: Boolean },
        inactive: { type: Boolean },
        freshBlood: { type: Boolean },
        hotStreak: { type: Boolean },
    },
    {
        timestamps: true,
    },
);

const Rank = mongoose.model("Rank", rankSchema);
module.exports = Rank;