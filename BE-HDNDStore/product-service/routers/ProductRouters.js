const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");

// Rate limiting middleware
const rateLimiter = require("../middleware/rateLimiter");

// Apply rate limiter to specific routes
const applyRateLimit = (req, res, next) => {
  // Skip rate limiting for GET requests to improve user experience
  if (req.method === 'GET') {
    return next();
  }
  
  // Apply rate limiting for all other requests
  rateLimiter(req, res, next);
};

// Middleware for all routes
router.use(applyRateLimit);

// Route lấy tất cả sản phẩm
router.get("/all", productController.getAllProducts);

// Route lọc sản phẩm theo category
router.get("/all/category", productController.getProductsByCategory);

router.get("/all/:category", productController.getProductsByCategoryy);

// Route lấy sản phẩm đồng giá
router.get("/all/price/:price", productController.getProductsByPrice);

// Route lấy chi tiết sản phẩm theo ID (với Redis caching)
router.get("/:id", productController.getProductById);

module.exports = router;
