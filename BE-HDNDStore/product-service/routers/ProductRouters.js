const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");

// Route lấy tất cả sản phẩm
router.get("/all", productController.getAllProducts);

// Route lọc sản phẩm theo category
router.get("/all/category", productController.getProductsByCategory);

module.exports = router;
