const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {

    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    subcategories: { type: String, required: true },
    rating: { type: Number, default: 0 },
    image: { type: [String], default: [] },
    imagethum: { type: [String], default: [] },
    status: { type: String },
    variants: [
      {
        size: { type: String, required: true },
        color: { type: String, required: true },
        stock: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true, collection: "Product" }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
