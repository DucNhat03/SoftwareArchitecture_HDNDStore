const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //
    products: [
        {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        },
    ],
    address: { 
        city: { type: String, default: "" },
        district: { type: String, default: "" },
        ward: { type: String, default: "" },
        street: { type: String, default: "" }
    },
    note: { type: String},
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
