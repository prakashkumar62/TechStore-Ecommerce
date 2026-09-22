const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be positive'],
    },
    compareAtPrice: {
      type: Number,
      default: 0,
    },
    images: [imageSchema],
    category: {
      type: String,
      required: [true, 'Please specify category'],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Please specify brand'],
      trim: true,
      index: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide product stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    features: [{ type: String }],
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug before saving if not present or name changed
productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
