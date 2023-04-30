const Message = require("../model/Message");
const mongoose = require("mongoose");
const User = require("../model/User");

const MessageController = {
    create: async (req, res) => {
        const userid = req.body.user;
        const user = await User.findOne({ _id: userid });
        try {
            if (user) {
                req.body.username = user.username;
                req.body.ingame = user.ingame;
                req.body.mainAva = user.mainAva;
                const newMessage = await Message.create(req.body);
                return res.status(200).json({
                    message: "Tạo message thành công",
                    data: newMessage,
                });
            } else {
                return res.status(404).json({
                    message: "User không tồn tại",
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    getAllMessage: async (req, res) => {},
    getMessageByID: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Message.findById(id);
            if (data) {
                if (data) {
                    return res.status(200).json({
                        message: "Thành công",
                        data: data,
                    });
                }
                return res.status(404).json({
                    message: "Message không tồn tại",
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Message.findByIdAndUpdate(id, req.body);
            if (data) {
                return res.status(200).json({
                    message: "Sửa message thành công",
                    user: data,
                });
            }
            return res.status(404).json({
                message: "Message không tồn tại",
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
            const data = await Message.findByIdAndDelete(id);
            if (data) {
                return res.status(200).json({
                    message: "Xoá message thành công",
                });
            }
            return res.status(404).json({
                message: "Message không tồn tại",
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
};

module.exports = MessageController;
