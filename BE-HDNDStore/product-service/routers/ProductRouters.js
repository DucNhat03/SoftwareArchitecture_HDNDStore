const express = require("express");
const { getAllProducts } = require("../controllers/ProductController.js");

const router = express.Router();

router.get("/", getAllProducts); // API: Lấy danh sách sản phẩm

module.exports = router;
