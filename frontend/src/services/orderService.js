import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return res.data;
  },

  getMyOrders: async () => {
    const res = await api.get('/orders');
    return res.data;
  },

  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  cancelOrder: async (id, reason) => {
    const res = await api.patch(`/orders/${id}/cancel`, { reason });
    return res.data;
  },
};
