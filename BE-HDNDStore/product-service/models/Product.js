const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },

    // 🔥 Thêm danh sách màu sắc (mảng string)
    colors: [{ type: String, trim: true }],

    // 🔥 Thêm danh sách kích thước (mảng string)
    sizes: [{ type: String, trim: true }]
}, { timestamps: true, collection: "Product" }); // 🔥 Chắc chắn collection đúng tên

module.exports = mongoose.model("Product", ProductSchema);
