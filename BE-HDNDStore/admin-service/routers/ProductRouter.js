const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Route tạo Product
router.post('/create', ProductController.createProduct);

// Route cập nhật thông tin Product
router.put('/update/:id', ProductController.updateProduct);

// Route lấy danh sách Product
router.get('/all', ProductController.getAllProducts);

// Route lấy danh sách Product theo category
router.get('/all/men', ProductController.getMenProducts);

// Route lấy danh sách Product theo category
router.get('/all/women', ProductController.getWomenProducts);


// Route xóa Product
router.delete('/delete/:id', ProductController.deleteProduct);

// Route kiểm tra trùng tên
router.get('/check-duplicate', ProductController.checkDuplicateProduct);

// Route nhập hàng
router.put('/import/:id', ProductController.addStock);

// Route xuất hàng
router.put('/export', ProductController.updateStock);

// In your ProductRouter.js file
router.get('/top', ProductController.getTopProducts);

module.exports = router;