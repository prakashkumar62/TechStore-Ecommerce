const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductMeta,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/meta', getProductMeta);
router.route('/')
  .get(getProducts)
  .post(requireAuth, requireAdmin, createProduct);

router.route('/:id')
  .get(getProductById)
  .patch(requireAuth, requireAdmin, updateProduct)
  .delete(requireAuth, requireAdmin, deleteProduct);

router.post('/:id/reviews', requireAuth, createProductReview);

module.exports = router;
