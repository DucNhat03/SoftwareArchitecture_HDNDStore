import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
    try {
        // Lấy token từ header
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Không có quyền truy cập!" });
        }

        // Loại bỏ "Bearer " để lấy token thực sự
        const token = authHeader.split(" ")[1];

        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role }; // Lưu id & role vào request
        
        // Kiểm tra user có tồn tại không
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại!" });
        }

        next(); // Cho phép tiếp tục nếu hợp lệ
    } catch (error) {
        return res.status(403).json({ error: "Token không hợp lệ!" });
    }
};

// Middleware kiểm tra quyền admin
export const adminMiddleware = async (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Không có quyền truy cập (Admin Only)!" });
    }
    next();
};

export default authMiddleware;
