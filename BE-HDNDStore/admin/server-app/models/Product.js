const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
