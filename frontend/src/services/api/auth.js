// src/services/api/auth.js
import api from './axios'

export const authService = {
  login: async (credentials) => {
    const { data } = await api.post('/api/auth/login', credentials)
    return data
  },

  register: async (userData) => {
    const { data } = await api.post('/api/auth/register', userData)
    return data
  },

  getCurrentUser: async () => {
    const { data } = await api.get('/api/auth/me')
    return data
  },

  logout: async () => {
    await api.post('/api/auth/logout')
  }
}