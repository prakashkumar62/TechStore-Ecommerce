const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
} = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.use(requireAuth, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);

module.exports = router;
