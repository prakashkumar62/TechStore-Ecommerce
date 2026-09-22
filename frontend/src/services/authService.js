import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/auth/profile');
    return res.data;
  },

  updateProfile: async (userData) => {
    const res = await api.put('/auth/profile', userData);
    return res.data;
  },

  addAddress: async (addressData) => {
    const res = await api.post('/auth/address', addressData);
    return res.data;
  },

  deleteAddress: async (addressId) => {
    const res = await api.delete(`/auth/address/${addressId}`);
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token, newPassword) => {
    const res = await api.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },
};
