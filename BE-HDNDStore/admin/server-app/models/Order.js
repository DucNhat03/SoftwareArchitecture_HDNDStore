const mongoose = require("mongoose");

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

module.exports = mongoose.model("Order", OrderSchema);
