const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, unique: true, sparse: true }, // Thêm Google ID
    provider: { type: String, default: "local" }, // Xác định phương thức đăng nhập (local/google)
    fullName: { type: String, default: "" },
    gender: { type: String, default: "other" },
    birthday: { 
        day: { type: String, default: "" },
        month: { type: String, default: "" },
        year: { type: String, default: "" }
    },
    address: { 
        city: { type: String, default: "" },
        district: { type: String, default: "" },
        ward: { type: String, default: "" },
        street: { type: String, default: "" }
    },
    role: { type: String, default: "user" }, // Quyền của người dùng (user/admin)
    avatar: { type: String, default: "" },
}, { timestamps: true, collection: "User" });

const User = mongoose.model("User", UserSchema);
module.exports = User;

