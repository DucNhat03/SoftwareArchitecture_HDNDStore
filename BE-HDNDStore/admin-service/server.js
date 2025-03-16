const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routers/UserRouter");
const productRoutes = require("./routers/ProductRouter");
const uploadRoutes = require("./routers/UploadImage");
const orderRoutes = require("./routers/OrderRouter");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/api", uploadRoutes);
app.use("/orders", orderRoutes);

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
