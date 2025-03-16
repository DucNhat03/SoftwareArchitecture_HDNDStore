const Product = require("../model/Product.js");

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log("data:", products);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lọc sản phẩm theo category
const getProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await Product.find({ category: category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllProducts, getProductsByCategory };
