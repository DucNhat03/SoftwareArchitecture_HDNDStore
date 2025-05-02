const express = require('express');
const cors = require('cors');
const redisRoutes = require('./redisRoutes');

const app = express();
const PORT = process.env.PORT || 5006;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Handle errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Redis Service is running', mode: 'In-memory mock' });
});

// Redis Routes - support both paths for compatibility
app.use('/redis', redisRoutes);  // Old path
app.use('/api/redis', redisRoutes); // New path

// Root endpoint
app.get('/', (req, res) => {
  res.send('Redis Service is running with in-memory mock implementation. No Redis server needed!');
});

// Process error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Keep the process running but log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the process running but log the error
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Redis Service is running on port ${PORT}`);
  console.log(`- API paths: http://localhost:${PORT}/api/redis and http://localhost:${PORT}/redis`);
  console.log(`- Health check: http://localhost:${PORT}/health`);
  console.log(`- Mode: In-memory mock (doesn't require a Redis server)`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please choose another port.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

module.exports = app; // Export for testing