const cloudinary = require('../config/cloudinary');

// @desc    Upload image to Cloudinary (with graceful base64/placeholder fallback)
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach an image file' });
    }

    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud' &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== '123456789012345';

    if (isCloudinaryConfigured) {
      // Convert buffer to base64 data URI to stream to Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'techstore/products',
        resource_type: 'auto',
      });

      return res.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      });
    } else {
      // Fallback for development when Cloudinary credentials are not yet supplied
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      return res.json({
        success: true,
        data: {
          url: dataURI,
          publicId: `dev_local_${Date.now()}`,
          note: 'Cloudinary not configured; used base64 data URI fallback for development',
        },
      });
    }
  } catch (error) {
    console.error('Image Upload Error:', error);
    next(error);
  }
};

module.exports = { uploadImage };
