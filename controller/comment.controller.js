const Comment = require("../model/Comment");
const mongoose = require("mongoose");
const User = require("../model/User");
const Product = require("../model/Product");
const moment = require("moment");
const CommentController = {
    create: async (req, res) => {
        const userId = req.body.userId;
        // const id = req.body.verify_id;
        const { productId } = req.params;
        try {
            const user = await User.findOne({ _id: userId });
            const product = await Product.findOne({ _id: productId });
            if (user && product) {
                req.body.userId = userId;
                req.body.productId = productId;
                const newComment = await Comment.create(req.body);
                return res.status(200).json({
                    message: "Tạo comment thành công",
                    data: newComment,
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
    getAllCommentOfProduct: async (req, res) => {
        try {
            const { productId } = req.params;

            if (!mongoose.isValidObjectId(productId)) {
                return res.status(400).json({
                    message: "productId không hợp lệ",
                });
            }

            const data = await Comment.aggregate([
                {
                    $match: {
                        productId: new mongoose.Types.ObjectId(productId),
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $addFields: {
                        fullname: "$user.fullname",
                        ingame: "$user.ingame",
                    },
                },
                {
                    $project: {
                        user: 0,
                    },
                },
            ]);

            const formattedData = data.map((comment) => {
                const timestamp = moment(comment?.createdAt).fromNow();
                return {
                    ...comment,
                    createdAt: timestamp,
                };
            });

            if (formattedData.length > 0) {
                return res.status(200).json({
                    message: "Lấy comment thành công",
                    data: formattedData,
                });
            } else {
                return res.status(200).json({
                    message: "Không có comment nào",
                    data: formattedData,
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
            const userId = req.body.userId;
            const { productId } = req.params;
            const commentId = req.body.commentId;
            req.body.userId = userId;
            req.body.productId = productId;
            const data = await Comment.findByIdAndUpdate(commentId, req.body, {
                new: true,
            });
            if (data) {
                return res.status(200).json({
                    message: "Sửa comment thành công",
                    user: data,
                });
            }
            return res.status(404).json({
                message: "Comment không tồn tại",
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
            const { productId } = req.params;
            const commentId = req.body.commentId;
            const data = await Comment.findByIdAndDelete(commentId);
            if (data) {
                return res.status(200).json({
                    message: "Xoá comment thành công",
                });
            }
            return res.status(404).json({
                message: "Comment không tồn tại",
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
};

module.exports = CommentController;
