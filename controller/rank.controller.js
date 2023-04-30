const Rank = require("../model/Rank");
const mongoose = require("mongoose");
const axios = require("axios");
const { getSummonerId } = require("../service/rank.service");
const { options } = require("../route/rank.route");

const RankController = {
    getRankByUsername: async (req, res) => {
        try {
            const { username } = req.body;
            const summonerId = await getSummonerId(username);
            const data = await Rank.find({ summonerId: summonerId });
            if (data.length > 0) {
                return res.status(200).json({
                    message: "Thành công",
                    rank: data,
                });
            }

            await axios
                .get(
                    `https://vn2.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
                    {
                        headers: {
                            "X-Riot-Token": process.env.RIOT_KEY,
                        },
                    },
                )
                .then(async (response) => {
                    const rankData = await Rank.create(response.data);
                    return res.status(200).json({
                        message: "Thành công",
                        data: rankData,
                    });
                })
                .catch(function (err) {
                    return res.status(404).json({
                        message: "Rank không tồn tại",
                    });
                });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    updateRankbyUsername: async (req, res) => {
        try {
            const { username } = req.body;

            const summonerId = await getSummonerId(username);
            await axios
                .get(
                    `https://vn2.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
                    {
                        headers: {
                            "X-Riot-Token": process.env.RIOT_KEY,
                        },
                    },
                )
                .then(async (response) => {
                    const rankData = response.data;
                    const result = await Rank.deleteMany({ summonerId });
                    const updateRanks = await Rank.create(rankData);
                    return res.status(200).json({
                        message: "Thành công",
                        data: updateRanks,
                    });
                })
                .catch(function (err) {
                    return res.status(404).json({
                        message: "Rank không tồn tại",
                    });
                });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    getAllRankSolo: async (req, res) => {
        try {
            const data = await Rank.aggregate([
                {
                    $match: { queueType: "RANKED_SOLO_5x5" },
                },
                {
                    $lookup: {
                        from: "ingames",
                        localField: "summonerId",
                        foreignField: "id",
                        as: "summoner",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "summonerName",
                        foreignField: "ingame",
                        as: "user",
                    },
                },
                {
                    $project: {
                        tier: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$tier", "CHALLENGER"] },
                                        then: 1,
                                    },
                                    {
                                        case: { $eq: ["$tier", "GRANDMASTER"] },
                                        then: 2,
                                    },
                                    {
                                        case: { $eq: ["$tier", "MASTER"] },
                                        then: 3,
                                    },
                                    {
                                        case: { $eq: ["$tier", "DIAMOND"] },
                                        then: 4,
                                    },
                                    {
                                        case: { $eq: ["$tier", "PLATINUM"] },
                                        then: 5,
                                    },
                                    {
                                        case: { $eq: ["$tier", "GOLD"] },
                                        then: 6,
                                    },
                                    {
                                        case: { $eq: ["$tier", "SILVER"] },
                                        then: 7,
                                    },
                                    {
                                        case: { $eq: ["$tier", "BRONZE"] },
                                        then: 8,
                                    },
                                    {
                                        case: { $eq: ["$tier", "IRON"] },
                                        then: 9,
                                    },
                                ],
                                default: 10,
                            },
                        },
                        rank: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$rank", "I"] }, then: 1 },
                                    { case: { $eq: ["$rank", "II"] }, then: 2 },
                                    {
                                        case: { $eq: ["$rank", "III"] },
                                        then: 3,
                                    },
                                    { case: { $eq: ["$rank", "IV"] }, then: 4 },
                                ],
                                default: 5,
                            },
                        },
                        summonerId: 1,
                        leaguePoints: 1,
                        summonerName: 1,
                        wins: 1,
                        losses: 1,
                        "summoner.profileIconId": 1,
                        "summoner.summonerLevel": 1,
                        "user._id": 1,
                    },
                },
                {
                    $sort: {
                        tier: 1,
                        rank: 1,
                        leaguePoints: -1,
                        summonerName: 1,
                    },
                },
                {
                    $project: {
                        tier: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$tier", 1] },
                                        then: "CHALLENGER",
                                    },
                                    {
                                        case: { $eq: ["$tier", 2] },
                                        then: "GRANDMASTER",
                                    },
                                    {
                                        case: { $eq: ["$tier", 3] },
                                        then: "MASTER",
                                    },
                                    {
                                        case: { $eq: ["$tier", 4] },
                                        then: "DIAMOND",
                                    },
                                    {
                                        case: { $eq: ["$tier", 5] },
                                        then: "PLATINUM",
                                    },
                                    {
                                        case: { $eq: ["$tier", 6] },
                                        then: "GOLD",
                                    },
                                    {
                                        case: { $eq: ["$tier", 7] },
                                        then: "SILVER",
                                    },
                                    {
                                        case: { $eq: ["$tier", 8] },
                                        then: "BRONZE",
                                    },
                                    {
                                        case: { $eq: ["$tier", 9] },
                                        then: "IRON",
                                    },
                                ],
                                default: "UNRANK",
                            },
                        },
                        rank: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$rank", 1] }, then: "I" },
                                    { case: { $eq: ["$rank", 2] }, then: "II" },
                                    {
                                        case: { $eq: ["$rank", 3] },
                                        then: "III",
                                    },
                                    { case: { $eq: ["$rank", 4] }, then: "IV" },
                                ],
                                default: "",
                            },
                        },
                        summonerId: 1,
                        leaguePoints: 1,
                        summonerName: 1,
                        wins: 1,
                        losses: 1,
                        "summoner.profileIconId": 1,
                        "summoner.summonerLevel": 1,
                        "user._id": 1,
                    },
                },
            ]);

            return res.status(200).json({
                message: "Thành công",
                data: data,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    getAllRankFlex: async (req, res) => {
        try {
            const data = await Rank.aggregate([
                {
                    $match: { queueType: "RANKED_FLEX_SR" },
                },
                {
                    $lookup: {
                        from: "ingames",
                        localField: "summonerId",
                        foreignField: "id",
                        as: "summoner",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "summonerName",
                        foreignField: "ingame",
                        as: "user",
                    },
                },
                {
                    $project: {
                        tier: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$tier", "CHALLENGER"] },
                                        then: 1,
                                    },
                                    {
                                        case: { $eq: ["$tier", "GRANDMASTER"] },
                                        then: 2,
                                    },
                                    {
                                        case: { $eq: ["$tier", "MASTER"] },
                                        then: 3,
                                    },
                                    {
                                        case: { $eq: ["$tier", "DIAMOND"] },
                                        then: 4,
                                    },
                                    {
                                        case: { $eq: ["$tier", "PLATINUM"] },
                                        then: 5,
                                    },
                                    {
                                        case: { $eq: ["$tier", "GOLD"] },
                                        then: 6,
                                    },
                                    {
                                        case: { $eq: ["$tier", "SILVER"] },
                                        then: 7,
                                    },
                                    {
                                        case: { $eq: ["$tier", "BRONZE"] },
                                        then: 8,
                                    },
                                    {
                                        case: { $eq: ["$tier", "IRON"] },
                                        then: 9,
                                    },
                                ],
                                default: 10,
                            },
                        },
                        rank: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$rank", "I"] }, then: 1 },
                                    { case: { $eq: ["$rank", "II"] }, then: 2 },
                                    {
                                        case: { $eq: ["$rank", "III"] },
                                        then: 3,
                                    },
                                    { case: { $eq: ["$rank", "IV"] }, then: 4 },
                                ],
                                default: 5,
                            },
                        },
                        summonerId: 1,
                        leaguePoints: 1,
                        summonerName: 1,
                        wins: 1,
                        losses: 1,
                        "summoner.profileIconId": 1,
                        "summoner.summonerLevel": 1,
                        "user._id": 1,
                    },
                },
                {
                    $sort: {
                        tier: 1,
                        rank: 1,
                        leaguePoints: -1,
                        summonerName: 1,
                    },
                },
                {
                    $project: {
                        tier: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$tier", 1] },
                                        then: "CHALLENGER",
                                    },
                                    {
                                        case: { $eq: ["$tier", 2] },
                                        then: "GRANDMASTER",
                                    },
                                    {
                                        case: { $eq: ["$tier", 3] },
                                        then: "MASTER",
                                    },
                                    {
                                        case: { $eq: ["$tier", 4] },
                                        then: "DIAMOND",
                                    },
                                    {
                                        case: { $eq: ["$tier", 5] },
                                        then: "PLATINUM",
                                    },
                                    {
                                        case: { $eq: ["$tier", 6] },
                                        then: "GOLD",
                                    },
                                    {
                                        case: { $eq: ["$tier", 7] },
                                        then: "SILVER",
                                    },
                                    {
                                        case: { $eq: ["$tier", 8] },
                                        then: "BRONZE",
                                    },
                                    {
                                        case: { $eq: ["$tier", 9] },
                                        then: "IRON",
                                    },
                                ],
                                default: "UNRANK",
                            },
                        },
                        rank: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$rank", 1] }, then: "I" },
                                    { case: { $eq: ["$rank", 2] }, then: "II" },
                                    {
                                        case: { $eq: ["$rank", 3] },
                                        then: "III",
                                    },
                                    { case: { $eq: ["$rank", 4] }, then: "IV" },
                                ],
                                default: "",
                            },
                        },
                        summonerId: 1,
                        leaguePoints: 1,
                        summonerName: 1,
                        wins: 1,
                        losses: 1,
                        "summoner.profileIconId": 1,
                        "summoner.summonerLevel": 1,
                        "user._id": 1,
                    },
                },
            ]);

            return res.status(200).json({
                message: "Thành công",
                data: data,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
};

module.exports = RankController;
