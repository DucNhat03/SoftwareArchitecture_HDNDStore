const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../model/Order");
const User = require("../model/User");
const Product = require("../model/Product");
const app = express();

// Thêm middleware xử lý JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Hàm kiểm tra user từ API
const fetchUserById = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5001/api/users/${userId}`);
        const text = await response.text();
        const data = JSON.parse(text);
        return data;
    } catch (error) {
        console.error("Lỗi khi fetch user:", error);
        return null;
    }
};


// API Đặt hàng
router.post("/dat-hang", async (req, res) => {
    try {
        let { receiver, cartItems , discount, totalAmount} = req.body;
                if (totalAmount === undefined) {
            return res.status(400).json({ message: "Thiếu totalAmount trong request!" });
        }

        console.log("totalAmount sau khi trích xuất:", totalAmount);

        // Kiểm tra receiver có hợp lệ không
        if (!receiver) {
            return res.status(400).json({ message: "Thiếu thông tin người nhận!" });
        }

        // Chuyển receiver từ string sang ObjectId
        if (!mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(400).json({ message: "ID người nhận không hợp lệ!" });
        }
        receiver = new mongoose.Types.ObjectId(receiver);

        // Kiểm tra receiver từ API
        const userExists = await fetchUserById(String(receiver)); // Chuyển về string
        if (!userExists) {
            return res.status(404).json({ message: "Người nhận không tồn tại!" });
        }
      

        // Kiểm tra giỏ hàng
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng trống, không thể đặt hàng!" });
        }

        // Kiểm tra hàng tồn kho trước khi đặt hàng
        for (const item of cartItems) {
            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(404).json({ message: `Sản phẩm ${item.name} không tồn tại!` });
            }

            const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
            if (!variant) {
                return res.status(400).json({ message: `Không tìm thấy biến thể của sản phẩm ${item.name} (${item.size}, ${item.color})!` });
            }

            if (variant.stock <= 0) {
                return res.status(400).json({ message: `Sản phẩm ${item.name} (${item.size}, ${item.color}) đã hết hàng!` });
            }

            if (variant.stock < item.quantity) {
                return res.status(400).json({ message: `Sản phẩm ${item.name} (${item.size}, ${item.color}) chỉ còn ${variant.stock} sản phẩm!` });
            }
        }

        // Tính tổng tiền đơn hàng
        // const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
     
        //  Lấy đơn hàng mới nhất (hóa đơn cuối cùng)
        const latestOrder = await Order.findOne({}, {}, { sort: { createdAt: -1 } });

        let newInvoiceNumber = "HD001"; // Mặc định nếu không có đơn nào trước đó

        if (latestOrder && latestOrder.idHoaDon) {
            const lastNumber = parseInt(latestOrder.idHoaDon.replace("HD", ""), 10);
            const nextNumber = lastNumber + 1;
            newInvoiceNumber = `HD${nextNumber.toString().padStart(3, "0")}`;
        }


        // Tạo đơn hàng mới
        const newOrder = new Order({
            receiver: receiver, // Lưu ObjectId của User
            cartItems: cartItems.map(item => ({
                _id: item._id, // Để lưu ObjectId của sản phẩm
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: Array.isArray(item.image) ? item.image : [], // Đảm bảo là mảng
                category: item.category,
                description: item.description,
                subcategories: Array.isArray(item.subcategories) ? item.subcategories : [], // Đảm bảo là mảng
                rating: item.rating,
                imagethum: Array.isArray(item.imagethum) ? item.imagethum : [], // Đảm bảo là mảng
                variants: [{
                    color: item.color, // Chỉ lấy màu đã chọn
                    size: item.size    // Chỉ lấy size đã chọn
                }]
            })),
            discount: discount, 
            totalAmount: totalAmount,
            idHoaDon: newInvoiceNumber,
        });

        await newOrder.save();

        // Trừ stock sau khi đặt hàng thành công
        for (const item of cartItems) {
            const product = await Product.findById(item._id);
            if (product) {
                product.variants = product.variants.map(variant => {
                    if (variant.size === item.size && variant.color === item.color) {
                        return {
                            ...variant,
                            stock: Math.max(0, variant.stock - item.quantity), // Trừ stock, không để âm
                        };
                    }
                    return variant;
                });
                await product.save();
            }
        }

        res.status(201).json({ message: "Đặt hàng thành công!", order: newOrder });
    } catch (error) {
        console.error("Lỗi đặt hàng:", error);
        res.status(500).json({ message: "Lỗi server!", error });
    }
});


// API lấy đơn hàng theo receiver (userId từ LocalStorage)
router.get("/orders/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("userId nhận được từ request:", userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID người dùng không hợp lệ!" });
        }

        const orders = await Order.find({ receiver: userId });

        if (!orders.length) {
            return res.status(404).json({ message: "Người dùng chưa có đơn hàng nào!" });
        }

        res.status(200).json({ message: "Lấy danh sách đơn hàng thành công!", orders });
    } catch (error) {
        console.error("Lỗi lấy đơn hàng theo receiver:", error);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});





module.exports = router;
