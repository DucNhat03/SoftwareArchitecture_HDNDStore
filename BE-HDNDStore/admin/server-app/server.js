const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./models");
const Customer = require("./models/Customer");
const Product = require("./models/Product");
const Order = require("./models/Order");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Route tạo customer
app.post("/api/customers", async (req, res) => {
  try {
    const { name, email, sdt, diachi } = req.body;

    if (!name || !email || !sdt || !diachi) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Lấy ID lớn nhất và chuyển thành số
    const lastCustomer = await Customer.findOne().sort({ id: -1 });
    const newId = lastCustomer ? Number(lastCustomer.id) + 1 : 1; // Chuyển id thành số trước khi tăng

    // Tạo khách hàng mới
    const newCus = new Customer({ id: newId.toString(), name, email, sdt, diachi });

    await newCus.save();

    res.status(201).json({ message: "Customer created successfully!", cus: newCus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route cập nhật thông tin customer
app.put("/api/customers/:id", async (req, res) => {
  try {
    const { name, email, sdt, diachi } = req.body;
    const { id } = req.params;

    const customer = await Customer
      .findOneAndUpdate({
        id
      }, {
        name,
        email,
        sdt,
        diachi
      }, {
        new: true
      });
      
    if (!customer) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng." });
    }

    res.status(200).json({ message: "Customer updated successfully!", cus: customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route lấy danh sách customer
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    
    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "Không có khách hàng nào." });
    }
    res.status(200).json(customers);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khách hàng:", error);
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại sau." });
  }
});


// Route tạo Product
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, description, image, quantity, category } = req.body;
    const newProduct = new Product({ name, price, description, image, quantity, category });
    await newProduct.save();
    res.status(201).json({ message: "Product created successfully!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route lấy danh sách Product
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route tạo Order
app.post("/api/orders", async (req, res) => {
  try {
    const { customer, products, total} = req.body;
    const newOrder = new Order({ customer, products, total });
    await newOrder.save();
    res.status(201).json({ message: "Order created successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route lấy danh sách Order
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
