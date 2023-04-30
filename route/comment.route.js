const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controller/comment.controller");

commentRouter.post("/:productId", commentController.create);
commentRouter.get("/:productId", commentController.getAllCommentOfProduct);
commentRouter.patch("/:productId", commentController.update);
commentRouter.delete("/:productId", commentController.delete);

module.exports = commentRouter;