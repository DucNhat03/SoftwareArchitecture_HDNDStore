const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");

const productRoutes = require("./routes/productRoutes.js");

// Cấu hình dotenv
dotenv.config();
const app = express();

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/products", productRoutes);

// Debug routes (fix lỗi)
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`✅ Route available: ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
    }
});

// Khởi động server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));
