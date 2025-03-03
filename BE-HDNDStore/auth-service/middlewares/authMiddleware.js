import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ error: "Không có quyền truy cập!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        
        // Kiểm tra user trong DB
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại!" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: "Token không hợp lệ!" });
    }
};

export default authMiddleware;
