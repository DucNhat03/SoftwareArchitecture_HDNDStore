import express from "express";
import { register, login, getUserProfile, updateUserProfile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile);  // Lấy thông tin user (có xác thực)
router.put("/profile", authMiddleware, updateUserProfile); // Cập nhật hồ sơ (có xác thực)

export default router;
