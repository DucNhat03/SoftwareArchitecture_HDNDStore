const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Route tạo User
router.post('/create', UserController.createUser);

// Route cập nhật thông tin User
router.put('/update/:id', UserController.updateUser);

// Route lấy danh sách User
router.get('/all', UserController.getAllUsers);

// Route xóa User
router.delete('/delete/:id', UserController.deleteUser);

// Route kiểm tra trùng email hoặc phone
router.get('/check-duplicate', UserController.checkDuplicate);

module.exports = router;

