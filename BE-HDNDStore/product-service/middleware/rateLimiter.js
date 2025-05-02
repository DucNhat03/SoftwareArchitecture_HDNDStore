/**
 * Middleware giới hạn tốc độ gửi yêu cầu API
 * Sử dụng memory để lưu trữ request, trong môi trường thực tế nên sử dụng Redis
 */

// Cấu hình rate limiter
const RATE_LIMIT = 5; // 5 yêu cầu tối đa
const TIME_WINDOW = 60 * 1000; // trong 1 phút (60 giây)

// Lưu trữ IP và thời gian gửi yêu cầu
const requestStore = new Map();

/**
 * Middleware kiểm tra và giới hạn số lượng yêu cầu từ mỗi IP
 */
const rateLimiter = (req, res, next) => {
  // Lấy IP của client
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // Lấy thời gian hiện tại
  const now = Date.now();
  
  // Khởi tạo mảng request nếu IP này chưa có
  if (!requestStore.has(ip)) {
    requestStore.set(ip, []);
  }
  
  // Lấy danh sách các request trong khoảng thời gian hợp lệ
  const requests = requestStore.get(ip);
  const validRequests = requests.filter(timestamp => (now - timestamp) < TIME_WINDOW);
  
  // Cập nhật lại danh sách request
  requestStore.set(ip, validRequests);
  
  // Kiểm tra số lượng request
  if (validRequests.length >= RATE_LIMIT) {
    // Tính thời gian còn lại để có thể gửi request tiếp theo
    const oldestRequest = validRequests[0];
    const resetTime = oldestRequest + TIME_WINDOW;
    const waitTime = Math.ceil((resetTime - now) / 1000);
    
    return res.status(429).json({
      success: false,
      message: `Quá nhiều yêu cầu. Vui lòng thử lại sau ${waitTime} giây.`,
      retryAfter: waitTime
    });
  }
  
  // Thêm request hiện tại vào danh sách
  validRequests.push(now);
  requestStore.set(ip, validRequests);
  
  // Tiếp tục xử lý request
  next();
};

// Hàm để xóa dữ liệu cũ
const cleanupRequestStore = () => {
  const now = Date.now();
  
  // Duyệt qua tất cả các IP
  for (const [ip, requests] of requestStore.entries()) {
    // Lọc ra các request còn trong thời gian hợp lệ
    const validRequests = requests.filter(timestamp => (now - timestamp) < TIME_WINDOW);
    
    if (validRequests.length === 0) {
      // Nếu không còn request nào, xóa IP khỏi Map
      requestStore.delete(ip);
    } else {
      // Cập nhật lại danh sách request
      requestStore.set(ip, validRequests);
    }
  }
};

// Chạy cleanup mỗi 5 phút
setInterval(cleanupRequestStore, 5 * 60 * 1000);

module.exports = rateLimiter; 