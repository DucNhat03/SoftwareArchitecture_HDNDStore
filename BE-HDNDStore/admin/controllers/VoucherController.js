const Voucher = require("../models/Voucher");

// Lấy danh sách tất cả voucher
const getAllVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find();
        res.status(200).json(vouchers);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Lấy voucher theo ID
const getVoucherById = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);
        if (!voucher) {
            return res.status(404).json({ message: "Voucher không tồn tại" });
        }
        res.status(200).json(voucher);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Thêm voucher mới
const createVoucher = async (req, res) => {
    try {
        console.log("Request body:", req.body); // In dữ liệu request lên terminal
        const newVoucher = new Voucher(req.body);
        await newVoucher.save();
        res.status(201).json({ message: "Thêm voucher thành công", voucher: newVoucher });
    } catch (error) {
        console.error("Lỗi khi thêm voucher:", error);
        res.status(500).json({ message: "Lỗi khi thêm voucher", error: error.message });
    }
};

// Cập nhật voucher
const updateVoucher = async (req, res) => {
    try {
        const updatedVoucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVoucher) {
            return res.status(404).json({ message: "Voucher không tồn tại" });
        }
        res.status(200).json({ message: "Cập nhật thành công", voucher: updatedVoucher });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật voucher", error });
    }
};

// Xóa voucher
const deleteVoucher = async (req, res) => {
    try {
        const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id);
        if (!deletedVoucher) {
            return res.status(404).json({ message: "Voucher không tồn tại" });
        }
        res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa voucher", error });
    }
};

module.exports = { getAllVouchers, getVoucherById, createVoucher, updateVoucher, deleteVoucher };

