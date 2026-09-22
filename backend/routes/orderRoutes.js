const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

module.exports = router;
