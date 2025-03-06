import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true },
        },
    ],
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" },
}, { timestamps: true });


export default mongoose.model("Order", OrderSchema); // Dùng export default