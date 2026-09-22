const Razorpay = require('razorpay');

let razorpayInstance = null;

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  const isConfigured = key_id && 
    key_secret && 
    key_id !== 'rzp_test_placeholder_key' && 
    key_secret !== 'placeholder_secret_key';

  if (isConfigured && !razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id,
      key_secret,
    });
  }

  return {
    instance: razorpayInstance,
    isConfigured,
    key_id: key_id || 'rzp_test_placeholder_key',
    key_secret: key_secret || 'placeholder_secret_key',
  };
};

module.exports = { getRazorpayInstance };
