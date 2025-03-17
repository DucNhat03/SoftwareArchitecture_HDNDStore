const express = require("express");
const router = express.Router();
const { getAllVouchers, getVoucherById, createVoucher, updateVoucher, deleteVoucher } = require("../controllers/VoucherController");

router.get("/vouchers", getAllVouchers);        // Lấy tất cả voucher
router.get("/vouchers/:id", getVoucherById);    // Lấy voucher theo ID
router.post("/vouchers", createVoucher);        // Thêm voucher mới
router.put("/vouchers/:id", updateVoucher);     // Cập nhật voucher
router.delete("/vouchers/:id", deleteVoucher);  // Xóa voucher

module.exports = router;


