const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routers/ProductRouters.js");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch((error) => console.error("❌ Lỗi kết nối MongoDB:", error));

// Sử dụng route
app.use("/products", productRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));
