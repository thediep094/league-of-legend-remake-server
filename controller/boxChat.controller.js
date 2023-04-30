const BoxChat = require("../model/BoxChat");
const mongoose = require("mongoose");
const { getAllMessageOfBoxChat } = require("../service/message.service");

const BoxChatController = {
    create: async (req, res) => {
        try {
            // console.log(req.body);
            const { user1, user2 } = req.body;
            let check = await BoxChat.find(req.body);
            if (check.length == 0) {
                check = await BoxChat.find({
                    user1: user2,
                    user2: user1,
                });
            }
            if (check.length > 0) {
                return res.status(200).json({
                    message: "Giữa 2 người dùng đã có boxchat",
                    id: check[0]._id,
                });
            }
            const newBoxChat = await BoxChat.create(req.body);
            // console.log(newBoxChat);
            return res.status(200).json({
                message: "Tạo boxchat thành công",
                id: newBoxChat._id,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    getAllMessage: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await getAllMessageOfBoxChat(id);
            // console.log(data);
            if (!data) {
                return res.status(500).json({
                    message: "Server error",
                    error: "",
                });
            }
            return res.status(200).json({
                message: "Get message thành công",
                data: data,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    getBCByID: async (req, res) => {
        try {
            const { id } = req.params;
            const chat = await BoxChat.findById(id);
            if (chat) {
                return res.status(200).json({
                    message: "Tìm thấy boxchat",
                    data: chat,
                });
            }
            return res.status(404).json({
                message: "Boxchat không tồn tại",
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await BoxChat.findByIdAndDelete(id);
            if (data) {
                return res.status(200).json({
                    message: "Xoá boxchat thành công",
                });
            }
            return res.status(404).json({
                message: "Boxchat không tồn tại",
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
};

module.exports = BoxChatController;
