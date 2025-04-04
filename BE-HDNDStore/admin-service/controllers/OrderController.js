const Order = require("../models/Order");
const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
const { exec } = require("child_process");

// Cập nhập hóa đơn
const updateOrder = async (req, res) => {
  try {
    const { idHoaDon } = req.params;
    const {
      status,
      statusPayment,
      ngayXacNhan,
      ngayNhanHang,
      ngayHuy,
      lyDoHuy,
    } = req.body;
    if (!idHoaDon) {
      return res.status(400).json({ message: "Thiếu ID hóa đơn." });
    }
    const order = await Order.findOneAndUpdate(
      { idHoaDon },
      { status, statusPayment, ngayXacNhan, ngayNhanHang, ngayHuy, lyDoHuy },
      { new: true }
    );
    if (status === "Đã hủy") {
      for (const item of order.cartItems) {
        console.log("Danh sách sản phẩm:", order.cartItems);
        const product = await Product.findOne({ _id: item._id });
        if (product) {
          // Duyệt qua tất cả biến thể của sản phẩm trong giỏ hàng
          for (let i = 0; i < item.variants.length; i++) {
            const itemVariant = item.variants[i];

            product.variants.forEach((variant) => {
              if (variant.size === itemVariant.size && variant.color === itemVariant.color) {
                variant.stock += itemVariant.stock; // Cộng lại số lượng đã mua vào kho
              }
            });
          }

          await product.save(); // Lưu lại thông tin sản phẩm
        }

      }
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

// Lấy tất cả hóa đơn
const getAllOrders = async (req, res) => {
  try {
    const currentDate = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(currentDate.getDate() - 5);

    // Lấy tất cả hóa đơn
    let orders = await Order.find();

    // Kiểm tra và cập nhật trạng thái đơn hàng nếu cần
    const updatePromises = orders.map(async (order) => {
      let updatedFields = {};
      if (!order.ngayXacNhan && new Date(order.orderDate) <= fiveDaysAgo) {
        updatedFields.status = "Đã hủy";
        updatedFields.lyDoHuy = "Quá 5 ngày chưa xác nhận";
      }
      if (
        order.ngayXacNhan &&
        !order.ngayNhanHang &&
        new Date(order.ngayXacNhan) <= fiveDaysAgo
      ) {
        updatedFields.status = "Đã hủy";
        updatedFields.lyDoHuy = "Quá 5 ngày chưa giao hàng";
      }

      if (Object.keys(updatedFields).length > 0) {
        return Order.findByIdAndUpdate(order._id, updatedFields, { new: true });
      }
      return order;
    });

    // Chờ tất cả cập nhật hoàn thành
    orders = await Promise.all(updatePromises);

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả hóa đơn theo status
const getOrdersOfStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const currentDate = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(currentDate.getDate() - 5);

    // Lấy tất cả hóa đơn
    let orders = await Order.find({ status });

    // Kiểm tra và cập nhật trạng thái đơn hàng nếu cần
    const updatePromises = orders.map(async (order) => {
      let updatedFields = {};
      if (!order.ngayXacNhan && new Date(order.orderDate) <= fiveDaysAgo) {
        updatedFields.status = "Đã hủy";
        updatedFields.lyDoHuy = "Quá 5 ngày chưa xác nhận";
      }
      if (
        order.ngayXacNhan &&
        !order.ngayNhanHang &&
        new Date(order.ngayXacNhan) <= fiveDaysAgo
      ) {
        updatedFields.status = "Đã hủy";
        updatedFields.lyDoHuy = "Quá 5 ngày chưa giao hàng";
      }

      if (Object.keys(updatedFields).length > 0) {
        return Order.findByIdAndUpdate(order._id, updatedFields, { new: true });
      }
      return order;
    });

    // Chờ tất cả cập nhật hoàn thành
    orders = await Promise.all(updatePromises);

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả hóa đơn "Đã giao" + Export CSV
const getDeliveredOrders = async (req, res) => {
  try {
    // Lấy danh sách đơn hàng "Đã giao"
    const orders = await Order.find({ status: "Đã giao" }).lean();

    // Format lại cho dễ đọc và export CSV
    const formattedOrders = orders.map(order => ({
      idHoaDon: order.idHoaDon,
      fullName: order.shippingAddress.fullName,
      phone: order.shippingAddress.phone,
      city: order.shippingAddress.address.city,
      district: order.shippingAddress.address.district,
      ward: order.shippingAddress.address.ward,
      street: order.shippingAddress.address.street,
      status: order.status,
      statusPayment: order.statusPayment,
      paymentMethod: order.paymentMethod,
      orderDate: order.orderDate,
      ngayXacNhan: order.ngayXacNhan,
      ngayNhanHang: order.ngayNhanHang,
      finalAmount: order.finalAmount,
      cartItems: order.cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        subcategories: item.subcategories.join(", "), // Lưu ý đây là một mảng
        rating: item.rating,
        image: item.image.join(", "), // Lưu ý đây là một mảng
        imagethum: item.imagethum.join(", "), // Lưu ý đây là một mảng
        variants: item.variants.map(variant => ({
          color: variant.color,
          size: variant.size,
          stock: variant.stock
        }))
      }))
    }));

    // Các trường muốn export ra CSV
    const fields = [
      "idHoaDon",
      "fullName",
      "phone",
      "city",
      "district",
      "ward",
      "street",
      "status",
      "statusPayment",
      "paymentMethod",
      "orderDate",
      "ngayXacNhan",
      "ngayNhanHang",
      "finalAmount",
      "cartItems"
    ];

    // Parse dữ liệu ra CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedOrders);

    // Tạo thư mục exports nếu chưa có
    const exportDir = path.join(__dirname, "../exports");
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);
    
    // Đường dẫn file CSV
    const outputPath = path.join(exportDir, "delivered_orders.csv");
    fs.writeFileSync(outputPath, csv);

    console.log("✅ File CSV 'delivered_orders.csv' đã được tạo!");

    // ➕ GỌI FILE PYTHON SAU KHI ĐÃ TẠO CSV
    const pythonScriptPath = path.join(__dirname, "../config/load.py");
    exec(`python3 "${pythonScriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Lỗi khi chạy file Python:", error.message);
      }
      if (stderr) {
        console.error("⚠️ stderr:", stderr);
      }
      if (stdout) {
        console.log("🐍 Python stdout:", stdout);
      }
    });

    // Trả về phản hồi cho người dùng
    res.status(200).json({
      message: "Lấy đơn hàng & export CSV + phân tích thành công",
      orders: formattedOrders,
    });
  } catch (err) {
    console.error("❌ Lỗi khi export CSV:", err.message);
    res.status(500).json({ message: "Lỗi server khi export dữ liệu" });
  }
};

const getReport = (req, res) => {
  const filePath = path.join(__dirname, "..", "analysis_results.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Lỗi đọc file JSON:", err);
      return res.status(500).json({ error: "Không thể đọc dữ liệu phân tích." });
    }

    try {
      const reportData = JSON.parse(data);
      res.status(200).json(reportData);
    } catch (parseErr) {
      console.error("Lỗi parse JSON:", parseErr);
      res.status(500).json({ error: "Lỗi khi phân tích cú pháp file JSON." });
    }
  });
};

// Controller để trả về dữ liệu JSON phân tích
const getAnalysisResults = (req, res) => {
  const jsonFilePath = path.join(__dirname, '../exports/analysis_results.json');

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Lỗi khi đọc file JSON:', err.message);
      return res.status(500).json({ message: 'Lỗi server khi đọc file JSON' });
    }

    try {
      const jsonData = JSON.parse(data);
      res.status(200).json(jsonData);
    } catch (parseErr) {
      console.error('Lỗi khi parse file JSON:', parseErr.message);
      res.status(500).json({ message: 'Lỗi parse JSON' });
    }
  });
};

module.exports = {
  updateOrder,
  getAllOrders,
  getOrdersOfStatus,
  getDeliveredOrders,
  getReport,
  getAnalysisResults
};
