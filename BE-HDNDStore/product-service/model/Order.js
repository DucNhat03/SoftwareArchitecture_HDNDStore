const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    idHoaDon: { type: String, default: "" }, // ID hóa đơn, mặc định rỗng
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến User
    cartItems: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Giữ nguyên _id
            name: { type: String, required: true },
            description: { type: String, trim: true },
            price: { type: Number, required: true },
            category: { type: String, required: true, trim: true },
            subcategories: { type: [String], required: true, trim: true },
            rating: { type: Number, default: 0, min: 0, max: 5 },
            image: { type: [String], default: [] },
            imagethum: { type: [String], default: [] },
            variants: [
                {
                    color: { type: String, required: true }, // Chỉ lấy color
                    size: { type: String, required: true }, // Chỉ lấy size
                    stock: { type: Number, required: true }, // Chỉ lấy stock
                }
            ]
        },
    ],
    totalAmount: { type: Number, required: true }, // Tổng tiền trước khi giảm giá
    discount: { type: Number, default: 0 }, // Số tiền giảm giá
    finalAmount: {
        type: Number,
        required: true,
        default: function () { return this.totalAmount - this.discount; } // Tính toán tự động
    },
    voucher: { type: String, default: "" }, // Mã giảm giá
    ngayXacNhan: { type: Date, default: null }, // Ngày xác nhận
    ngayHuy: { type: Date, default: null }, // Ngày hủy
    ngayNhanHang: { type: Date, default: null }, // Ngày nhận hàng, mặc định rỗng
    orderDate: { type: Date, default: Date.now }, // Ngày đặt hàng
    paymentMethod: {
        type: String,
        enum: ["Tiền mặt", "Ví điện tử"],
        default: "Tiền mặt"
    }, 
    status: {
        type: String,
        enum: ["Chờ xác nhận", "Đang giao", "Đã giao", "Đã hủy"],
        default: "Chờ xác nhận"
    },
    statusPayment: {
        type: String,
        enum: ["Chưa thanh toán", "Đã thanh toán"],
        default: "Chưa thanh toán"
    },
    note: { type: String, default: "" }, // Ghi chú
    lyDoHuy: { type: String, default: "" }, // Lý do hủy
    shippingAddress: {
        fullName: { type: String, required: true }, // Họ và tên người nhận
        phone: { type: String, required: true }, // Số điện thoại người nhận
        address: {
            street: { type: String, required: true }, // Số nhà, đường, chi tiết địa chỉ
            city: { type: String, required: true }, // Thành phố/tỉnh
            district: { type: String, required: true }, // Quận/huyện
            ward: { type: String, required: true }, // Phường/xã
        }
    }
}, { timestamps: true }); 

module.exports = mongoose.model("Order", OrderSchema);