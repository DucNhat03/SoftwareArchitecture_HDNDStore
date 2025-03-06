const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// 📌 API: Lấy danh sách tất cả sản phẩm
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find(); // Lấy tất cả sản phẩm
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Lỗi server!" });
    }
});

// 📌 2️⃣ API: Lấy sản phẩm theo ID
router.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại!" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Lỗi server!" });
    }
});

module.exports = router;
