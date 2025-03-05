const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    size: { type: [String], default: [] },
    color: { type: [String], default: [] },
    image: { type: String },
  },
  { timestamps: true, collection: "Product" } // Tự động thêm createdAt & updatedAt
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
