const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/items', addToCart);

router.route('/items/:itemId')
  .patch(updateCartItem)
  .delete(removeCartItem);

module.exports = router;
