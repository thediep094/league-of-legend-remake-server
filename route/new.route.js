const express = require("express");
const newRouter = express.Router();
const newController = require("../controller/new.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest;
        dest = path.join(__dirname, "../public/uploads/news");
        fs.mkdirsSync(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const filename = `${file.originalname}`;
        cb(null, filename);
    },
});
var upload = multer({
    storage: storage,
});

newRouter.put("/:id", upload.single("img"), newController.updateNewById);
newRouter.delete("/:id", newController.deleteNewById);
newRouter.post("/", upload.single("img"), newController.create);
newRouter.get("/:id", newController.getNewById);
newRouter.get("/", newController.getAllNews);
module.exports = newRouter;
