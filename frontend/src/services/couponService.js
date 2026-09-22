import api from './api';

export const couponService = {
  validateCoupon: async (code, orderAmount) => {
    const res = await api.post('/coupons/validate', { code, orderAmount });
    return res.data;
  },

  getCoupons: async () => {
    const res = await api.get('/coupons');
    return res.data;
  },

  createCoupon: async (couponData) => {
    const res = await api.post('/coupons', couponData);
    return res.data;
  },
};
