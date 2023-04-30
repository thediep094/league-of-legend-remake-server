const Cart = require("../model/Cart");
const mongoose = require("mongoose");
const { createCart } = require("../service/cart.service");
const { options } = require("../route");

const CartController = {
    // taọ hoặc lấy ra cart có sẵn theo userid trong token
    createCartByUserID: async (req, res) => {
        try {
            const id = req.body.verify_id;
            let cart = await createCart(id);
            // console.log(cart);
            if (!cart) {
                return res.status(500).json({
                    message: "Server error",
                });
            }
            const pipeline = [
                {
                    $match: {
                        _id: cart._id,
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "list.productID",
                        foreignField: "_id",
                        as: "productList",
                    },
                },
                // {
                //     $addFields: {
                //         "productList.hello": {
                //             $arrayElemAt: ["$productList.images", 0],
                //         },
                //     },
                // },
                {
                    $project: {
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0,
                        "list._id": 0,
                        "productList.description": 0,
                        "productList.thumbnails": 0,
                        "productList.createdAt": 0,
                        "productList.updatedAt": 0,
                        "productList.__v": 0,
                        // "productList.hello": 0,
                    },
                },
            ];
            let data = await Cart.aggregate(pipeline); // bị ExceededMemoryLimit tại đây nếu như lưu ảnh bằng cách cũ
            if (cart.list.length > 0) {
                data = data[0];
            } else {
                return res.status(200).json({
                    message: "Get cart thành công",
                    cart: cart,
                });
            }
            // 2 vòng for lồng nhau để thêm quantity vào trong productList

            for (let product of data.productList) {
                product.images = product.images[0];
                data?.list?.forEach((item) => {
                    if (item.productID.equals(product?._id)) {
                        product.quantity = item?.quantity;
                    }
                });
            }
            delete data.list;
            return res.status(200).json({
                message: "Get cart thành công",
                cart: data,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    // trả về cart theo id
    getCartByID: async (req, res) => {
        try {
            const { id } = req.params;
            const cart = await Cart.findById(id);
            if (cart) {
                return res.status(200).json({
                    message: "Tìm thấy cart",
                    data: cart,
                });
            }
            return res.status(404).json({
                message: "Cart không tồn tại",
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    // update
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Cart.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            if (data) {
                return res.status(200).json({
                    message: "Sửa thông tin cart thành công",
                    cart: data,
                });
            }
            return res.status(404).json({
                message: "Cart không tồn tại",
                cart: data,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    // xóa hết product trong cart
    clear: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Cart.findByIdAndUpdate(
                id,
                { list: [] },
                {
                    new: true,
                },
            );
            if (data) {
                return res.status(200).json({
                    message: "Sửa thông tin cart thành công",
                    cart: data,
                });
            }
            return res.status(404).json({
                message: "Cart không tồn tại",
                cart: data,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    // add mới một product by id: nếu có thì +1, ko thì thêm
    addProductByID: async (req, res) => {
        try {
            const { id } = req.params;
            const { productID } = req.body;
            if (!mongoose.Types.ObjectId.isValid(productID)) {
                return res.status(400).json({
                    message: "product id không hợp lệ",
                });
            }
            let cart = await Cart.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                    },
                },
            ]);
            if (cart.length == 0) {
                return res.status(404).json({
                    message: "Cart không tồn tại",
                });
            }
            cart = cart[0];
            let check = true;
            cart.list.forEach((item) => {
                if (item.productID == productID) {
                    item.quantity += 1;
                    check = false;
                }
            });
            if (check) {
                cart.list.push({
                    productID: productID,
                    quantity: 1,
                });
            }
            const saveCart = await Cart.findByIdAndUpdate(
                cart._id,
                { list: cart.list },
                {
                    new: true,
                },
            );
            return res.status(200).json({
                message: "Thêm product vào cart thành công",
                cart: saveCart,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    // update product số lượng by id:
    updateProductQuantityByID: async (req, res) => {
        try {
            const { id } = req.params;
            const { productID, quantity } = req.body;
            if (!mongoose.Types.ObjectId.isValid(productID)) {
                return res.status(400).json({
                    message: "product id không hợp lệ",
                });
            }
            let cart = await Cart.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                    },
                },
            ]);
            if (cart.length == 0) {
                return res.status(404).json({
                    message: "Cart không tồn tại",
                });
            }
            cart = cart[0];
            let check = true;
            cart.list.forEach((item) => {
                if (item.productID == productID) {
                    item.quantity = quantity;
                    check = false;
                }
            });
            if (check) {
                return res.status(400).json({
                    message: "Không tồn tại product trong cart",
                });
            }
            const saveCart = await Cart.findByIdAndUpdate(
                cart._id,
                { list: cart.list },
                {
                    new: true,
                },
            );
            return res.status(200).json({
                message: "Update product quantity thành công",
                cart: saveCart,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
    // xóa product trong cart by id:
    deleteProductByID: async (req, res) => {
        console.log(req.body);
        try {
            const { id } = req.params;
            const { productID } = req.body;

            if (!mongoose.Types.ObjectId.isValid(productID)) {
                return res.status(400).json({
                    message: "product id không hợp lệ",
                });
            }
            let cart = await Cart.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                    },
                },
            ]);
            if (cart.length == 0) {
                return res.status(404).json({
                    message: "Cart không tồn tại",
                });
            }
            cart = cart[0];
            let check = true;
            let index = -1;
            cart.list.forEach((item) => {
                if (item.productID == productID) {
                    index = cart.list.indexOf(item);
                    check = false;
                }
            });
            if (check) {
                return res.status(400).json({
                    message: "Không tồn tại product trong cart",
                });
            }
            // console.log("index: " + index);
            // console.log("vẫn chạy 1");
            cart.list.splice(index, 1);
            // console.log("vẫn chạy 2");
            const saveCart = await Cart.findByIdAndUpdate(
                cart._id,
                { list: cart.list },
                {
                    new: true,
                },
            );
            return res.status(200).json({
                message: "Update product quantity thành công",
                cart: saveCart,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error,
            });
        }
    },
};

module.exports = CartController;
