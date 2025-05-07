const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const rateLimiter = require("../middleware/rateLimiter");

// Rate limiting middleware chỉ áp dụng cho các route không phải GET
const applyRateLimit = (req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }
  rateLimiter(req, res, next);
};

// Middleware for all routes
router.use(applyRateLimit);

// Route lấy tất cả sản phẩm
router.get("/all", productController.getAllProducts);

// Route lấy sản phẩm theo category
router.get("/all/:category", productController.getProductsByCategoryy);

// Route lấy sản phẩm theo giá
router.get("/all/price/:price", productController.getProductsByPrice);

// Route lấy chi tiết sản phẩm theo ID
router.get("/:id", productController.getProductById);

module.exports = router;
