import express from "express";
import { register, login, getUserProfile, updateUserProfile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { changePassword } from "../controllers/authController.js";
import { updateAvatar } from "../controllers/authController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile);  
router.put("/profile", authMiddleware, updateUserProfile); 
router.put("/change-password", authMiddleware, changePassword);
router.post("/upload-avatar", authMiddleware, upload.single("avatar"), updateAvatar);

export default router;
