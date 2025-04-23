import multer from "multer";
import streamifier from "streamifier";

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

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
