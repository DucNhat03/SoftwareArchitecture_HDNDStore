const { client, incrAsync, expireAsync } = require('../redisClient');

// Cấu hình rate limiter
const RATE_LIMIT = 5; // 5 requests per minute
const WINDOW_SIZE = 60; // 1 minute in seconds

// Lưu trữ IP và thời gian request nếu không dùng Redis
const inMemoryStore = new Map();

/**
 * Middleware kiểm tra và giới hạn số lượng yêu cầu từ mỗi IP
 */
const rateLimiter = async (req, res, next) => {
  try {
    // Lấy IP của client
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const key = `rate_limit:${ip}`;
    
    // Tăng bộ đếm
    const count = await incrAsync(key);
    
    // Nếu là lần đầu, set thời gian hết hạn
    if (count === 1) {
      await expireAsync(key, WINDOW_SIZE);
    }
    
    // Thêm header để hiển thị giới hạn và số lượng còn lại
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT - count));
    
    // Log thông tin rate limit
    console.log(`Rate limit for ${ip}: ${count}/${RATE_LIMIT} [Remaining: ${Math.max(0, RATE_LIMIT - count)}]`);
    
    // Kiểm tra giới hạn
    if (count > RATE_LIMIT) {
      // Tính thời gian còn lại cho TTL của key
      client.ttl(key, (err, ttl) => {
        if (err || ttl < 0) ttl = WINDOW_SIZE;
        
        // Thêm header để thông báo khi có thể tiếp tục gửi request
        res.setHeader('X-RateLimit-Reset', ttl);
        res.setHeader('Retry-After', ttl);

        // Trả về thông báo lỗi
        return res.status(429).json({
          success: false,
          message: `Quá nhiều yêu cầu. Vui lòng thử lại sau ${ttl} giây.`,
          retryAfter: ttl,
          limit: RATE_LIMIT,
          windowSize: `${WINDOW_SIZE} giây`,
          isRateLimited: true
        });
      });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    // Nếu có lỗi, vẫn cho phép request đi qua
    next();
  }
};

module.exports = rateLimiter; 