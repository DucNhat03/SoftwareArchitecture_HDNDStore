const Product = require("../model/Product.js");
const axios = require("axios");

// Redis service URL
const REDIS_SERVICE_URL = "http://localhost:5006/api/redis";
const CACHE_ENABLED = true; // Tắt cache tạm thời để debug

// Cache TTL (Time To Live) settings
const CACHE_TTL = {
  PRODUCTS_LIST: 3600, // 1 hour for product lists
  PRODUCT_DETAIL: 1800, // 30 minutes for individual products
};

// Retry settings
const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 3000, // 3 seconds
};

// Hàm truy vấn Redis với retry
const getFromRedis = async (key) => {
  if (!CACHE_ENABLED) return null;

  try {
    const response = await axios.get(`${REDIS_SERVICE_URL}/${key}`, { timeout: 1000 }); // timeout 1s
    return response.data;
  } catch (error) {
    // Nếu lỗi là do không kết nối được hoặc timeout, log và trả về null luôn, không retry
    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ECONNABORTED' ||
      (error.message && error.message.includes('timeout'))
    ) {
      console.error(`Redis connection error for key ${key}:`, error.message);
      return null;
    }
    // Nếu là lỗi 404 (key không tồn tại), cũng trả về null
    if (error.response && error.response.status === 404) {
      return null;
    }
    // Các lỗi khác chỉ retry 1 lần với delay 500ms
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await axios.get(`${REDIS_SERVICE_URL}/${key}`, { timeout: 1000 });
      return response.data;
    } catch (err2) {
      console.error(`Redis retry error for key ${key}:`, err2.message);
      return null;
    }
  }
};

// Hàm lưu vào Redis với retry
const saveToRedis = async (key, data, expireTime = CACHE_TTL.PRODUCTS_LIST) => {
  if (!CACHE_ENABLED) return;

  try {
    await axios.post(REDIS_SERVICE_URL, {
      key,
      data,
      expiresIn: expireTime
    }, { timeout: 1000 });
    console.log(`Đã lưu dữ liệu vào Redis với key: ${key}, hết hạn sau ${expireTime} giây`);
    return true;
  } catch (error) {
    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ECONNABORTED' ||
      (error.message && error.message.includes('timeout'))
    ) {
      console.error(`Redis connection error when saving key ${key}:`, error.message);
      return false;
    }
    // Các lỗi khác chỉ retry 1 lần với delay 500ms
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await axios.post(REDIS_SERVICE_URL, {
        key,
        data,
        expiresIn: expireTime
      }, { timeout: 1000 });
      console.log(`Đã lưu dữ liệu vào Redis với key: ${key}, hết hạn sau ${expireTime} giây (sau retry)`);
      return true;
    } catch (err2) {
      console.error(`Redis retry error when saving key ${key}:`, err2.message);
      return false;
    }
  }
};

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    // Tạo Redis key
    const redisKey = `products:all`;
    
    // Thử lấy từ Redis cache trước
    const cachedData = await getFromRedis(redisKey);
    
    if (cachedData && cachedData.data) {
      console.log(`Lấy danh sách tất cả sản phẩm từ Redis cache`);
      return res.status(200).json(cachedData.data);
    }
    
    // Nếu không có trong cache, lấy từ database
    const products = await Product.find();
    
    // Lưu vào Redis cache
    await saveToRedis(redisKey, products, CACHE_TTL.PRODUCTS_LIST);
    
    console.log("Trả về danh sách sản phẩm từ database");
    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Lọc sản phẩm theo subcategories
const getProductsByCategory = async (req, res) => {
  try {
    const category = req.query.subcategories;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Tạo Redis key
    const redisKey = `products:subcategory:${category}`;
    
    // Thử lấy từ Redis cache trước
    const cachedData = await getFromRedis(redisKey);
    
    if (cachedData && cachedData.data) {
      console.log(`Lấy sản phẩm theo subcategory ${category} từ Redis cache`);
      return res.status(200).json({
        fromCache: true,
        data: cachedData.data
      });
    }
    
    // Nếu không có trong cache, lấy từ database
    const products = await Product.find({ subcategories: category });
    
    // Lưu vào Redis cache
    await saveToRedis(redisKey, products, CACHE_TTL.PRODUCTS_LIST);
    
    res.status(200).json({
      fromCache: false,
      data: products
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo subcategory:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Tìm theo category
const getProductsByCategoryy = async (req, res) => {
  try {
    const category = req.params.category;
    
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    
    // Tạo Redis key
    const redisKey = `products:category:${category}`;
    
    // Thử lấy từ Redis cache trước
    const cachedData = await getFromRedis(redisKey);
    
    if (cachedData && cachedData.data) {
      console.log(`Lấy sản phẩm theo category ${category} từ Redis cache`);
      return res.status(200).json(cachedData.data);
    }
    
    // Nếu không có trong cache, lấy từ database
    const products = await Product.find({ category: category });
    
    // Lưu vào Redis cache
    await saveToRedis(redisKey, products, CACHE_TTL.PRODUCTS_LIST);
    
    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo category:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Lấy sản phẩm đồng giá
const getProductsByPrice = async (req, res) => {
  try {
    const price = req.params.price;

    if (!price) {
      return res.status(400).json({ message: "Price is required" });
    }
    
    // Tạo Redis key
    const redisKey = `products:price:${price}`;
    
    // Thử lấy từ Redis cache trước
    const cachedData = await getFromRedis(redisKey);
    
    if (cachedData && cachedData.data) {
      console.log(`Lấy sản phẩm theo giá ${price} từ Redis cache`);
      return res.status(200).json(cachedData.data);
    }
    
    // Nếu không có trong cache, lấy từ database
    const products = await Product.find({ price: price });
    
    // Lưu vào Redis cache
    await saveToRedis(redisKey, products, CACHE_TTL.PRODUCTS_LIST);
    
    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo giá:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Lấy chi tiết sản phẩm theo ID (sử dụng Redis caching)
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    // Tạo Redis key
    const redisKey = `product:${productId}`;
    
    // Thử lấy từ Redis cache trước
    const cachedData = await getFromRedis(redisKey);
    
    if (cachedData && cachedData.data) {
      console.log(`Lấy dữ liệu sản phẩm ${productId} từ Redis cache`);
      return res.status(200).json({
        fromCache: true,
        data: cachedData.data
      });
    }
    
    // Nếu không có trong cache, lấy từ database với retry logic
    let retryCount = 0;
    
    const fetchFromDatabase = async () => {
      try {
        const product = await Product.findById(productId);
        
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        
        // Lưu vào Redis cache với thời gian sống là 30 phút
        await saveToRedis(redisKey, product, CACHE_TTL.PRODUCT_DETAIL);
        
        return res.status(200).json({
          fromCache: false,
          data: product
        });
      } catch (error) {
        retryCount++;
        
        if (retryCount < RETRY_CONFIG.MAX_RETRIES) {
          console.log(`Attempt ${retryCount} failed. Retrying in ${RETRY_CONFIG.RETRY_DELAY/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY));
          return await fetchFromDatabase();
        } else {
          throw error;
        }
      }
    };
    
    await fetchFromDatabase();
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa cache cho một sản phẩm cụ thể (hữu ích khi update/delete)
const invalidateProductCache = async (productId) => {
  if (!CACHE_ENABLED) return;
  
  try {
    // Xóa cache chi tiết sản phẩm
    const productKey = `product:${productId}`;
    await axios.delete(`${REDIS_SERVICE_URL}/${productKey}`);
    
    // Xóa các cache danh sách sản phẩm (vì danh sách có thể chứa sản phẩm này)
    const listKeys = [
      'products:all',
      // Có thể thêm các key khác nếu cần
    ];
    
    for (const key of listKeys) {
      await axios.delete(`${REDIS_SERVICE_URL}/${key}`);
    }
    
    console.log(`Đã xóa cache cho sản phẩm ${productId}`);
  } catch (error) {
    console.error(`Lỗi khi xóa cache cho sản phẩm ${productId}:`, error.message);
  }
};

module.exports = { 
  getAllProducts, 
  getProductsByCategory, 
  getProductsByCategoryy, 
  getProductsByPrice,
  getProductById,
  invalidateProductCache // Export thêm hàm này để sử dụng khi cần
};

