const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const router = express.Router();
const Product = require("../models/Product");
const streamifier = require("streamifier");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Hàm upload ảnh lên Cloudinary
const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          console.error(`Lỗi upload Cloudinary (${folder}):`, error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

router.post(
  "/upload",
  upload.fields([
    { name: "image", maxCount: 5 },
    { name: "imagethum", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || (!req.files.image && !req.files.imagethum)) {
        return res.status(400).json({ error: "Không có file nào được chọn!" });
      }

      // Upload ảnh sản phẩm (image)
      const imageUrls = req.files.image
        ? await Promise.all(
            req.files.image.map((file) =>
              uploadToCloudinary(file, "product_images")
            )
          )
        : [];

      // Upload ảnh Thumbnail (imagethum)
      const imagethumUrls = req.files.imagethum
        ? await Promise.all(
            req.files.imagethum.map((file) =>
              uploadToCloudinary(file, "product_thumbnails")
            )
          )
        : [];

      // 🟢 Trả về danh sách URL của cả hai loại ảnh
      res.json({ imageUrls, imagethumUrls });
      console.log("imageUrls:", imageUrls);
      console.log("imagethumUrls:", imagethumUrls);
    } catch (error) {
      console.error("Lỗi server khi upload:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Lỗi khi upload ảnh!" });
      }
    }
  }
);

router.post("/delete-image", async (req, res) => {
  try {
    const { imgUrl } = req.body;

    if (!imgUrl) {
      return res.status(400).json({ error: "Không tìm thấy URL ảnh!" });
    }

    // 🟢 Lấy `public_id` từ URL (bao gồm cả thư mục nếu có)
    const matches = imgUrl.match(/\/v\d+\/(.+)\./);
    if (!matches || matches.length < 2) {
      return res.status(400).json({ error: "Không lấy được public_id!" });
    }
    const publicId = matches[1]; // Giữ nguyên thư mục nếu có

    console.log("Public ID cần xóa:", publicId);

    // 🟢 Xóa ảnh khỏi Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok") {
      return res
        .status(500)
        .json({ error: "Lỗi khi xóa ảnh trên Cloudinary!" });
    }

    // 🟢 Xóa ảnh khỏi MongoDB
    await Product.updateMany(
      { $or: [{ image: imgUrl }, { imagethum: imgUrl }] },
      { $pull: { image: imgUrl, imagethum: imgUrl } }
    );

    res.json({ success: true, message: "Xóa ảnh thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa ảnh:", error);
    res.status(500).json({ error: "Lỗi khi xóa ảnh!" });
  }
});

module.exports = router;
