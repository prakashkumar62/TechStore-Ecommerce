const crypto = require('crypto');
const { getRazorpayInstance } = require('../config/razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' });
    }

    const { instance, isConfigured, key_id } = getRazorpayInstance();

    // Razorpay requires amount in the smallest currency sub-unit (Paise for INR)
    const amountInPaise = Math.round(Number(amount) * 100);

    if (isConfigured && instance) {
      const options = {
        amount: amountInPaise,
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      };

      const razorpayOrder = await instance.orders.create(options);

      return res.json({
        success: true,
        data: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: key_id,
          isMock: false,
        },
      });
    } else {
      // Portfolio Test/Mock Mode fallback when Razorpay credentials are not yet configured in .env
      const mockOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return res.json({
        success: true,
        data: {
          id: mockOrderId,
          amount: amountInPaise,
          currency,
          keyId: 'rzp_test_placeholder_key',
          isMock: true,
          message: 'Razorpay Test Simulation Mode Active',
        },
      });
    }
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature and finalize order
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData, // contains items, addressSnapshot, subtotal, shippingFee, discountAmount, totalAmount
    } = req.body;

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order data provided' });
    }

    const { isConfigured, key_secret } = getRazorpayInstance();
    let isSignatureValid = false;

    if (isConfigured && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(body.toString())
        .digest('hex');

      isSignatureValid = expectedSignature === razorpay_signature;
    } else {
      // Mock/Simulated verification for demo test orders
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature',
      });
    }

    // Check stock for all items before placing order
    for (const item of orderData.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.nameSnapshot || 'item'} is no longer available`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // Decrement product stock
    for (const item of orderData.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create the confirmed Order document in MongoDB
    const order = await Order.create({
      user: req.user._id,
      items: orderData.items,
      addressSnapshot: orderData.addressSnapshot,
      paymentMethod: 'razorpay',
      paymentStatus: 'completed',
      orderStatus: 'placed',
      subtotal: orderData.subtotal,
      shippingFee: orderData.shippingFee || 0,
      discountAmount: orderData.discountAmount || 0,
      totalAmount: orderData.totalAmount,
      razorpayOrderId: razorpay_order_id || 'simulated_order_id',
      razorpayPaymentId: razorpay_payment_id || `pay_${Date.now()}`,
      razorpaySignature: razorpay_signature || 'simulated_sig',
      paidAt: new Date(),
      statusTimeline: [
        {
          status: 'placed',
          timestamp: new Date(),
          comment: 'Order placed & payment verified successfully',
        },
      ],
    });

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Payment verified and order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    next(error);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
