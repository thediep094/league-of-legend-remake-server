const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoxChatSchema = new Schema(
    {
        user1: { type: Schema.Types.ObjectId }, // user1 id
        user2: { type: Schema.Types.ObjectId }, // user2 id
    },
    {
        timestamps: true,
    },
);

const BoxChat = mongoose.model("BoxChat", BoxChatSchema);
module.exports = BoxChat;
