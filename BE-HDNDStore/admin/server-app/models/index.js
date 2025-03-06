const mongoose = require("mongoose");
const Cus = require("./Customer"); 
const Product = require("./Product");
const Order = require("./Order");

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

// Xuất models & function kết nối
module.exports = {
  connectDB,
  Cus,
  Product,
  Order,
};
