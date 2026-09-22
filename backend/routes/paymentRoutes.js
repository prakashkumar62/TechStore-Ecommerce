const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
} = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

router.use(requireAuth);

router.post('/create-order', paymentLimiter, createRazorpayOrder);
router.post('/verify', paymentLimiter, verifyPayment);

module.exports = router;
