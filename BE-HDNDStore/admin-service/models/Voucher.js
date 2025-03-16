const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // ID tự động sinh
    name: { type: String, required: true, trim: true }, // Tên voucher
    price: { type: Number, required: true }, // Giá trị giảm giá
    start_date: { type: Date, required: true }, // Ngày bắt đầu
    end_date: { type: Date, required: true }, // Ngày kết thúc
    code: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    }, // Mã voucher (SALE10, FREESHIP,...)
    state: { 
        type: String, 
        enum: ["Còn hiệu lực", "Hết hiệu lực"], 
        default: "Còn hiệu lực" 
    }, // Trạng thái voucher
    quantity: { type: Number, required: true, default: 1 }, // Số lượng còn lại
});

module.exports = mongoose.model("Voucher", VoucherSchema);