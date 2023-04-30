const Cart = require("../model/Cart");
const mongoose = require("mongoose");

const createCart = async (userID) => {
    try {
        let check = await Cart.findOne({ userID: userID });
        if (check) {
            console.log("cart đã có sẵn");
            return check;
        }
        const newCart = await Cart.create({
            userID: userID,
            list: [],
            total: 0,
        });
        console.log("tạo cart mới");
        return newCart;
    } catch (error) {
        console.log("Lỗi ở hàm createCart:");
        console.log(error);
        return false;
    }
};

module.exports = { createCart };
