const { getAsync, setAsync, delAsync, existsAsync, keysAsync } = require('./redisClient');

// Thiết lập thời gian sống cho dữ liệu Redis (7 ngày)
const EXPIRATION_TIME = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Kiểm tra tính hợp lệ của key và data
 * @param {string} key - Key cần kiểm tra
 * @param {object|undefined} data - Data tùy chọn cần kiểm tra
 * @returns {Object} - Kết quả kiểm tra { isValid, message }
 */
const validateInput = (key, data) => {
  if (!key || typeof key !== 'string') {
    return { isValid: false, message: 'Key phải là một chuỗi không trống' };
  }
  
  if (key.length > 100) {
    return { isValid: false, message: 'Key không được vượt quá 100 ký tự' };
  }
  
  // Nếu data được cung cấp, đảm bảo nó có thể được chuyển thành JSON
  if (data !== undefined) {
    try {
      JSON.stringify(data);
    } catch (error) {
      return { isValid: false, message: 'Data không thể chuyển đổi thành JSON' };
    }
  }
  
  return { isValid: true, message: 'Input hợp lệ' };
};

// Create - Tạo hoặc cập nhật dữ liệu
const createOrUpdate = async (req, res) => {
  try {
    const { key, data } = req.body;
    
    // Validate input
    const validation = validateInput(key, data);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: validation.message
      });
    }

    // Lưu dữ liệu vào Redis với thời gian sống
    await setAsync(key, JSON.stringify(data), 'EX', EXPIRATION_TIME);
    
    res.status(201).json({
      success: true,
      message: 'Dữ liệu đã được lưu trữ thành công',
      key,
      expiresIn: `${EXPIRATION_TIME} giây`
    });
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu vào Redis:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lưu dữ liệu',
      error: error.message
    });
  }
};

// Read - Đọc dữ liệu
const read = async (req, res) => {
  try {
    const { key } = req.params;
    
    // Validate input
    const validation = validateInput(key);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: validation.message
      });
    }

    // Kiểm tra xem key có tồn tại không
    const exists = await existsAsync(key);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dữ liệu với key này'
      });
    }

    // Lấy dữ liệu từ Redis
    const dataString = await getAsync(key);
    
    try {
      const data = JSON.parse(dataString);
      res.status(200).json({
        success: true,
        data
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        message: 'Dữ liệu lấy từ Redis không phải là JSON hợp lệ',
        error: parseError.message
      });
    }
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu từ Redis:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đọc dữ liệu',
      error: error.message
    });
  }
};

// Update - Cập nhật dữ liệu
const update = async (req, res) => {
  try {
    const { key } = req.params;
    const { data } = req.body;
    
    // Validate input
    const validation = validateInput(key, data);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: validation.message
      });
    }

    // Kiểm tra xem key có tồn tại không
    const exists = await existsAsync(key);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dữ liệu với key này'
      });
    }

    // Cập nhật dữ liệu vào Redis
    await setAsync(key, JSON.stringify(data), 'EX', EXPIRATION_TIME);
    
    res.status(200).json({
      success: true,
      message: 'Dữ liệu đã được cập nhật thành công',
      key,
      expiresIn: `${EXPIRATION_TIME} giây`
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật dữ liệu trong Redis:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật dữ liệu',
      error: error.message
    });
  }
};

// Delete - Xóa dữ liệu
const remove = async (req, res) => {
  try {
    const { key } = req.params;
    
    // Validate input
    const validation = validateInput(key);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: validation.message
      });
    }

    // Kiểm tra xem key có tồn tại không
    const exists = await existsAsync(key);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dữ liệu với key này'
      });
    }

    // Xóa dữ liệu từ Redis
    await delAsync(key);
    
    res.status(200).json({
      success: true,
      message: 'Dữ liệu đã được xóa thành công',
      key
    });
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu từ Redis:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa dữ liệu',
      error: error.message
    });
  }
};

// List - Liệt kê tất cả các keys (chỉ dùng cho mục đích debug)
const listKeys = async (req, res) => {
  try {
    // Lấy tất cả các keys
    const keys = await keysAsync('*');
    
    res.status(200).json({
      success: true,
      keys,
      count: keys.length
    });
  } catch (error) {
    console.error('Lỗi khi liệt kê keys từ Redis:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi liệt kê keys',
      error: error.message
    });
  }
};

module.exports = {
  createOrUpdate,
  read,
  update,
  remove,
  listKeys
};