const axios = require('axios');

// Redis service URL
const REDIS_SERVICE_URL = "http://localhost:5006/api/redis";

/**
 * Utility to invalidate product cache
 * @param {string} productId - The ID of the product to invalidate
 * @returns {Promise<boolean>} - True if cache was invalidated successfully
 */
const invalidateProductCache = async (productId) => {
  try {
    // Xóa cache chi tiết sản phẩm
    const productKey = `product:${productId}`;
    await axios.delete(`${REDIS_SERVICE_URL}/${productKey}`);
    
    // Xóa các cache danh sách sản phẩm (vì danh sách có thể chứa sản phẩm này)
    const listKeys = [
      'products:all'
    ];
    
    for (const key of listKeys) {
      await axios.delete(`${REDIS_SERVICE_URL}/${key}`);
    }
    
    console.log(`✅ Đã xóa cache cho sản phẩm ${productId}`);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi khi xóa cache cho sản phẩm ${productId}:`, error.message);
    return false;
  }
};

/**
 * Utility to invalidate category cache
 * @param {string} category - The category to invalidate
 * @returns {Promise<boolean>} - True if cache was invalidated successfully
 */
const invalidateCategoryCache = async (category) => {
  try {
    // Xóa cache danh sách sản phẩm theo category
    const categoryKey = `products:category:${category}`;
    await axios.delete(`${REDIS_SERVICE_URL}/${categoryKey}`);
    
    // Xóa danh sách sản phẩm tổng
    await axios.delete(`${REDIS_SERVICE_URL}/products:all`);
    
    console.log(`✅ Đã xóa cache cho category ${category}`);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi khi xóa cache cho category ${category}:`, error.message);
    return false;
  }
};

/**
 * Utility to invalidate subcategory cache
 * @param {string} subcategory - The subcategory to invalidate
 * @returns {Promise<boolean>} - True if cache was invalidated successfully
 */
const invalidateSubcategoryCache = async (subcategory) => {
  try {
    // Xóa cache danh sách sản phẩm theo subcategory
    const subcategoryKey = `products:subcategory:${subcategory}`;
    await axios.delete(`${REDIS_SERVICE_URL}/${subcategoryKey}`);
    
    console.log(`✅ Đã xóa cache cho subcategory ${subcategory}`);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi khi xóa cache cho subcategory ${subcategory}:`, error.message);
    return false;
  }
};

/**
 * Utility to invalidate price cache
 * @param {number} price - The price to invalidate
 * @returns {Promise<boolean>} - True if cache was invalidated successfully
 */
const invalidatePriceCache = async (price) => {
  try {
    // Xóa cache danh sách sản phẩm theo price
    const priceKey = `products:price:${price}`;
    await axios.delete(`${REDIS_SERVICE_URL}/${priceKey}`);
    
    console.log(`✅ Đã xóa cache cho price ${price}`);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi khi xóa cache cho price ${price}:`, error.message);
    return false;
  }
};

/**
 * Utility to invalidate all product caches
 * @returns {Promise<boolean>} - True if all caches were invalidated successfully
 */
const invalidateAllProductCaches = async () => {
  try {
    // Get all keys from Redis that start with "product:"
    const response = await axios.get(`${REDIS_SERVICE_URL}`);
    const keys = response.data.keys || [];
    
    // Filter product-related keys
    const productKeys = keys.filter(key => 
      key.startsWith('product:') || 
      key.startsWith('products:')
    );
    
    // Delete each key
    for (const key of productKeys) {
      await axios.delete(`${REDIS_SERVICE_URL}/${key}`);
    }
    
    console.log(`✅ Đã xóa ${productKeys.length} cache liên quan đến sản phẩm`);
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi xóa tất cả cache sản phẩm:', error.message);
    return false;
  }
};

module.exports = {
  invalidateProductCache,
  invalidateCategoryCache,
  invalidateSubcategoryCache,
  invalidatePriceCache,
  invalidateAllProductCaches
}; 