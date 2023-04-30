const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controller/cart.controller");
const authMiddleware = require("../middleware/auth.middleware");

cartRouter.post(
    "/",
    authMiddleware.checkRequired,
    authMiddleware.verifiyToken,
    cartController.createCartByUserID,
);
// 2 hàm hiếu tạo để test
cartRouter.patch("/:id", cartController.update);
cartRouter.patch("/clear/:id", cartController.clear);
// 3 hàm điệp yêu cầu
cartRouter.patch("/addProduct/:id", cartController.addProductByID);
cartRouter.patch(
    "/updateQuantity/:id",
    cartController.updateProductQuantityByID,
);
cartRouter.patch("/deleteProduct/:id", cartController.deleteProductByID);
module.exports = cartRouter;
