const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");

// Route lấy tất cả sản phẩm
router.get("/all", productController.getAllProducts);

// Route lọc sản phẩm theo category
router.get("/all/category", productController.getProductsByCategory);

router.get("/all/:category", productController.getProductsByCategoryy);

// Route lấy sản phẩm đồng giá
router.get("/all/price/:price", productController.getProductsByPrice);

module.exports = router;
