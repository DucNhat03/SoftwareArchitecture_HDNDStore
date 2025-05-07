// Configuration for API endpoints
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5004' // Development environment
  : window.location.origin; // Production environment

// Service endpoints
const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  USERS: `${API_BASE_URL}/api/users`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  PAYMENT: `${API_BASE_URL}/api/payment`,
  ADMIN: {
    USERS: `${API_BASE_URL}/api/admin/users`,
    PRODUCTS: `${API_BASE_URL}/api/admin/products`,
    ORDERS: `${API_BASE_URL}/api/admin/orders`,
    VOUCHERS: `${API_BASE_URL}/api/admin/vouchers`,
    UPLOAD: `${API_BASE_URL}/api/admin/upload`
  }
};

export default API_ENDPOINTS; 