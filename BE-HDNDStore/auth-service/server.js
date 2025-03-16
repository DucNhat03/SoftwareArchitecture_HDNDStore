import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRouters from "./routes/User_Product.js";

dotenv.config();
const app = express();

// Kết nối MongoDB
connectDB();
 
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRouters);

// Middleware xử lý lỗi
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`✅ Route available: ${r.route.path}`);
    }
});

// Khởi động server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));


