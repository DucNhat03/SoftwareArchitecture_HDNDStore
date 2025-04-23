const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Service URLs from environment variables or default to localhost
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:5001";
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:5002";
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:5003";
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || "http://localhost:5004";

// Helper function for service proxying
const createServiceProxy = (serviceUrl) => {
  return async (req, res) => {
    try {
      console.log(`Forwarding ${req.method} request to ${serviceUrl}${req.url}`);
      
      const response = await axios({
        url: `${serviceUrl}${req.url}`,
        method: req.method,
        data: req.body,
        headers: {
          'Content-Type': 'application/json',
          ...req.headers,
          // Forward authorization tokens to microservices
          'Authorization': req.headers.authorization || ''
        },
        params: req.query
      });
      
      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error(`Service request error: ${error.message}`);
      
      if (error.response) {
        // Forward error response from the service
        return res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        // No response received from service
        return res.status(503).json({ 
          error: "Service Unavailable",
          message: "The requested service is currently unavailable."
        });
      } else {
        // Something else went wrong
        return res.status(500).json({ 
          error: "Internal Gateway Error",
          message: "An unexpected error occurred."
        });
      }
    }
  };
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "API Gateway is running" });
});

// Health check for all services
app.get("/services/health", async (req, res) => {
  const serviceStatus = {
    gateway: "up",
    auth: "unknown",
    product: "unknown",
    payment: "unknown",
    admin: "unknown"
  };

  const checkService = async (url, name) => {
    try {
      await axios.get(`${url}/health`, { timeout: 3000 });
      serviceStatus[name] = "up";
    } catch (error) {
      serviceStatus[name] = "down";
    }
  };

  try {
    await Promise.all([
      checkService(AUTH_SERVICE_URL, "auth"),
      checkService(PRODUCT_SERVICE_URL, "product"),
      checkService(PAYMENT_SERVICE_URL, "payment"),
      checkService(ADMIN_SERVICE_URL, "admin")
    ]);
    
    res.status(200).json(serviceStatus);
  } catch (error) {
    res.status(500).json({ error: "Failed to check service health" });
  }
});

// Service routes
// Auth Service routes
app.use("/api/auth", createServiceProxy(`${AUTH_SERVICE_URL}/auth`));
app.use("/api/users", createServiceProxy(`${AUTH_SERVICE_URL}/api/users`));

// Product Service routes
app.use("/api/products", createServiceProxy(`${PRODUCT_SERVICE_URL}/products`));
app.use("/api/orders", createServiceProxy(`${PRODUCT_SERVICE_URL}/api`));

// Payment Service routes
app.use("/api/payment", createServiceProxy(`${PAYMENT_SERVICE_URL}`));

// Admin Service routes
app.use("/api/admin/users", createServiceProxy(`${ADMIN_SERVICE_URL}/users`));
app.use("/api/admin/products", createServiceProxy(`${ADMIN_SERVICE_URL}/products`));
app.use("/api/admin/orders", createServiceProxy(`${ADMIN_SERVICE_URL}/orders`));
app.use("/api/admin/upload", createServiceProxy(`${ADMIN_SERVICE_URL}/api`));
app.use("/api/admin/vouchers", createServiceProxy(`${ADMIN_SERVICE_URL}/api`));

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", message: "The requested resource does not exist." });
});

app.use((err, req, res, next) => {
  console.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error", message: "An unexpected error occurred." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));