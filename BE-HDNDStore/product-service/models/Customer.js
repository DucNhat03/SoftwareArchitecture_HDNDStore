import mongoose from "mongoose";

const CusSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    sdt: { type: String, required: true, unique: true },
    diachi: { type: String, required: true },
}, { timestamps: true });


export default mongoose.model("Customer", CusSchema); // Dùng export default