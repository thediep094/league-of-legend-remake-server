const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controller/message.controller");

messageRouter.post("/", messageController.create);
messageRouter.get("/:id", messageController.getMessageByID);
messageRouter.patch("/:id", messageController.update);
messageRouter.delete("/:id", messageController.delete);

module.exports = messageRouter;
