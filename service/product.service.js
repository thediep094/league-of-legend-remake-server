const Product = require("../model/Product");
const mongoose = require("mongoose");

// tạm thời để đấy, ko dùng
const getProductInCart = async (listProduct) => {
    try {
        console.log(listProduct);
        for (let product of listProduct) {
        }
    } catch (error) {
        return false;
    }
};

module.exports = { getProductInCart };
