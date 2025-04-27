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
    const category = req.query.subcategories;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await Product.find({ subcategories: category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Tìm theo category
const getProductsByCategoryy = async (req, res) => {
  try {
    const category = req.params.category;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    const products = await Product.find({ category: category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy sản phẩm đồng giá
const getProductsByPrice = async (req, res) => {
  try {
    const price = req.params.price; // Lấy giá từ URL param

    if (!price) {
      return res.status(400).json({ message: "Price is required" });
    }

    const products = await Product.find({ price: price });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = { getAllProducts, getProductsByCategory, getProductsByCategoryy, getProductsByPrice };
