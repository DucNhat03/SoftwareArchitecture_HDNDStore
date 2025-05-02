const express = require('express');
const router = express.Router();
const { createOrUpdate, read, update, remove, listKeys } = require('./redisController');
const rateLimiter = require('./middleware/rateLimiter');
const retry = require('./utils/retry');

// Apply rate limiter to all routes
router.use(rateLimiter);

// Create or Update route with retry
router.post('/', async (req, res) => {
  try {
    await retry(() => createOrUpdate(req, res), 3, 5000);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi sau nhiều lần thử',
      error: error.message
    });
  }
});

// Read route with retry
router.get('/:key', async (req, res) => {
  try {
    await retry(() => read(req, res), 3, 5000);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi sau nhiều lần thử',
      error: error.message
    });
  }
});

// Update route with retry
router.put('/:key', async (req, res) => {
  try {
    await retry(() => update(req, res), 3, 5000);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi sau nhiều lần thử',
      error: error.message
    });
  }
});

// Delete route with retry
router.delete('/:key', async (req, res) => {
  try {
    await retry(() => remove(req, res), 3, 5000);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi sau nhiều lần thử',
      error: error.message
    });
  }
});

// List all keys (for debugging only)
router.get('/', async (req, res) => {
  try {
    await retry(() => listKeys(req, res), 3, 5000);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi sau nhiều lần thử',
      error: error.message
    });
  }
});

module.exports = router;