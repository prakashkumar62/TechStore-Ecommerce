import api from './api';

export const paymentService = {
  createRazorpayOrder: async (amount, currency = 'INR', receipt = '') => {
    const res = await api.post('/payments/create-order', {
      amount,
      currency,
      receipt,
    });
    return res.data;
  },

  verifyPayment: async (paymentData) => {
    const res = await api.post('/payments/verify', paymentData);
    return res.data;
  },
};
