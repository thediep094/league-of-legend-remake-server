const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
    {
        userID: { type: Schema.Types.ObjectId }, // user id
        // danh sách product
        list: [
            {
                productID: { type: Schema.Types.ObjectId },
                quantity: { type: Number },
            },
        ],
        total: { type: Number },
    },
    {
        timestamps: true,
    },
);

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
