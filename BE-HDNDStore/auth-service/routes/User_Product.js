import express from "express";
import { getUserById, updateUserById } from "../controllers/authController.js";

const router = express.Router();

// Route lấy user theo ID
router.get("/:userId", getUserById);
// Thêm route PUT cập nhật thông tin user
router.put("/:userId", updateUserById);

export default router;
