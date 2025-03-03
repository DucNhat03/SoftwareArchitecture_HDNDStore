import multer from "multer";
import fs from "fs";
import path from "path";

// Đảm bảo thư mục uploads/avatars tồn tại
const uploadDir = "uploads/avatars";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer để lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Chỉ cho phép upload ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh JPEG, PNG, JPG!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
