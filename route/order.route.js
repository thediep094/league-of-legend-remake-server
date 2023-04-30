const express = require("express");
const orderRouter = express.Router();
const orderController = require("../controller/order.controller");
const authMiddleware = require("../middleware/auth.middleware");

// tạo order
orderRouter.post("/", orderController.createOrder);

// get order by order id
orderRouter.get("/:id", orderController.getOrdersByID);

// get order by user id
orderRouter.get(
    "/",
    authMiddleware.checkRequired,
    authMiddleware.verifiyToken,
    orderController.getOrdersByUser,
);

module.exports = orderRouter;
