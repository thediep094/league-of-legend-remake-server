const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
    {
        userID: { type: Schema.Types.ObjectId },
        token: { type: String },
    },
    {
        timestamps: true,
    },
);

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;

