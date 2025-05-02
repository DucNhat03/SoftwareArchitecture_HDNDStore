import express from "express";
import {
  register,
  login,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateAvatar,
  sendOTP,
  verifyOTP,
  resetPassword,
  sendVerificationEmail
} from "../controllers/authController.js";

import authMiddleware, {
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/* Public Routes (Không yêu cầu đăng nhập) */
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

// Quên mật khẩu bằng OTP
router.post("/forgot-password/otp", sendOTP); // Gửi OTP đến email
router.post("/forgot-password/verify-otp", verifyOTP); // Xác thực OTP
router.post("/forgot-password/reset-password", resetPassword); // Đặt lại mật khẩu

// Email verification
router.post("/send-verification-email", sendVerificationEmail);

/* Private Routes (Yêu cầu đăng nhập) */
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.put("/change-password", authMiddleware, changePassword);
router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  updateAvatar
);

/* Admin Routes */
router.get(
  "/admin/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find().select("-password"); // Ẩn password khi trả về
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
    }
  }
);

export default router;
