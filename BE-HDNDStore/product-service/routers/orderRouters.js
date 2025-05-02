const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../model/Order");
const User = require("../model/User");
const Product = require("../model/Product");
const app = express();

//Mail 
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { jsPDF } = require("jspdf");
const autoTable = require("jspdf-autotable").default; 
const RobotoFont = require("../config/roboto");

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

        // Kiểm tra ID người nhận hợp lệ
        if (!receiver || !mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(400).json({ message: "ID người nhận không hợp lệ!" });
        }
        receiver = new mongoose.Types.ObjectId(receiver);

        // Kiểm tra người nhận có tồn tại không
        // const userExists = await fetchUserById(String(receiver));
        // if (!userExists) {
        //     return res.status(404).json({ message: "Người nhận không tồn tại!" });
        // }

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

        // console.log("✅ Địa chỉ giao hàng hợp lệ:", JSON.stringify(shippingAddress, null, 2));



        // Kiểm tra hàng tồn kho
        for (const item of cartItems) {
            console.log(` Kiểm tra sản phẩm: ${item.name}`);

            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(404).json({ message: `Sản phẩm ${item.name} không tồn tại!` });
            }

            // console.log("📌 Biến thể trong DB:", JSON.stringify(product.variants, null, 2));

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

                // console.log(`🔍 Kiểm tra biến thể: Màu ${normalizedColor}, Size ${normalizedSize}`);

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
                    // Kiểm tra và gán rating nếu rating > 5 thì gán là 5
                    const validRating = item.rating > 5 ? 5 : item.rating;
                    acc[key] = {
                        _id: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity, // Số lượng sản phẩm tổng
                        image: Array.isArray(item.image) ? item.image : [],
                        category: item.category,
                        description: item.description,
                        subcategories: Array.isArray(item.subcategories) ? item.subcategories : [],
                        rating: validRating, // Gán rating đã được kiểm tra
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

        // console.log("orderId nhận được từ request:", orderId);
        // console.log("Lý do hủy nhận được từ request:", lyDoHuy);
        // console.log("Ngày hủy nhận được từ request:", ngayHuy);

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
        // console.log("orderId nhận được từ đơn hàng:", orderId);
        // console.log("Thông tin địa chỉ nhận được từ đơn hàng:", fullName, phone, address);

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

router.put("/orders/payment", async (req, res) => {
    try {
        const { orderId, statusPayment, paymentMethod } = req.query;

        console.log("orderId nhận được từ params:", orderId);
        console.log("Trạng thái thanh toán:", statusPayment);

        // Kiểm tra định dạng ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "ID đơn hàng không hợp lệ!" });
        }

        // Cập nhật đơn hàng
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    statusPayment,
                    paymentMethod,
                },
            }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
        }

        return res.status(200).json({ message: "Cập nhật trạng thái thanh toán thành công!", updatedOrder });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái thanh toán:", error.message);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});

// Đảm bảo bạn đã có tệp font đúng trong dự án
const RobotoRegularFont = fs.readFileSync(path.join(__dirname, "fonts/Roboto-Regular.ttf"), "base64");
const RobotoBoldFont = fs.readFileSync(path.join(__dirname, "fonts/Roboto-Bold.ttf"), "base64");


const generateInvoice = (orderDetails) => {
    console.log("Thông tin đơn hàng:", orderDetails);

    return new Promise((resolve, reject) => {
        try {
            const doc = new jsPDF();

            // Đăng ký font Roboto
            doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegularFont);
            doc.addFileToVFS("Roboto-Bold.ttf", RobotoBoldFont);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
            doc.setFont("Roboto");

            let y = 10;

            // Tiêu đề cửa hàng
            doc.setFontSize(20);
            doc.setFont("Roboto", "bold");
            doc.text("CỬA HÀNG GIÀY DÉP HDND", 105, y, { align: "center" });
            y += 8;

            doc.setFontSize(12);
            doc.setFont("Roboto", "normal");
            doc.text("Địa chỉ: 12 Nguyễn Văn Bảo, Quận Gò Vấp, TP.HCM", 105, y, { align: "center" });
            y += 6;
            doc.text("SĐT: 0123 456 789 | Email: hdndshop@gmail.com", 105, y, { align: "center" });
            y += 6;
            doc.text("----------------------------------------------------------------------------------------------------------------------------------", 105, y, { align: "center" });
            y += 10;

            // Tiêu đề hóa đơn
            doc.setFontSize(18);
            doc.setFont("Roboto", "bold");
            doc.text(`ĐƠN HÀNG #${orderDetails.order.idHoaDon}`, 105, y, { align: "center" });
            y += 10;

            // Ngày lập
            const orderDate = orderDetails.order.orderDate || new Date(); // nếu không có thì lấy ngày hiện tại
            doc.setFontSize(12);
            doc.setFont("Roboto", "normal");
            doc.text(`Ngày lập: ${new Date(orderDate).toLocaleDateString('vi-VN')}`, 20, y);
            y += 10;

            const shippingAddress = orderDetails.order.shippingAddress;
            doc.setFontSize(12);
            doc.text(`Tên người nhận: ${shippingAddress.fullName}`, 20, y);
            y += 8;
            doc.text(`Số điện thoại: ${shippingAddress.phone}`, 20, y);
            y += 8;
            doc.text(`Địa chỉ: ${shippingAddress.address.street}, ${shippingAddress.address.district}, ${shippingAddress.address.city}`, 20, y);
            y += 10;

            // Bảng sản phẩm
            const tableColumns = ["Sản phẩm", "Số lượng", "Size", "Màu sắc", "Đơn giá (VND)", "Thành tiền (VND)"];
            const tableRows = [];

            orderDetails.order.cartItems.forEach((item) => {
                item.variants.forEach((variant) => {
                    tableRows.push([
                        item.name,
                        variant.stock,
                        variant.size || "Không có",
                        variant.color || "Không có",
                        `${item.price.toLocaleString()}đ`,
                        `${(item.price * variant.stock).toLocaleString()}đ`,
                    ]);
                });
            });

            autoTable(doc, {
                startY: y,
                head: [tableColumns],
                body: tableRows,
                theme: "striped",
                styles: {
                    font: "Roboto",
                    fontSize: 10,
                    cellPadding: 3,
                    textColor: [33, 33, 33],
                    lineColor: [221, 221, 221],
                    lineWidth: 0.1,
                },
                headStyles: {
                    fillColor: [52, 152, 219],
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                    halign: 'center'
                },
                bodyStyles: {
                    fillColor: [245, 245, 245],
                    textColor: [50, 50, 50],
                },
                columnStyles: {
                    1: { halign: 'center' },
                    2: { halign: 'center' },
                    3: { halign: 'center' },
                    4: { halign: 'right' },
                    5: { halign: 'right' },
                },
                didParseCell: (data) => {
                    data.cell.styles.font = "Roboto";
                }
            });

            const finalY = doc.lastAutoTable.finalY || y + 10;

            const totalAmount = orderDetails.order.totalAmount;
            const discount = orderDetails.order.discount || 0;
            const grandTotal = totalAmount - discount;

            doc.setFontSize(12);
            doc.text(`Tổng tiền: ${totalAmount.toLocaleString()} VND`, 130, finalY + 10);
            doc.setFontSize(10);
            doc.text(`(Đã bao gồm 20K phí vận chuyển)`, 130, finalY + 16); // Dòng nhỏ bên dưới
            doc.setFontSize(12);
            doc.text(`Giảm giá: ${discount.toLocaleString()} VND`, 130, finalY + 24);
            doc.text(`Tổng cộng: ${grandTotal.toLocaleString()} VND`, 130, finalY + 32);

            const invoiceDir = path.join(__dirname, 'invoices');

            if (!fs.existsSync(invoiceDir)) {
                fs.mkdirSync(invoiceDir, { recursive: true });
            }

            const fileName = `${orderDetails.order.idHoaDon}.pdf`;
            const filePath = path.join(invoiceDir, fileName);

            const pdfOutput = doc.output();
            fs.writeFileSync(filePath, pdfOutput);

            resolve({ pdfUrl: filePath });
        } catch (err) {
            reject(err);
        }
    });
};



// API tạo hóa đơn PDF
router.post("/generate-invoice", async (req, res) => {
    try {
        const { orderDetails } = req.body;
        const invoice = await generateInvoice(orderDetails);
        res.json(invoice); // Trả về URL của file PDF
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi tạo hóa đơn PDF" });
    }
});

// Cấu hình gửi email với nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Ví dụ: sử dụng Gmail
    auth: {
        user: 'hdndstore.cs01@gmail.com',
        pass: 'ycum eapv cixa yyqg' // Mật khẩu ứng dụng Gmail
    }
});

// Gửi email với file PDF đính kèm
const sendInvoiceEmail = (email, invoiceUrl) => {
    console.log(`Gửi email đến: ${email}`);

    return new Promise((resolve, reject) => {
        // Tạo đối tượng mailOptions với nội dung và cấu hình email
        const mailOptions = {
            from: 'hdndstore.cs01@gmail.com',  // Địa chỉ email người gửi
            to: email,  // Địa chỉ email người nhận
            subject: 'Hóa Đơn Mua Hàng - HDND Store',  // Tiêu đề email
            text: `
Kính gửi quý khách,

Cảm ơn bạn đã tin tưởng mua sắm tại HDND Store. Dưới đây là hóa đơn chi tiết cho đơn hàng của bạn. Vui lòng kiểm tra tệp đính kèm.

Nếu có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ khách hàng.

Trân trọng,
HDND Store
            `,  // Nội dung email bằng text
            html: `
<!DOCTYPE html>
<html>

<head>
    <title>Hóa Đơn Mua Hàng - HDND Store</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin: 0; padding: 0; min-width: 100%; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; background-color: #FAFAFA; color: #222222;">
    <div style="max-width: 650px; margin: 0 auto;">
        <!-- Header Section -->
        <div style="background-color: #ff6600; padding: 24px; color: #ffffff;">
            <h1 style="font-size: 24px; font-weight: 700; text-align: center;">
                Hóa Đơn Mua Hàng - HDND Store
            </h1>
        </div>
        
        <!-- Invoice Content Section -->
        <div style="padding: 24px; background-color: #ffffff;">
            <p>Kính gửi quý khách,</p>
            <p>Cảm ơn bạn đã tin tưởng mua sắm tại <strong>HDND Store</strong>. Dưới đây là hóa đơn chi tiết cho đơn hàng của bạn. Vui lòng kiểm tra tệp đính kèm.</p>
            <p>Nếu có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ khách hàng.</p>
            <br/>
            <p>Trân trọng,<br/>HDND Store</p>
        </div>
        
        <!-- Footer Section -->
        <div style="background-color: #f6f6f6; padding: 24px; text-align: center;">
            <p>Liên hệ với chúng tôi nếu cần hỗ trợ:</p>
            <p><a href="mailto:hdndstore.cs01@gmail.com" style="color: #ff6600; text-decoration: none;">hdndstore.cs01@gmail.com</a></p>
            <p>Hoặc truy cập website: <a href="http://localhost:5173/home" style="color: #ff6600; text-decoration: none;">HDND Store</a></p>
        </div>
    </div>
</body>

</html>
            `,  // Nội dung email bằng HTML
            attachments: [
                {
                    filename: path.basename(invoiceUrl),  // Lấy tên file từ URL
                    path: path.join(__dirname, 'invoices', path.basename(invoiceUrl)),  // Đường dẫn file trên server
                    contentType: 'application/pdf'  // Định dạng tệp đính kèm
                }
            ]
        };

        // Gửi email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Lỗi khi gửi email:", error);
                reject(error);  // Nếu có lỗi thì trả về lỗi
            } else {
                console.log('Email gửi thành công:', info.response);
                resolve(info);  // Nếu gửi thành công, trả về thông tin email
            }
        });
    });
};


// API gửi email hóa đơn
router.post("/send-invoice-email", async (req, res) => {
    try {
        const { email, invoiceUrl } = req.body;
        await sendInvoiceEmail(email, invoiceUrl);
        res.json({ message: "Email đã được gửi thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi gửi email" });
    }
});


module.exports = router;
