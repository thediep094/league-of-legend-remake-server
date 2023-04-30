const Order = require("../model/Order");
const mongoose = require("mongoose");

const OrderController = {
    createOrder: async (req, res) => {
        try {
            const { userID, items, total, status } = req.body;

            const newOrder = await Order.create({
                userID,
                items,
                total,
                status,
            });
            return res.status(201).json({
                message: "Created order successfully",
                data: newOrder,
            });
        } catch (error) {
            console.log("Lỗi ở hàm createOrder:");
            return res.status(500).json({
                message: "Server error",
                error,
            });
        }
    },
    // get by order id
    getOrdersByID: async (req, res) => {
        try {
            const id = req.params.id;

            const orders = await Order.findOne({ _id: id }).populate(
                "items.product",
            );
            if (orders == null) {
                return res.status(404).json({
                    message: "Order không tồn tại",
                });
            }
            return res.status(200).json({
                message: "Get order by id successfully",
                data: orders,
            });
        } catch (error) {
            console.log("Lỗi ở hàm getOrdersByID:");
            return res.status(500).json({
                message: "Server error",
                error,
            });
        }
    },
    //get by user id
    getOrdersByUser: async (req, res) => {
        try {
            const userID = req.body.verify_id;
            // console.log(userID);
            const orders = await Order.find({ userID }).populate(
                "items.product",
            );
            if (orders.length == 0) {
                return res.status(404).json({
                    message: "Không tìm thấy order nào",
                });
            }
            return res.status(200).json({
                message: "Get order by id successfully",
                data: orders,
            });
        } catch (error) {
            console.log("Lỗi ở hàm getOrdersByUser:");
            return res.status(500).json({
                message: "Server error",
                error,
            });
        }
    },
};

module.exports = OrderController;
