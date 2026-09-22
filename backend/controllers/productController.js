const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    // Search query
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { brand: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Category filter (supports comma separated or single)
    if (req.query.category && req.query.category !== 'all') {
      const categories = req.query.category.split(',');
      query.category = { $in: categories.map((c) => new RegExp(`^${c.trim()}$`, 'i')) };
    }

    // Brand filter
    if (req.query.brand && req.query.brand !== 'all') {
      const brands = req.query.brand.split(',');
      query.brand = { $in: brands.map((b) => new RegExp(`^${b.trim()}$`, 'i')) };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // In-Stock only filter
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Sorting
    let sort = { createdAt: -1 }; // default newest
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    else if (req.query.sort === 'price-desc') sort = { price: -1 };
    else if (req.query.sort === 'rating-desc') sort = { rating: -1 };
    else if (req.query.sort === 'oldest') sort = { createdAt: 1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        pages: Math.ceil(total / limit) || 1,
        total,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch categories and brands list
// @route   GET /api/products/meta
// @access  Public
const getProductMeta = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    const brands = await Product.distinct('brand', { isActive: true });
    res.json({
      success: true,
      data: {
        categories,
        brands,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    // Check if ID is a valid ObjectId, otherwise query by slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch product reviews
    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...product.toObject(),
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      images,
      category,
      brand,
      stock,
      features,
      tags,
    } = req.body;

    const product = new Product({
      name,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : 0,
      images: images || [],
      category,
      brand,
      stock: Number(stock) || 0,
      features: Array.isArray(features) ? features : [],
      tags: Array.isArray(tags) ? tags : [],
    });

    const createdProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      compareAtPrice,
      images,
      category,
      brand,
      stock,
      isActive,
      features,
      tags,
    } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (compareAtPrice !== undefined) product.compareAtPrice = Number(compareAtPrice);
    if (images) product.images = images;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (stock !== undefined) product.stock = Number(stock);
    if (isActive !== undefined) product.isActive = isActive;
    if (features) product.features = features;
    if (tags) product.tags = tags;

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (or soft delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Soft delete or hard delete
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review for product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: req.params.id,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: product._id,
      rating: Number(rating),
      comment,
    });

    // Recalculate average rating
    const allReviews = await Review.find({ product: product._id });
    product.numReviews = allReviews.length;
    product.rating =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductMeta,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
