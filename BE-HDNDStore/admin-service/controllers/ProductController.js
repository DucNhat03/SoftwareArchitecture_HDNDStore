const Product = require("../models/Product");
const Order = require("../models/Order");
const axios = require('axios');

// Redis service URL for cache invalidation
const REDIS_SERVICE_URL = "http://localhost:5006/api/redis";

// Function to invalidate product-related caches
const invalidateProductCaches = async (product) => {
  try {
    if (!product) return;
    
    // Invalidate specific product cache
    const productId = product._id.toString();
    await axios.delete(`${REDIS_SERVICE_URL}/product:${productId}`);
    
    // Invalidate category caches
    if (product.category) {
      await axios.delete(`${REDIS_SERVICE_URL}/products:category:${product.category}`);
    }
    
    // Invalidate subcategory caches
    if (product.subcategories) {
      await axios.delete(`${REDIS_SERVICE_URL}/products:subcategory:${product.subcategories}`);
    }
    
    // Invalidate price caches
    if (product.price) {
      await axios.delete(`${REDIS_SERVICE_URL}/products:price:${product.price}`);
    }
    
    // Always invalidate all products cache
    await axios.delete(`${REDIS_SERVICE_URL}/products:all`);
    
    console.log(`Đã xóa cache liên quan đến sản phẩm ${productId}`);
  } catch (error) {
    console.error('Lỗi khi xóa cache sản phẩm:', error.message);
    // Không throw lỗi để không ảnh hưởng đến luồng chính
  }
};

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      subcategories,
      image,
      rating,
      imagethum,
      status,
    } = req.body;

    // Kiểm tra nếu tên sản phẩm đã tồn tại
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ error: "Tên sản phẩm đã tồn tại!" });
    }
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 1; // Không cần `Number()`
    // Tạo sản phẩm mới
    const newProduct = new Product({
      id: newId.toString(),
      name,
      price,
      description,
      category,
      subcategories,
      status,
      image,
      rating,
      imagethum,
      variants: [
        { size: "39", color: "Đen", stock: 0 },
        { size: "40", color: "Đen", stock: 0 },
        { size: "41", color: "Đen", stock: 0 },
        { size: "42", color: "Đen", stock: 0 },
        { size: "43", color: "Đen", stock: 0 },
        { size: "39", color: "Trắng", stock: 0 },
        { size: "40", color: "Trắng", stock: 0 },
        { size: "41", color: "Trắng", stock: 0 },
        { size: "42", color: "Trắng", stock: 0 },
        { size: "43", color: "Trắng", stock: 0 },
        { size: "39", color: "Vàng", stock: 0 },
        { size: "40", color: "Vàng", stock: 0 },
        { size: "41", color: "Vàng", stock: 0 },
        { size: "42", color: "Vàng", stock: 0 },
        { size: "43", color: "Vàng", stock: 0 },
        { size: "39", color: "Xanh", stock: 0 },
        { size: "40", color: "Xanh", stock: 0 },
        { size: "41", color: "Xanh", stock: 0 },
        { size: "42", color: "Xanh", stock: 0 },
        { size: "43", color: "Xanh", stock: 0 },
      ],
    });

    await newProduct.save();
    
    // Xóa cache liên quan khi thêm sản phẩm mới
    await invalidateProductCaches(newProduct);

    res
      .status(201)
      .json({
        message: "Sản phẩm đã được tạo thành công!",
        product: newProduct,
      });
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      description,
      category,
      subcategories,
      image,
      rating,
      imagethum,
      status,
    } = req.body;

    // Kiểm tra nếu không có id
    if (!id) {
      return res.status(400).json({ message: "Thiếu ID sản phẩm." });
    }

    // Kiểm tra nếu tên sản phẩm đã tồn tại ở sản phẩm khác
    const existingProduct = await Product.findOne({ name, id: { $ne: id } });
    if (existingProduct) {
      return res.status(400).json({ error: "Tên sản phẩm đã tồn tại!" });
    }

    // Tìm và cập nhật sản phẩm
    const oldProduct = await Product.findOne({ id });
    
    const updatedProduct = await Product.findOneAndUpdate(
      { id },
      {
        name,
        price,
        description,
        category,
        image,
        rating,
        imagethum,
        subcategories,
        status,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }
    
    // Xóa cả cache của thông tin cũ và mới
    if (oldProduct) {
      await invalidateProductCaches(oldProduct);
    }
    await invalidateProductCaches(updatedProduct);

    res
      .status(200)
      .json({
        message: "Cập nhật sản phẩm thành công!",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại." });
  }
};

// Lấy danh sách sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào." });
    }

    // Cập nhật trạng thái sản phẩm dựa vào stock của các variants
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const totalStock = product.variants.reduce(
          (sum, variant) => sum + variant.stock,
          0
        );

        if (totalStock === 0 && product.status !== "Hết hàng") {
          product.status = "Hết hàng";
          await product.save();
        } else if (totalStock > 0 && product.status !== "Còn hàng") {
          product.status = "Còn hàng";
          await product.save();
        }

        return product;
      })
    );

    res.status(200).json(updatedProducts);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại sau." });
  }
};

// Lấy danh sách sản phẩm có category là Giày nữ
const getWomenProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: "Giày nữ" });
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào." });
    }

    // Cập nhật trạng thái sản phẩm dựa vào stock của các variants
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const totalStock = product.variants.reduce(
          (sum, variant) => sum + variant.stock,
          0
        );

        if (totalStock === 0 && product.status !== "Hết hàng") {
          product.status = "Hết hàng";
          await product.save();
        } else if (totalStock > 0 && product.status !== "Còn hàng") {
          product.status = "Còn hàng";
          await product.save();
        }

        return product;
      })
    );

    res.status(200).json(updatedProducts);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại sau." });
  }
};

// Lấy danh sách sản phẩm có category là Giày nam
const getMenProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: "Giày nam" });
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào." });
    }

    // Cập nhật trạng thái sản phẩm dựa vào stock của các variants
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const totalStock = product.variants.reduce(
          (sum, variant) => sum + variant.stock,
          0
        );

        if (totalStock === 0 && product.status !== "Hết hàng") {
          product.status = "Hết hàng";
          await product.save();
        } else if (totalStock > 0 && product.status !== "Còn hàng") {
          product.status = "Còn hàng";
          await product.save();
        }

        return product;
      })
    );

    res.status(200).json(updatedProducts);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại sau." });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin sản phẩm trước khi xóa để invalidate cache
    const productToDelete = await Product.findOne({ id });
    
    // Tìm và xóa sản phẩm
    const deletedProduct = await Product.findOneAndDelete({ id });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }
    
    // Xóa cache sau khi xóa sản phẩm
    if (productToDelete) {
      await invalidateProductCaches(productToDelete);
    }

    res.status(200).json({ message: "Sản phẩm đã được xóa thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại." });
  }
};

// Kiểm tra trùng tên sản phẩm
const checkDuplicateProduct = async (req, res) => {
  const { name, id } = req.query;

  try {
    const existingProduct = await Product.findOne({
      name,
      id: { $ne: id }, // Loại trừ chính sản phẩm đang chỉnh sửa
    });

    if (existingProduct) {
      return res.json({ duplicate: true });
    }
    res.json({ duplicate: false });
  } catch (err) {
    console.error("Lỗi kiểm tra trùng lặp sản phẩm:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Nhập hàng
const addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { size, color, stock, status } = req.body;

    const product = await Product.findOne({ id });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    // Tìm biến thể phù hợp với size và color
    const variant = product.variants.find(
      (v) => v.size === size && v.color === color
    );

    if (!variant) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy biến thể phù hợp." });
    }

    // Cộng thêm số lượng tồn kho
    variant.stock += stock;
    product.status = status;
    await product.save();

    // Xóa cache sau khi cập nhật số lượng
    await invalidateProductCaches(product);

    res.status(200).json({ message: "Nhập hàng thành công!", product });
  } catch (error) {
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại." });
    console.error("Lỗi khi nhập hàng:", error);
  }
};

// Xuất hàng
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { variants } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Thiếu ID sản phẩm." });
    }

    if (!variants || !Array.isArray(variants)) {
      return res.status(400).json({ message: "Dữ liệu variants không hợp lệ." });
    }

    // Tìm sản phẩm
    const product = await Product.findOne({ id });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    // Cập nhật variant
    variants.forEach((newVariant) => {
      const variantIndex = product.variants.findIndex(
        (v) => v.size === newVariant.size && v.color === newVariant.color
      );

      if (variantIndex !== -1) {
        product.variants[variantIndex].stock = newVariant.stock;
      }
    });

    // Cập nhật trạng thái sản phẩm dựa vào tổng số lượng
    const totalStock = product.variants.reduce(
      (sum, variant) => sum + variant.stock,
      0
    );
    product.status = totalStock > 0 ? "Còn hàng" : "Hết hàng";

    // Lưu sản phẩm
    await product.save();
    
    // Xóa cache sau khi cập nhật số lượng
    await invalidateProductCaches(product);

    res.status(200).json({
      message: "Cập nhật số lượng thành công!",
      product,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", error);
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại." });
  }
};

// Lấy các sản phẩm bán chạy nhất
const getTopProducts = async (req, res) => {
  try {
    // Lấy tất cả đơn hàng đã giao
    const completedOrders = await Order.find({ status: "Đã giao" });
    
    // Tạo map để đếm số lượng bán của từng sản phẩm
    const productSalesMap = new Map();
    
    // Tính tổng số lượng bán của từng sản phẩm
    completedOrders.forEach(order => {
      order.cartItems.forEach(item => {
        const productId = item._id.toString();
        const productName = item.name;
        
        // Tính tổng số lượng từ tất cả variants
        const totalQuantity = item.variants.reduce((sum, variant) => sum + variant.stock, 0);
        
        if (productSalesMap.has(productId)) {
          const current = productSalesMap.get(productId);
          productSalesMap.set(productId, {
            ...current,
            quantity: current.quantity + totalQuantity
          });
        } else {
          productSalesMap.set(productId, {
            id: productId,
            name: productName,
            quantity: totalQuantity,
            image: item.image[0] || '',
            price: item.price
          });
        }
      });
    });
    
    // Chuyển map thành mảng và sắp xếp theo số lượng giảm dần
    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10); // Lấy 10 sản phẩm bán chạy nhất
    
    res.status(200).json(topProducts);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm bán chạy:", error);
    res.status(500).json({ error: error.message });
  }
};

// Thêm hoặc cập nhật hàm làm sạch toàn bộ cache
const clearAllProductCache = async (req, res) => {
  try {
    // Lấy tất cả key liên quan đến sản phẩm
    const response = await axios.get(REDIS_SERVICE_URL);
    const keys = response.data.keys || [];
    
    const productKeys = keys.filter(key => 
      key.startsWith('product:') || key.startsWith('products:')
    );
    
    // Xóa từng key
    let deletedCount = 0;
    for (const key of productKeys) {
      await axios.delete(`${REDIS_SERVICE_URL}/${key}`);
      deletedCount++;
    }
    
    res.status(200).json({
      message: `Đã xóa ${deletedCount} cache sản phẩm thành công!`
    });
  } catch (error) {
    console.error("Lỗi khi xóa cache sản phẩm:", error);
    res.status(500).json({ error: "Lỗi khi xóa cache sản phẩm." });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
  checkDuplicateProduct,
  addStock,
  updateStock,
  getWomenProducts,
  getMenProducts,
  getTopProducts,
  clearAllProductCache
};
