const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getCoupons,
  createCoupon,
} = require('../controllers/couponController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.post('/validate', validateCoupon);
router.get('/', requireAuth, requireAdmin, getCoupons);
router.post('/', requireAuth, requireAdmin, createCoupon);

module.exports = router;
