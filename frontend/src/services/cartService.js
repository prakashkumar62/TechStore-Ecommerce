import api from './api';

export const cartService = {
  getCart: async () => {
    const res = await api.get('/cart');
    return res.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const res = await api.post('/cart/items', { productId, quantity });
    return res.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const res = await api.patch(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },

  removeFromCart: async (itemId) => {
    const res = await api.delete(`/cart/items/${itemId}`);
    return res.data;
  },

  clearCart: async () => {
    const res = await api.delete('/cart');
    return res.data;
  },
};
