const InGame = require("../model/Ingame");
const mongoose = require("mongoose");
const axios = require("axios");
const User = require("../model/User");

const InGameController = {
    getIngameBySummonerName: async (req, res) => {
        try {
            const { summonerName } = req.query;

            if (!summonerName) {
                return res.status(404).json({
                    message: "Ingame không tồn tại",
                });
            }
            const data = await InGame.findOne({ name: summonerName });
            if (data) {
                return res.status(200).json({
                    message: "Thành công",
                    ingame: data,
                });
            }
            await axios
                .get(
                    `https://vn2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
                    {
                        headers: {
                            "X-Riot-Token": process.env.RIOT_KEY,
                        },
                    },
                )
                .then(async (response) => {
                    const inGameData = await InGame.create(response.data);

                    return res.status(200).json({
                        message: "Thành công",
                        data: inGameData,
                    });
                })
                .catch(function (err) {
                    return res.status(404).json({
                        message: "Ingame không tồn tại",
                    });
                });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
};

module.exports = InGameController;
