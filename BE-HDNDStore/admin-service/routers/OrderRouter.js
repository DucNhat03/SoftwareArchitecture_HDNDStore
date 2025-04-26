const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

// Route update Order
router.put('/update/:idHoaDon', OrderController.updateOrder);

// Route lấy danh sách Order
router.get('/all', OrderController.getAllOrders);

// Route lấy danh sách Order trạng thái đã giao
router.get('/delivered', OrderController.getDeliveredOrders);

router.get("/report", OrderController.getReport);

// Route để lấy dữ liệu JSON phân tích
router.get('/analysis-results', OrderController.getAnalysisResults);

// Route lấy danh sách Order theo status
router.get('/status/:status', OrderController.getOrdersOfStatus);

// In your OrderRouter.js file
router.get('/revenue', OrderController.getRevenue);

module.exports = router;