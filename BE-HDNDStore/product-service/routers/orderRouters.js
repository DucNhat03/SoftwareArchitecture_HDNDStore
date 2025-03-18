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
        let { receiver, cartItems, shippingAddress, discount } = req.body;

        console.log("Dữ liệu giỏ hàng nhận được:", JSON.stringify(cartItems, null, 2));
        console.log("Địa chỉ giao hàng:", shippingAddress);
        console.log("req.body dat hang:", req.body);

        // if (totalAmount === undefined) {
        //     return res.status(400).json({ message: "Thiếu totalAmount trong request!" });
        // }

        // console.log("totalAmount sau khi trích xuất:", totalAmount);


        // Kiểm tra ID người nhận hợp lệ
        if (!receiver || !mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(400).json({ message: "ID người nhận không hợp lệ!" });
        }
        receiver = new mongoose.Types.ObjectId(receiver);

        // Kiểm tra người nhận có tồn tại không
        const userExists = await fetchUserById(String(receiver));
        if (!userExists) {
            return res.status(404).json({ message: "Người nhận không tồn tại!" });
        }

        // Kiểm tra giỏ hàng trống
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng trống, không thể đặt hàng!" });
        }


        // Kiểm tra xem có `shippingAddress` không
        if (!shippingAddress || typeof shippingAddress !== "object") {
            return res.status(400).json({ message: "Địa chỉ giao hàng không hợp lệ!" });
        }

        // Giải cấu trúc `shippingAddress`
        const { fullName, phone, address } = shippingAddress;

        // Kiểm tra `fullName` và `phone`
        if (!fullName || typeof fullName !== "string" || !phone || typeof phone !== "string") {
            return res.status(400).json({ message: "Thiếu hoặc sai định dạng họ tên hoặc số điện thoại!" });
        }

        // Kiểm tra `address`
        if (!address || typeof address !== "object") {
            return res.status(400).json({ message: "Địa chỉ không hợp lệ!" });
        }

        const { street, city, district, ward } = address;

        // Kiểm tra từng phần của `address`
        if (!street || !city || !district || !ward) {
            return res.status(400).json({
                message: "Thiếu thông tin địa chỉ giao hàng!",
                missingFields: { street, city, district, ward }
            });
        }

        console.log("✅ Địa chỉ giao hàng hợp lệ:", JSON.stringify(shippingAddress, null, 2));


  
        // Kiểm tra hàng tồn kho
        for (const item of cartItems) {
            console.log(` Kiểm tra sản phẩm: ${item.name}`);

            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(404).json({ message: `Sản phẩm ${item.name} không tồn tại!` });
            }

            console.log("📌 Biến thể trong DB:", JSON.stringify(product.variants, null, 2));

            // Tìm tất cả biến thể có màu & size từ giỏ hàng
            const selectedVariants = item.variants.filter(v => v.color && v.size);

            if (selectedVariants.length === 0) {
                return res.status(400).json({
                    message: `Không tìm thấy biến thể phù hợp trong giỏ hàng cho ${item.name}!`
                });
            }

            // Lặp qua tất cả biến thể đã chọn để kiểm tra tồn kho
            for (const selectedVariant of selectedVariants) {
                const normalizedColor = String(selectedVariant.color).trim().toLowerCase();
                const normalizedSize = String(selectedVariant.size).trim();

                console.log(`🔍 Kiểm tra biến thể: Màu ${normalizedColor}, Size ${normalizedSize}`);

                // Tìm biến thể tương ứng trong DB
                const variant = product.variants.find(v =>
                    String(v.color).trim().toLowerCase() === normalizedColor &&
                    String(v.size).trim() === normalizedSize
                );

                if (!variant) {
                    return res.status(400).json({
                        message: `Không tìm thấy biến thể của ${item.name} (Màu: ${selectedVariant.color}, Size: ${selectedVariant.size})!`
                    });
                }

                console.log(`✅ Tìm thấy biến thể: Màu ${variant.color}, Size ${variant.size}, Stock: ${variant.stock}`);

                if (variant.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Sản phẩm ${item.name} (${selectedVariant.color}, ${selectedVariant.size}) chỉ còn ${variant.stock} sản phẩm!`
                    });
                }
            }
        }



        // Tính tổng tiền sản phẩm
        const totalProductPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

        // Tổng tiền đơn hàng = tổng tiền sản phẩm + 20k phí ship
        const totalAmount = totalProductPrice + 20000;

        // Lấy hóa đơn mới nhất
        const latestOrder = await Order.findOne({}, {}, { sort: { createdAt: -1 } });
        let newInvoiceNumber = latestOrder && latestOrder.idHoaDon
            ? `HD${(parseInt(latestOrder.idHoaDon.replace("HD", ""), 10) + 1).toString().padStart(3, "0")}`
            : "HD001";

        // Nhóm sản phẩm theo `_id`, giữ nguyên các biến thể `color + size`
        const groupedCartItems = Object.values(
            cartItems.reduce((acc, item) => {
                const key = item._id;

                if (!acc[key]) {
                    acc[key] = {
                        _id: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity, // Số lượng sản phẩm tổng
                        image: Array.isArray(item.image) ? item.image : [],
                        category: item.category,
                        description: item.description,
                        subcategories: Array.isArray(item.subcategories) ? item.subcategories : [],
                        rating: item.rating,
                        imagethum: Array.isArray(item.imagethum) ? item.imagethum : [],
                        variants: []
                    };
                }

                acc[key].quantity += item.quantity; // Cộng dồn số lượng sản phẩm

                // Kiểm tra biến thể
                item.variants.forEach(variant => {
                    const color = variant.color || "Unknown";
                    const size = variant.size || "Unknown";
                    const stock = variant.stock || 0; // Lấy số lượng đúng của biến thể

                    const existingVariant = acc[key].variants.find(v => v.color === color && v.size === size);

                    if (existingVariant) {
                        existingVariant.stock += stock; // Cộng số lượng vào biến thể đã có
                    } else {
                        acc[key].variants.push({
                            color: color,
                            size: size,
                            stock: stock 
                        });
                    }
                });

                return acc;
            }, {})
        );

        console.log("📦 Grouped Cart Items:", JSON.stringify(groupedCartItems, null, 2));




        // Tạo đơn hàng mới
        const newOrder = new Order({
            receiver,
            cartItems: groupedCartItems,
            discount: discount,
            totalAmount: totalAmount,
            idHoaDon: newInvoiceNumber,
            shippingAddress
        });

        await newOrder.save();

        // Cập nhật tồn kho sau khi đặt hàng thành công
     
        for (const item of cartItems) {
            const product = await Product.findById(item._id);
            if (product) {
                for (const selectedVariant of item.variants) {
                    console.log("🟢 Variant nhận được từ cart:", selectedVariant); // Debug

                    const variantIndex = product.variants.findIndex(v =>
                        String(v.color).trim().toLowerCase() === String(selectedVariant.color).trim().toLowerCase() &&
                        String(v.size).trim() === String(selectedVariant.size).trim()
                    );

                    if (variantIndex !== -1) {
                        // Kiểm tra dữ liệu đầu vào
                        let currentStock = Number(product.variants[variantIndex].stock) || 0;
                        let quantityToDeduct = isNaN(Number(selectedVariant.stock)) ? 0 : Number(selectedVariant.stock);

                        console.log(`🔹 Stock hiện tại: ${currentStock}, Số lượng trừ: ${quantityToDeduct}`);

                        if (quantityToDeduct > 0) {
                            product.variants[variantIndex].stock = Math.max(0, currentStock - quantityToDeduct);
                            console.log(`✅ Cập nhật tồn kho: ${item.name} (Màu: ${selectedVariant.color}, Size: ${selectedVariant.size}) còn lại: ${product.variants[variantIndex].stock}`);
                        } else {
                            console.log(`⚠ Lỗi: quantityToDeduct không hợp lệ (${selectedVariant.quantity})`);
                        }
                    } else {
                        console.log(`⚠ Không tìm thấy biến thể: ${item.name} (Màu: ${selectedVariant.color}, Size: ${selectedVariant.size})`);
                    }
                }
                await product.save();
            }
        }

        res.status(201).json({ message: "Đặt hàng thành công!", order: newOrder });


    } catch (error) {
        console.error("❌ Lỗi đặt hàng:", error);
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


//Kiểm tra trạng thái đơn hàng
router.get("/orders/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "ID đơn hàng không hợp lệ!" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
        }

        res.status(200).json(order); // Trả về toàn bộ thông tin đơn hàng
    } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});


//API hủy đơn hàng

router.put("/orders/:orderId/cancel", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { lyDoHuy, ngayHuy } = req.body; // Lấy dữ liệu từ request

        console.log("orderId nhận được từ request:", orderId);
        console.log("Lý do hủy nhận được từ request:", lyDoHuy);
        console.log("Ngày hủy nhận được từ request:", ngayHuy);

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "ID đơn hàng không hợp lệ!" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
        }

        if (order.status !== "Chờ xác nhận") {
            return res.status(400).json({ message: "Chỉ có thể hủy đơn hàng khi trạng thái là 'Chờ xác nhận'!" });
        }

        order.status = "Đã hủy";
        order.lyDoHuy = lyDoHuy;
        order.ngayHuy = ngayHuy || new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

        // Danh sách promise để cập nhật tồn kho
        for (const item of order.cartItems) {
            console.log("Danh sách sản phẩm:", order.cartItems);
            const product = await Product.findOne({ _id: item._id });
            if (product) {
                // Duyệt qua tất cả biến thể của sản phẩm trong giỏ hàng
                for (let i = 0; i < item.variants.length; i++) {
                    const itemVariant = item.variants[i];

                    product.variants.forEach((variant) => {
                        if (variant.size === itemVariant.size && variant.color === itemVariant.color) {
                            variant.stock += itemVariant.stock; // Cộng lại số lượng đã mua vào kho
                        }
                    });
                }

                await product.save(); // Lưu lại thông tin sản phẩm
            }      
        }
        order.save(); // Lưu lại thông tin đơn hàng

        res.status(200).json({ message: "Đơn hàng đã được hủy và tồn kho đã được cập nhật!", order });

    } catch (error) {
        console.error("❌ Lỗi khi hủy đơn hàng:", error);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});
//Sửa địa chỉ đơn hàng theo OrderId khi đơn hàng ở trạng thái chờ xác nhận
router.put("/orders/:orderId/shipping-address", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { fullName, phone, address } = req.body;
        console.log("orderId nhận được từ đơn hàng:", orderId);
        console.log("Thông tin địa chỉ nhận được từ đơn hàng:", fullName, phone, address);

        // Kiểm tra định dạng của orderId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "ID đơn hàng không hợp lệ!" });
        }

        // Kiểm tra thông tin đầu vào
        if (!fullName || !phone || !address || !address.street || !address.city || !address.district || !address.ward) {
            return res.status(400).json({ message: "Thông tin địa chỉ giao hàng không đầy đủ!" });
        }

        // Cập nhật đơn hàng theo orderId
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { shippingAddress: { fullName, phone, address } } },
            { new: true } // Trả về dữ liệu sau khi cập nhật
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng để cập nhật!" });
        }

        res.status(200).json({ message: "Cập nhật địa chỉ giao hàng thành công!", updatedOrder });
    } catch (error) {
        console.error("Lỗi cập nhật địa chỉ giao hàng:", error);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});



module.exports = router;
