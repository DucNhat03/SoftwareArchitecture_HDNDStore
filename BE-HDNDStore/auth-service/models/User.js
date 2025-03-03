import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, default: "" },
    fullName: { type: String, default: "" },
    gender: { type: String, default: "other" },
    birthday: { 
        day: { type: String, default: "" },
        month: { type: String, default: "" },
        year: { type: String, default: "" }
    }, // 🔥 Fix: Lưu birthday dưới dạng Object thay vì Date
    address: { 
        city: { type: String, default: "" },
        district: { type: String, default: "" },
        ward: { type: String, default: "" },
        street: { type: String, default: "" }
    },
    avatar: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
