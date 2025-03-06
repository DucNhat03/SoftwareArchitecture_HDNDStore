const express = require("express");
const Product = require("../models/Product.js");

const router = express.Router();

// 📌 API: Lấy tất cả sản phẩm
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        console.log("📦 Dữ liệu lấy được từ MongoDB:", products); // Debug

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "Không có sản phẩm nào trong hệ thống!" });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("❌ Lỗi khi lấy sản phẩm:", error);
        res.status(500).json({ error: "Lỗi server!" });
    }
});

// 📌 API: Lấy sản phẩm theo ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("❌ Lỗi khi lấy sản phẩm theo ID:", error);
        res.status(500).json({ error: "Lỗi server!" });
    }
});

module.exports = router;
