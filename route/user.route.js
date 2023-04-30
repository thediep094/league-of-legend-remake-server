const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/user.controller");
const userMiddleware = require("../middleware/user.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const validateMiddleware = require("../middleware/validate.middleware");

userRouter.post(
    "/",
    userMiddleware.checkRequire,
    userMiddleware.checkExist,
    userController.create,
);

userRouter.put("/:id", userController.update);
userRouter.get(
    // "/:id",
    "/",
    authMiddleware.checkRequired,
    authMiddleware.verifiyToken,
    userController.getUserByID,
);

userRouter.get(
    // "/:id",
    "/me/:id",
    userController.getUserwithRank,
);

userRouter.get("/all", userController.getAllUser);
module.exports = userRouter;
