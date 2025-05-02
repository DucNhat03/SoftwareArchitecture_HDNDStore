import axios from "axios";
import rateLimiter from "../utils/rateLimiter";
import retry from "../utils/retry";
import toastService from "../utils/toastService";

// API Base URLs
const API_GATEWAY_URL = "http://localhost:5004"; // API Gateway URL
const AUTH_API_URL = "http://localhost:5001"; // Authentication service
const REDIS_API_URL = "http://localhost:5006"; // Redis service

// Create API instances for different services
const api = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const productApi = axios.create({
  baseURL: API_GATEWAY_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const redisApi = axios.create({
  baseURL: REDIS_API_URL + "/api/redis",
  headers: {
    "Content-Type": "application/json",
  },
});

// Dispatch rate limit event for notifications
const dispatchRateLimitEvent = (remainingTime) => {
  const event = new CustomEvent('ratelimit', { 
    detail: { 
      isRateLimited: true,
      remainingTime 
    } 
  });
  window.dispatchEvent(event);
};

// Authentication API interceptor - add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Product API interceptor - add token to requests
productApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Redis API interceptor with rate limiting
redisApi.interceptors.request.use(
  (config) => {
    // Apply rate limiting
    if (!rateLimiter.canMakeRequest()) {
      const remainingTime = rateLimiter.getRemainingTime();
      const errorMessage = `Quá nhiều yêu cầu đến Redis! Vui lòng thử lại sau ${remainingTime} giây.`;
      
      // Display toast notification
      toastService.warning(errorMessage);
      
      // Dispatch rate limit event
      dispatchRateLimitEvent(remainingTime);
      
      // Reject the request with a custom error
      return Promise.reject({
        response: {
          status: 429,
          data: { message: errorMessage, remainingTime }
        }
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Redis API response interceptor for rate limiting
redisApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle rate limit errors from server
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      
      // Dispatch rate limit event
      dispatchRateLimitEvent(retryAfter);
      
      // Display notification
      toastService.warning(`Đã đạt giới hạn yêu cầu. Vui lòng thử lại sau ${retryAfter} giây.`);
    }
    
    return Promise.reject(error);
  }
);

// Authentication API Functions - PRESERVED FROM ORIGINAL
// Password reset functions
export const sendOtp = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password/otp", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Lỗi gửi OTP!";
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/auth/forgot-password/verify-otp", {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Lỗi xác minh OTP!";
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await api.post("/auth/forgot-password/reset-password", {
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Lỗi đặt lại mật khẩu!";
  }
};

// Login function
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Lỗi đăng nhập!";
  }
};

// Google login
export const googleLogin = async (token) => {
  try {
    const response = await api.post("/auth/google", { token });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Lỗi đăng nhập Google!";
  }
};

// Registration with Email Verification
export const register = async (userData) => {
  try {
    // Step 1: Store user data temporarily in Redis
    const verificationCode = generateVerificationCode();
    const redisKey = `verify_user_${userData.email}`;
    
    // Add verification code to userData
    const userDataWithCode = {
      ...userData,
      verificationCode,
      createdAt: new Date().toISOString()
    };
    
    // Store in Redis with expiration (24 hours)
    await redisService.createOrUpdate(redisKey, userDataWithCode);
    
    // Step 2: Send verification email via backend
    await api.post("/auth/send-verification-email", {
      email: userData.email,
      verificationCode
    });
    
    return {
      success: true,
      message: "Đăng ký tạm thời thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
      email: userData.email
    };
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    throw error.response?.data || { error: "Lỗi đăng ký!" };
  }
};

// Verify Email function
export const verifyEmail = async (email, verificationCode) => {
  try {
    // Step 1: Get user data from Redis
    const redisKey = `verify_user_${email}`;
    const result = await redisService.read(redisKey);
    
    if (!result.success || !result.data) {
      throw { error: "Thông tin đăng ký không tồn tại hoặc đã hết hạn!" };
    }
    
    const userData = result.data;
    
    // Step 2: Verify the code
    if (userData.verificationCode !== verificationCode) {
      throw { error: "Mã xác thực không chính xác!" };
    }
    
    // Step 3: Register the user in the actual database
    // Remove verification fields before passing to register
    const userDataToRegister = { ...userData };
    delete userDataToRegister.verificationCode;
    delete userDataToRegister.createdAt;
    
    const registerResponse = await api.post("/auth/register", userDataToRegister);
    
    // Step 4: Delete from Redis after successful registration
    await redisService.delete(redisKey);
    
    return {
      success: true,
      message: "Xác thực email thành công! Tài khoản của bạn đã được kích hoạt.",
      ...registerResponse.data
    };
  } catch (error) {
    console.error("Lỗi xác thực email:", error);
    throw error.response?.data || error || { error: "Lỗi xác thực email!" };
  }
};

// Resend verification email
export const resendVerificationEmail = async (email) => {
  try {
    // Get user data from Redis
    const redisKey = `verify_user_${email}`;
    const result = await redisService.read(redisKey);
    
    if (!result.success || !result.data) {
      throw { error: "Thông tin đăng ký không tồn tại hoặc đã hết hạn!" };
    }
    
    // Generate new verification code
    const verificationCode = generateVerificationCode();
    
    // Update user data in Redis
    const userData = result.data;
    userData.verificationCode = verificationCode;
    
    await redisService.update(redisKey, userData);
    
    // Send new verification email
    await api.post("/auth/send-verification-email", {
      email,
      verificationCode
    });
    
    return {
      success: true,
      message: "Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư của bạn."
    };
  } catch (error) {
    console.error("Lỗi gửi lại email xác thực:", error);
    throw error.response?.data || error || { error: "Lỗi gửi lại email xác thực!" };
  }
};

// Utility function to generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

// Profile management
export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Lỗi lấy thông tin người dùng!";
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Lỗi cập nhật thông tin người dùng!";
  }
};

export const uploadAvatar = async (formData) => {
  try {
    const response = await api.post("/auth/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Lỗi tải lên ảnh đại diện!";
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.put("/auth/change-password", passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Lỗi thay đổi mật khẩu!";
  }
};

// Redis service functions
export const redisService = {
  // Create or update data in Redis
  createOrUpdate: async (key, data) => {
    try {
      const response = await retry(() => redisApi.post('/', { key, data }));
      return response.data;
    } catch (error) {
      console.error('Redis create/update error:', error);
      throw error.response?.data || { message: 'Lỗi khi lưu dữ liệu vào Redis' };
    }
  },
  
  // Read data from Redis
  read: async (key) => {
    try {
      const response = await retry(() => redisApi.get(`/${key}`));
      return response.data;
    } catch (error) {
      console.error('Redis read error:', error);
      throw error.response?.data || { message: 'Lỗi khi đọc dữ liệu từ Redis' };
    }
  },
  
  // Update data in Redis
  update: async (key, data) => {
    try {
      const response = await retry(() => redisApi.put(`/${key}`, { data }));
      return response.data;
    } catch (error) {
      console.error('Redis update error:', error);
      throw error.response?.data || { message: 'Lỗi khi cập nhật dữ liệu trong Redis' };
    }
  },
  
  // Delete data from Redis
  delete: async (key) => {
    try {
      const response = await retry(() => redisApi.delete(`/${key}`));
      return response.data;
    } catch (error) {
      console.error('Redis delete error:', error);
      throw error.response?.data || { message: 'Lỗi khi xóa dữ liệu từ Redis' };
    }
  },
  
  // List all keys (for debugging only)
  listKeys: async () => {
    try {
      const response = await retry(() => redisApi.get('/'));
      return response.data;
    } catch (error) {
      console.error('Redis list keys error:', error);
      throw error.response?.data || { message: 'Lỗi khi liệt kê keys trong Redis' };
    }
  }
};

// Helper function with retry for general API calls
export const apiCall = async (method, url, data = null, options = {}) => {
  try {
    const apiMethod = method.toLowerCase();
    const apiFunction = () => {
      // Determine which API client to use based on URL
      let client = api; // Default to auth API
      
      if (url.includes('/redis')) {
        client = redisApi;
      } else if (url.includes('/products')) {
        client = productApi;
      }
      
      switch (apiMethod) {
        case 'get':
          return client.get(url, { params: data });
        case 'post':
          return client.post(url, data);
        case 'put':
          return client.put(url, data);
        case 'delete':
          return client.delete(url, { data });
        default:
          throw new Error(`Unsupported API method: ${method}`);
      }
    };
    
    const response = await retry(apiFunction, options);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      // Rate limit error
      throw { message: error.response.data.message, isRateLimited: true };
    }
    throw error.response?.data || `Lỗi ${method.toUpperCase()} request!`;
  }
};

// Product API functions
export const productService = {
  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await retry(() => productApi.get(`/products/${productId}`));
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error.response?.data || { message: 'Lỗi khi lấy thông tin sản phẩm' };
    }
  },
  
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await retry(() => productApi.get('/products/all'));
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error.response?.data || { message: 'Lỗi khi lấy danh sách sản phẩm' };
    }
  },
  
  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await retry(() => productApi.get(`/products/all/${category}`));
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error.response?.data || { message: 'Lỗi khi lấy sản phẩm theo danh mục' };
    }
  }
};

export default api;
