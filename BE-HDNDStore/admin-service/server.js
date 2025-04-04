const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routers/UserRouter");
const productRoutes = require("./routers/ProductRouter");
const uploadRoutes = require("./routers/UploadImage");
const orderRoutes = require("./routers/OrderRouter");
const voucherRoutes = require("./routers/VoucherRouter");
dotenv.config();
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/api", uploadRoutes);
app.use("/api", voucherRoutes);
app.use("/orders", orderRoutes);

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

const pythonScriptPath = path.join(__dirname, "config", "load.py");
exec(`python3 ${pythonScriptPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error("Lỗi khi chạy file Python:", error.message);
    return;
  }
  if (stderr) {
    console.error("stderr từ Python:", stderr);
  }
  console.log("Kết quả từ Python:\n", stdout);
});


// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
