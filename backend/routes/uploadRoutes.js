const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.post('/', requireAuth, requireAdmin, upload.single('image'), uploadImage);

module.exports = router;
