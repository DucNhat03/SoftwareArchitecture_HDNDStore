import axios from "axios";

const API_BASE_URL = "http://localhost:5001"; // Địa chỉ BE của bạn

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Tự động thêm token vào tất cả request
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

export default api;
