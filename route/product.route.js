const express = require("express");
const productRouter = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest;
        if (file.fieldname === "images") {
            dest = path.join(__dirname, "../public/uploads/images");
        } else if (file.fieldname === "thumbnails") {
            dest = path.join(__dirname, "../public/uploads/thumbnails");
        }
        fs.mkdirsSync(dest);
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        const filename = `${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });
const cpUpload = upload.fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnails", maxCount: 10 },
]);

const productController = require("../controller/product.controller");

productRouter.post("/create", cpUpload, productController.create);

productRouter.put("/update/:id", cpUpload, productController.update);

productRouter.delete("/:id", productController.delete);

productRouter.get(
    // "/:id",
    "/:id",
    productController.getProductByID,
);

productRouter.get("/", productController.getAllProduct);

module.exports = productRouter;
