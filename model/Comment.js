const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId }, 
        productId: { type: Schema.Types.ObjectId },    
        rate: { type: Number },
        cmt: { type: String },
    },
    {
        timestamps: true,
    },
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;