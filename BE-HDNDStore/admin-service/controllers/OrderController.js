const Order = require("../models/Order");
const Product = require("../models/Product");

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

module.exports = {
  updateOrder,
  getAllOrders,
  getOrdersOfStatus,
};
