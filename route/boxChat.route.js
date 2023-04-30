const express = require("express");
const BoxChatRouter = express.Router();
const BoxChatController = require("../controller/boxChat.controller");

BoxChatRouter.post("/", BoxChatController.create);
BoxChatRouter.get("/:id", BoxChatController.getBCByID);
BoxChatRouter.delete("/:id", BoxChatController.delete);
BoxChatRouter.get("/messages/:id", BoxChatController.getAllMessage);

module.exports = BoxChatRouter;
