const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const newSchema = new Schema(
    {
        title: { type: String, require: true },
        subtitle: { type: String, require: true },
        description: { type: String, require: true },
        expect: { type: String, require: true },
        author: { type: String, default: "x2muadacam" },
        tags: { type: String },
        img: { type: String },
    },
    {
        timestamps: true,
    },
);

const Product = mongoose.model("New", newSchema);
module.exports = Product;
