import express from "express";
import {
  register,
  login,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateAvatar,
} from "../controllers/authController.js";

import authMiddleware, {
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/* ublic Routes (Không yêu cầu đăng nhập) */
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

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
